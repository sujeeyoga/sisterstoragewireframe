// Marks a Shopify order as fulfilled with tracking info.
// Does NOT email the customer by default — our own shipping notification handles that.

import { getShopifyAdminToken, SHOPIFY_SHOP_DOMAIN } from "../_shared/shopify-token.ts";
import { getTrackingUrl } from "../_shared/tracking-url.ts";

const SHOPIFY_DOMAIN = SHOPIFY_SHOP_DOMAIN;
const API_VERSION = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Body {
  orderNumber: string; // e.g. "SS-12345678-ABCD" — matches the `name` we set on creation
  trackingNumber: string;
  trackingCompany?: string; // e.g. "Stallion Express", "Chit Chats", "Canada Post"
  trackingUrl?: string;
  notifyCustomer?: boolean;
}

const normalizeCarrier = (company?: string): string => {
  if (!company) return "Other";
  const lower = company.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (lower.includes("stallion")) return "Stallion Express";
  if (lower.includes("chitchat")) return "Chit Chats";
  if (lower.includes("canadapost")) return "Canada Post";
  if (lower.includes("ups")) return "UPS";
  if (lower.includes("fedex")) return "FedEx";
  if (lower.includes("usps")) return "USPS";
  if (lower.includes("purolator")) return "Purolator";
  return company;
};

async function shopify(path: string, init: RequestInit, token: string) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }
  return { ok: res.ok, status: res.status, text, json };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const token = await getShopifyAdminToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "Shopify credentials unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: Body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!body.orderNumber || !body.trackingNumber) {
    return new Response(JSON.stringify({ error: "orderNumber and trackingNumber required" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Find the Shopify order by name
    const findRes = await shopify(
      `orders.json?name=${encodeURIComponent(body.orderNumber)}&status=any&limit=1`,
      { method: "GET" },
      token,
    );
    if (!findRes.ok) {
      return new Response(JSON.stringify({ error: "Lookup failed", detail: findRes.text }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const order = findRes.json?.orders?.[0];
    if (!order) {
      return new Response(JSON.stringify({ error: "Shopify order not found", orderNumber: body.orderNumber }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Get fulfillment orders (required for the modern Fulfillments API)
    const foRes = await shopify(`orders/${order.id}/fulfillment_orders.json`, { method: "GET" }, token);
    if (!foRes.ok) {
      return new Response(JSON.stringify({ error: "Fulfillment orders lookup failed", detail: foRes.text }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const openFOs = (foRes.json?.fulfillment_orders || []).filter(
      (fo: any) => fo.status === "open" || fo.status === "in_progress",
    );
    if (openFOs.length === 0) {
      return new Response(JSON.stringify({ ok: true, skipped: "Already fulfilled or no open fulfillment orders" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Create the fulfillment with tracking
    const carrier = normalizeCarrier(body.trackingCompany);
    const trackingUrl = body.trackingUrl || getTrackingUrl(carrier, body.trackingNumber);

    const fulfillmentPayload = {
      fulfillment: {
        message: "Shipped via " + carrier,
        notify_customer: body.notifyCustomer === true,
        tracking_info: {
          number: body.trackingNumber,
          company: carrier,
          url: trackingUrl,
        },
        line_items_by_fulfillment_order: openFOs.map((fo: any) => ({
          fulfillment_order_id: fo.id,
        })),
      },
    };

    const createRes = await shopify("fulfillments.json", {
      method: "POST",
      body: JSON.stringify(fulfillmentPayload),
    }, token);

    if (!createRes.ok) {
      console.error("Fulfillment create failed", createRes.status, createRes.text);
      return new Response(JSON.stringify({ error: "Fulfillment create failed", status: createRes.status, detail: createRes.text }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("✅ Shopify fulfillment created", createRes.json?.fulfillment?.id, "for order", body.orderNumber);
    return new Response(JSON.stringify({ ok: true, fulfillment_id: createRes.json?.fulfillment?.id }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Exception:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
