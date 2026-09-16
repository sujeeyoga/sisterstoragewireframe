import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "npm:ai@5";
import { createOpenAI } from "npm:@ai-sdk/openai@2";
import { z } from "npm:zod@3.23.8";
import { getShopifyAdminToken, SHOPIFY_SHOP_DOMAIN } from "../_shared/shopify-token.ts";
import { ADMIN_GUIDE } from "./guide.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";
const API_VERSION = "2025-07";

async function shopify(path: string): Promise<any> {
  const token = await getShopifyAdminToken();
  if (!token) throw new Error("Shopify is not connected");
  const res = await fetch(`https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API_VERSION}/${path}`, {
    headers: { "X-Shopify-Access-Token": token, "Content-Type": "application/json" },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Shopify request failed (${res.status})`);
  return JSON.parse(text);
}

function summariseOrder(o: any) {
  return {
    order_number: o.name,
    placed: o.created_at,
    customer: [o.customer?.first_name, o.customer?.last_name].filter(Boolean).join(" ") || null,
    email: o.email ?? null,
    payment_status: o.financial_status,
    fulfillment_status: o.fulfillment_status ?? "unfulfilled",
    total: `${o.total_price} ${o.currency}`,
    shipping_address: o.shipping_address
      ? `${o.shipping_address.address1 ?? ""}, ${o.shipping_address.city ?? ""}, ${o.shipping_address.province_code ?? ""} ${o.shipping_address.zip ?? ""}, ${o.shipping_address.country_code ?? ""}`
      : null,
    items: (o.line_items ?? []).map((li: any) => `${li.quantity}x ${li.title}`),
    tracking: (o.fulfillments ?? []).flatMap((f: any) =>
      (f.tracking_numbers ?? []).map((n: string, i: number) => ({
        number: n,
        company: f.tracking_company ?? null,
        url: f.tracking_urls?.[i] ?? null,
      }))
    ),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const serviceKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) throw new Error("Assistant is not configured");
    const db = createClient(LEGACY_URL, serviceKey, { auth: { persistSession: false } });

    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "Please sign in to the admin first." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: userError } = await db.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Please sign in to the admin first." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("Assistant is not configured");

    const { messages }: { messages: UIMessage[] } = await req.json();

    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: lovableApiKey,
      headers: {
        "Lovable-API-Key": lovableApiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: `${ADMIN_GUIDE}\n\nToday is ${new Date().toISOString().slice(0, 10)}. Currency is CAD.`,
      messages: await convertToModelMessages(messages),
      stopWhen: stepCountIs(50),
      tools: {
        lookup_order: tool({
          description:
            "Look up real orders by order number (e.g. SS-GR6RBI7F) or by customer email. Returns status, items, total, address and tracking.",
          inputSchema: z.object({
            order_number: z.string().nullable().describe("Order number, or null"),
            email: z.string().nullable().describe("Customer email, or null"),
          }),
          execute: async ({ order_number, email }) => {
            if (order_number) {
              const d = await shopify(
                `orders.json?name=${encodeURIComponent(order_number)}&status=any&limit=5`,
              );
              return { orders: (d.orders ?? []).map(summariseOrder) };
            }
            if (email) {
              const d = await shopify(
                `orders.json?email=${encodeURIComponent(email)}&status=any&limit=10`,
              );
              return { orders: (d.orders ?? []).map(summariseOrder) };
            }
            return { error: "Provide an order number or an email." };
          },
        }),

        store_metrics: tool({
          description:
            "Order count, revenue and how many orders are still awaiting fulfilment over the last N days.",
          inputSchema: z.object({
            days: z.number().describe("How many days back to look, e.g. 1, 7, 30, 90"),
          }),
          execute: async ({ days }) => {
            const since = new Date(Date.now() - Math.max(1, days) * 86400000).toISOString();
            const d = await shopify(
              `orders.json?status=any&limit=250&created_at_min=${encodeURIComponent(since)}`,
            );
            const orders = d.orders ?? [];
            const paid = orders.filter((o: any) => o.financial_status === "paid");
            const revenue = paid.reduce((s: number, o: any) => s + Number(o.total_price || 0), 0);
            const unfulfilled = orders.filter((o: any) => !o.fulfillment_status).length;
            return {
              period_days: days,
              orders: orders.length,
              paid_orders: paid.length,
              revenue: `$${revenue.toFixed(2)} CAD`,
              awaiting_fulfillment: unfulfilled,
              note: orders.length >= 250 ? "Capped at the 250 most recent orders." : null,
            };
          },
        }),

        lookup_product: tool({
          description: "Find products by name and return price and stock on hand.",
          inputSchema: z.object({
            name: z.string().describe("Part of the product title"),
          }),
          execute: async ({ name }) => {
            const d = await shopify(`products.json?limit=250`);
            const needle = name.toLowerCase();
            const matches = (d.products ?? [])
              .filter((p: any) => String(p.title).toLowerCase().includes(needle))
              .slice(0, 10)
              .map((p: any) => ({
                title: p.title,
                status: p.status,
                variants: (p.variants ?? []).map((v: any) => ({
                  name: v.title,
                  price: `$${v.price}`,
                  stock: v.inventory_quantity,
                })),
              }));
            return { matches, found: matches.length };
          },
        }),
      },
      providerOptions: {
        openai: {
          store: false,
          include: ["reasoning.encrypted_content"],
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
        },
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      headers: corsHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    console.error("admin-assistant error", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
