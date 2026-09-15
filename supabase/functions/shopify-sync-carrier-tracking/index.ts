// Pushes Stallion Express and Chit Chats shipments into Shopify as fulfillments
// with the right carrier name and a working tracking link.
//   GET ?dryRun=true|false&limit=50&carrier=all|stallion|chitchats&notify=false
//
// Matching: Shopify order looked up by the shipment's recipient email; when the
// email is missing we fall back to matching name + postal code on unfulfilled orders.

import { getShopifyAdminToken, SHOPIFY_SHOP_DOMAIN } from "../_shared/shopify-token.ts";
import { getTrackingUrl } from "../_shared/tracking-url.ts";

const API = "2025-07";
const STALLION_BASE = "https://ship.stallionexpress.ca/api/v4";
const CHITCHATS_BASE = "https://chitchats.com/api/v1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const norm = (v: unknown) => String(v ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");

interface Shipment {
  carrier: "Stallion Express" | "Chit Chats";
  trackingNumber: string;
  email?: string | null;
  name?: string | null;
  postal?: string | null;
  shipmentId?: string | number;
}

async function fetchStallion(limit: number): Promise<{ shipments: Shipment[]; error?: string }> {
  const token = Deno.env.get("STALLION_EXPRESS_API_TOKEN");
  if (!token) return { shipments: [], error: "Stallion API token not configured" };

  const res = await fetch(`${STALLION_BASE}/shipments?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
  const text = await res.text();
  if (!res.ok) return { shipments: [], error: `Stallion ${res.status}: ${text.slice(0, 200)}` };

  let json: any = null;
  try { json = JSON.parse(text); } catch { return { shipments: [], error: "Stallion: bad JSON" }; }
  const rows = json?.data ?? json?.shipments ?? (Array.isArray(json) ? json : []);

  return {
    shipments: (rows ?? [])
      .map((s: any) => ({
        carrier: "Stallion Express" as const,
        trackingNumber: s.tracking_code ?? s.tracking_number ?? "",
        email: s.email ?? s.recipient_email ?? null,
        name: s.name ?? s.recipient_name ?? null,
        postal: s.postal_code ?? s.zip ?? null,
        shipmentId: s.id,
      }))
      .filter((s: Shipment) => s.trackingNumber),
  };
}

async function fetchChitChats(limit: number): Promise<{ shipments: Shipment[]; error?: string }> {
  const token = Deno.env.get("CHITCHATS_API_TOKEN");
  const clientId = Deno.env.get("CHITCHATS_CLIENT_ID");
  if (!token || !clientId) return { shipments: [], error: "Chit Chats credentials not configured" };

  const res = await fetch(`${CHITCHATS_BASE}/clients/${clientId}/shipments?limit=${limit}`, {
    headers: { Authorization: token, Accept: "application/json" },
  });
  const text = await res.text();
  if (!res.ok) return { shipments: [], error: `Chit Chats ${res.status}: ${text.slice(0, 200)}` };

  let json: any = null;
  try { json = JSON.parse(text); } catch { return { shipments: [], error: "Chit Chats: bad JSON" }; }
  const rows = json?.shipments ?? json?.data ?? (Array.isArray(json) ? json : []);

  return {
    shipments: (rows ?? [])
      .map((s: any) => ({
        carrier: "Chit Chats" as const,
        trackingNumber: s.tracking_number ?? s.tracking_code ?? "",
        email: s.to_email ?? s.email ?? null,
        name: s.to_name ?? s.name ?? null,
        postal: s.to_postal_code ?? s.postal_code ?? null,
        shipmentId: s.id,
      }))
      .filter((s: Shipment) => s.trackingNumber),
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const dryRun = (url.searchParams.get("dryRun") ?? "true") !== "false";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 250);
  const which = url.searchParams.get("carrier") ?? "all";
  const notify = url.searchParams.get("notify") === "true";

  const token = await getShopifyAdminToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "Shopify credentials unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const sHeaders = { "Content-Type": "application/json", "X-Shopify-Access-Token": token };

  const errors: string[] = [];
  const shipments: Shipment[] = [];

  if (which === "all" || which === "stallion") {
    const r = await fetchStallion(limit);
    if (r.error) errors.push(r.error);
    shipments.push(...r.shipments);
  }
  if (which === "all" || which === "chitchats") {
    const r = await fetchChitChats(limit);
    if (r.error) errors.push(r.error);
    shipments.push(...r.shipments);
  }

  // Every Shopify order (paginated) — used for the name/postal fallback match and
  // to collect tracking numbers that are already recorded.
  const unfulfilled: any[] = [];
  try {
    let next: string | null =
      `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/orders.json?status=any&limit=250&fields=id,name,email,shipping_address,fulfillment_status,fulfillments`;
    let pages = 0;
    while (next && pages < 12) {
      const res: Response = await fetch(next, { headers: sHeaders });
      const json = await res.json().catch(() => ({ orders: [] }));
      unfulfilled.push(...(json.orders ?? []));
      const link = res.headers.get("link") ?? "";
      const m = link.match(/<([^>]+)>;\s*rel="next"/);
      next = m ? m[1] : null;
      pages++;
      if (next) await sleep(300);
    }
  } catch (e) {
    errors.push(`Shopify order list failed: ${String(e)}`);
  }

  // Tracking numbers already recorded in Shopify — never attach the same one twice
  const usedTracking = new Set<string>();
  for (const o of unfulfilled) {
    for (const f of o.fulfillments ?? []) {
      if (f.tracking_number) usedTracking.add(norm(f.tracking_number));
      for (const t of f.tracking_numbers ?? []) usedTracking.add(norm(t));
    }
  }

  const results: any[] = [];
  let fulfilled = 0;
  let unmatched = 0;
  let failed = 0;
  let alreadyInShopify = 0;

  for (const s of shipments) {
    if (usedTracking.has(norm(s.trackingNumber))) {
      alreadyInShopify++;
      results.push({ carrier: s.carrier, tracking: s.trackingNumber, status: "already-in-shopify" });
      continue;
    }
    // 1. Find the order
    let order: any = null;
    if (s.email) {
      try {
        const res = await fetch(
          `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/orders.json?status=any&email=${encodeURIComponent(s.email)}&limit=10&fields=id,name,email,fulfillment_status,shipping_address`,
          { headers: sHeaders },
        );
        const json = await res.json().catch(() => ({ orders: [] }));
        const candidates = (json.orders ?? []).filter((o: any) => o.fulfillment_status !== "fulfilled");
        order = candidates[0] ?? null;
      } catch (_e) { /* fall through to fallback */ }
    }
    if (!order && (s.name || s.postal)) {
      order = unfulfilled.find((o: any) => {
        const a = o.shipping_address ?? {};
        const nameMatch = s.name
          ? norm(`${a.first_name ?? ""}${a.last_name ?? ""}`) === norm(s.name).replace(/\s/g, "")
          : false;
        const postalMatch = s.postal ? norm(a.zip) === norm(s.postal) : false;
        return (nameMatch && postalMatch) || (postalMatch && !s.name);
      }) ?? null;
    }

    if (!order) {
      unmatched++;
      results.push({ carrier: s.carrier, tracking: s.trackingNumber, status: "no-matching-order" });
      continue;
    }

    const trackingUrl = getTrackingUrl(s.carrier, s.trackingNumber);

    if (dryRun) {
      results.push({
        carrier: s.carrier,
        tracking: s.trackingNumber,
        status: "would-fulfill",
        order: order.name,
        trackingUrl,
      });
      continue;
    }

    try {
      const foRes = await fetch(
        `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/orders/${order.id}/fulfillment_orders.json`,
        { headers: sHeaders },
      );
      const fo = await foRes.json().catch(() => ({ fulfillment_orders: [] }));
      const open = (fo.fulfillment_orders ?? []).filter(
        (f: any) => f.status === "open" || f.status === "in_progress",
      );
      if (!open.length) {
        // Already fulfilled (e.g. by the historical import) — attach tracking to
        // the existing fulfillment instead of creating a new one.
        const fRes = await fetch(
          `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/orders/${order.id}/fulfillments.json`,
          { headers: sHeaders },
        );
        const fJson = await fRes.json().catch(() => ({ fulfillments: [] }));
        const target = (fJson.fulfillments ?? []).find((f: any) => f.status !== "cancelled");
        if (!target) {
          results.push({
            carrier: s.carrier, tracking: s.trackingNumber, order: order.name,
            status: "no-fulfillment-to-update",
            debug: {
              foStatuses: (fo.fulfillment_orders ?? []).map((f: any) => f.status),
              fRes: fRes.status,
              fBody: JSON.stringify(fJson).slice(0, 300),
            },
          });
          continue;
        }
        if (target.tracking_number === s.trackingNumber) {
          results.push({ carrier: s.carrier, tracking: s.trackingNumber, order: order.name, status: "tracking-already-set" });
          continue;
        }
        const uRes = await fetch(
          `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/fulfillments/${target.id}/update_tracking.json`,
          {
            method: "POST",
            headers: sHeaders,
            body: JSON.stringify({
              fulfillment: {
                notify_customer: notify,
                tracking_info: {
                  number: s.trackingNumber,
                  company: s.carrier,
                  ...(trackingUrl ? { url: trackingUrl } : {}),
                },
              },
            }),
          },
        );
        const uText = await uRes.text();
        if (uRes.ok) {
          fulfilled++;
          results.push({ carrier: s.carrier, tracking: s.trackingNumber, order: order.name, status: "tracking-added" });
        } else {
          failed++;
          results.push({
            carrier: s.carrier, tracking: s.trackingNumber, order: order.name,
            status: "tracking-update-failed", httpStatus: uRes.status, body: uText.slice(0, 300),
          });
        }
        await sleep(600);
        continue;
      }

      const res = await fetch(`https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/fulfillments.json`, {
        method: "POST",
        headers: sHeaders,
        body: JSON.stringify({
          fulfillment: {
            notify_customer: notify,
            tracking_info: {
              number: s.trackingNumber,
              company: s.carrier,
              ...(trackingUrl ? { url: trackingUrl } : {}),
            },
            line_items_by_fulfillment_order: open.map((f: any) => ({ fulfillment_order_id: f.id })),
          },
        }),
      });
      const text = await res.text();
      if (res.ok) {
        fulfilled++;
        results.push({ carrier: s.carrier, tracking: s.trackingNumber, order: order.name, status: "fulfilled" });
      } else {
        failed++;
        results.push({
          carrier: s.carrier, tracking: s.trackingNumber, order: order.name,
          status: "fulfill-failed", httpStatus: res.status, body: text.slice(0, 300),
        });
      }
    } catch (e) {
      failed++;
      results.push({ carrier: s.carrier, tracking: s.trackingNumber, status: "error", error: String(e) });
    }

    await sleep(600);
  }

  return new Response(
    JSON.stringify({
      dryRun,
      shipments_found: shipments.length,
      fulfilled,
      unmatched,
      alreadyInShopify,
      failed,
      carrierErrors: errors,
      results,
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
