// Pulls the latest fulfillment/tracking info from a Shopify order back into the admin record.
// Called from the admin OrderDrawer or OrdersList bulk action.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { getShopifyAdminToken, SHOPIFY_SHOP_DOMAIN } from "../_shared/shopify-token.ts";

const SHOPIFY_DOMAIN = SHOPIFY_SHOP_DOMAIN;
const API_VERSION = "2025-07";
const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";

interface Body {
  orderNumber: string; // e.g. "SS-12345678-ABCD" — the Shopify order `name`
}

function normalizeCarrier(raw?: string | null): string {
  if (!raw) return "Other";
  const lower = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (lower.includes("stallion")) return "Stallion Express";
  if (lower.includes("chitchat")) return "ChitChats";
  if (lower.includes("canadapost")) return "Canada Post";
  if (lower.includes("ups")) return "UPS";
  if (lower.includes("fedex")) return "FedEx";
  if (lower.includes("usps")) return "USPS";
  if (lower.includes("purolator")) return "Purolator";
  return raw;
}

async function shopifyAdmin(path: string, token: string) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/${path}`, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
  return { ok: res.ok, status: res.status, text, json };
}

async function verifyAdmin(req: Request): Promise<{ ok: false; response: Response } | { ok: true; userId: string }> {
  const serviceKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Server not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Please sign in to the admin first." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  const db = createClient(LEGACY_URL, serviceKey, { auth: { persistSession: false } });
  const { data: { user }, error: userError } = await db.auth.getUser(token);
  if (userError || !user) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Please sign in to the admin first." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  const { data: roleData } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Admin access required." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }),
    };
  }

  return { ok: true, userId: user.id };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const adminCheck = await verifyAdmin(req);
  if (!adminCheck.ok) return adminCheck.response;

  const token = await getShopifyAdminToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "Shopify credentials not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
  if (!orderNumber) {
    return new Response(JSON.stringify({ error: "orderNumber is required" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const findRes = await shopifyAdmin(
      `orders.json?name=${encodeURIComponent(orderNumber)}&status=any&limit=1`,
      token,
    );

    if (!findRes.ok) {
      console.error("Shopify order lookup failed", findRes.status, findRes.text);
      return new Response(JSON.stringify({ error: "Could not reach Shopify" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const shopifyOrder = findRes.json?.orders?.[0];
    if (!shopifyOrder) {
      return new Response(
        JSON.stringify({ success: false, notFound: true, error: "No matching Shopify order found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Shopify returns fulfillments as an array directly on the order.
    const fulfillments = shopifyOrder.fulfillments || [];
    const fulfillment = fulfillments.find((f: any) =>
      Array.isArray(f.tracking_numbers) && f.tracking_numbers.length > 0
    ) || fulfillments[0];

    const trackingNumbers = Array.isArray(fulfillment?.tracking_numbers) ? fulfillment.tracking_numbers : [];
    const trackingUrls = Array.isArray(fulfillment?.tracking_urls) ? fulfillment.tracking_urls : [];

    if (!fulfillment || trackingNumbers.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          noTracking: true,
          shopifyOrderId: String(shopifyOrder.id),
          fulfillmentStatus: shopifyOrder.fulfillment_status || "unfulfilled",
          error: "Shopify order exists but has no tracking information yet",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const trackingNumber = String(trackingNumbers[0]).trim();
    const carrier = normalizeCarrier(fulfillment.tracking_company);
    const trackingUrl = trackingUrls[0] ? String(trackingUrls[0]) : null;
    const fulfilledAt = fulfillment.created_at || null;

    return new Response(
      JSON.stringify({
        success: true,
        shopifyOrderId: String(shopifyOrder.id),
        orderNumber: shopifyOrder.name || orderNumber,
        fulfillmentStatus: shopifyOrder.fulfillment_status || "fulfilled",
        trackingNumber,
        carrier,
        trackingUrl,
        fulfilledAt,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("shopify-pull-fulfillment error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
