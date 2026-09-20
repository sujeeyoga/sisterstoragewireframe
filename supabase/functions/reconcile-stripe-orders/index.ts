// Safety net: finds paid Stripe checkout sessions that never became orders
// (e.g. if a webhook delivery failed) and creates them, sending the
// confirmation email and pushing the order to Shopify.
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";
const SHOPIFY_FN_URL = "https://zkmxforzmhpzftbvnixi.supabase.co/functions/v1/shopify-create-order";
const SHOPIFY_FN_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbXhmb3J6bWhwemZ0YnZuaXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDA4OTAsImV4cCI6MjA5NDA3Njg5MH0.RUmXUYhyA5FXspWI7XDX82LLcVdpFFzQxpVB4wqLO9A";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

function classify(name: string): "product" | "shipping" | "tax" | "gift_wrapping" {
  const n = name.toLowerCase();
  if (n.includes("gift wrap")) return "gift_wrapping";
  if (n.includes("tax")) return "tax";
  if (["shipping", "delivery", "intelcom", "canada post", "purolator", "ups", "fedex", "dhl", "stallion", "chit chats"].some((k) => n.includes(k))) {
    return "shipping";
  }
  return "product";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const legacyKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!legacyKey) {
    return new Response(JSON.stringify({ error: "Legacy database key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabase = createClient(LEGACY_URL, legacyKey);

  let lookbackDays = 3;
  try {
    const body = await req.json();
    if (Number(body?.lookbackDays) > 0) lookbackDays = Math.min(Number(body.lookbackDays), 30);
  } catch (_e) { /* default */ }

  const since = Math.floor(Date.now() / 1000) - lookbackDays * 86400;
  const created: string[] = [];
  const skipped: string[] = [];
  const errors: string[] = [];

  try {
    const sessions = await stripe.checkout.sessions.list({ limit: 100, created: { gte: since } });

    for (const s of sessions.data) {
      if (s.payment_status !== "paid") { skipped.push(`${s.id}: unpaid`); continue; }

      const { data: existing } = await supabase
        .from("orders")
        .select("id")
        .eq("stripe_session_id", s.id)
        .maybeSingle();
      if (existing) { skipped.push(`${s.id}: already recorded`); continue; }

      const customerEmail = s.customer_email || s.customer_details?.email;
      if (!customerEmail) { skipped.push(`${s.id}: no email`); continue; }

      const lineItems = await stripe.checkout.sessions.listLineItems(s.id, { limit: 100 });
      const products = lineItems.data.filter((i) => classify(i.description || "") === "product");
      const shipping = lineItems.data
        .filter((i) => classify(i.description || "") === "shipping")
        .reduce((sum, i) => sum + (i.amount_total || 0) / 100, 0);
      const tax = lineItems.data
        .filter((i) => classify(i.description || "") === "tax")
        .reduce((sum, i) => sum + (i.amount_total || 0) / 100, 0);

      const items = products.map((i) => {
        const qty = i.quantity || 1;
        return {
          name: i.description || "Product",
          quantity: qty,
          price: ((i.amount_total || 0) / qty) / 100,
        };
      });
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const total = (s.amount_total || 0) / 100;

      const shippingAddress = s.metadata?.shippingAddress ? JSON.parse(s.metadata.shippingAddress) : null;
      const shippingMetadata = s.metadata?.shippingMetadata ? JSON.parse(s.metadata.shippingMetadata) : null;

      const orderNumber = `SS-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const address = shippingAddress
        ? {
            name: shippingAddress.name || s.customer_details?.name || "",
            address: shippingAddress.address || shippingAddress.line1 || "",
            city: shippingAddress.city || "",
            state: shippingAddress.province || shippingAddress.state || "",
            postal_code: shippingAddress.postal_code || shippingAddress.postalCode || "",
            country: shippingAddress.country || "CA",
          }
        : null;

      const { data: newOrder, error: insertError } = await supabase
        .from("orders")
        .insert({
          stripe_session_id: s.id,
          stripe_payment_intent_id: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null,
          customer_email: customerEmail,
          customer_name: address?.name || s.customer_details?.name || "Customer",
          customer_phone: s.metadata?.customerPhone || null,
          order_number: orderNumber,
          items,
          subtotal,
          shipping,
          shipping_metadata: shippingMetadata,
          tax,
          total,
          shipping_address: address,
          status: "pending",
          payment_status: "paid",
        })
        .select("id")
        .single();

      if (insertError) { errors.push(`${s.id}: ${insertError.message}`); continue; }

      created.push(orderNumber);

      const emailData = {
        customerName: address?.name || s.customer_details?.name || "Customer",
        orderNumber,
        orderDate: new Date((s.created || 0) * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: address,
        orderId: newOrder.id,
      };

      await supabase.functions.invoke("send-email", {
        body: { type: "order_confirmation", to: customerEmail, data: emailData },
      }).catch((e: unknown) => errors.push(`${orderNumber}: email ${String(e)}`));

      await fetch(SHOPIFY_FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SHOPIFY_FN_ANON,
          Authorization: `Bearer ${SHOPIFY_FN_ANON}`,
        },
        body: JSON.stringify({
          orderNumber,
          customerEmail,
          customerName: emailData.customerName,
          customerPhone: s.metadata?.customerPhone || null,
          items,
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress: address,
          stripeSessionId: s.id,
        }),
      }).catch((e: unknown) => errors.push(`${orderNumber}: shopify ${String(e)}`));
    }

    return new Response(JSON.stringify({ ok: true, lookbackDays, created, createdCount: created.length, skippedCount: skipped.length, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error", created, errors }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
