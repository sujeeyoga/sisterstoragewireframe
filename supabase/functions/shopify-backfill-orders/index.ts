// Backfills historical Stripe checkout sessions into Shopify as paid orders.
// GET/POST params: limit, dryRun (default true), markShipped (default false), after (unix ts)

import { getShopifyAdminToken } from "../_shared/shopify-token.ts";

const SHOPIFY_DOMAIN = "n1wiud-ns.myshopify.com";
const API = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const money = (cents: number) => (Math.round(cents) / 100).toFixed(2);

function splitName(full?: string) {
  if (!full) return { first: "", last: "" };
  const p = full.trim().split(/\s+/);
  return p.length === 1 ? { first: p[0], last: "" } : { first: p[0], last: p.slice(1).join(" ") };
}

async function stripeGet(path: string, key: string) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Stripe ${path}: ${JSON.stringify(json).slice(0, 300)}`);
  return json;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 2000);
  const dryRun = (url.searchParams.get("dryRun") ?? "true") !== "false";
  const markShipped = url.searchParams.get("markShipped") === "true";
  const shipOlderThanDays = Number(url.searchParams.get("shipOlderThanDays") ?? "0");

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const token = await getShopifyAdminToken();
  if (!stripeKey || !token) {
    return new Response(JSON.stringify({ error: "Missing Stripe or Shopify credentials" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const sHeaders = { "Content-Type": "application/json", "X-Shopify-Access-Token": token };

  // Existing Shopify orders (to avoid duplicates) — page through all
  const existingOrders: any[] = [];
  let sinceId = 0;
  for (let p = 0; p < 20; p++) {
    const existingRes = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/${API}/orders.json?status=any&limit=250&since_id=${sinceId}&fields=id,name,note,tags`,
      { headers: sHeaders },
    );
    const existingJson = await existingRes.json().catch(() => ({ orders: [] }));
    const batch = existingJson.orders ?? [];
    if (!batch.length) break;
    existingOrders.push(...batch);
    sinceId = Math.max(...batch.map((o: any) => Number(o.id)));
    if (batch.length < 250) break;
  }
  const existingBlob = JSON.stringify(existingOrders);


  // Stripe completed sessions
  const sessions: any[] = [];
  let startingAfter: string | undefined;
  while (sessions.length < limit) {
    const page = await stripeGet(
      `checkout/sessions?limit=100&status=complete${startingAfter ? `&starting_after=${startingAfter}` : ""}`,
      stripeKey,
    );
    sessions.push(...page.data);
    if (!page.has_more || page.data.length === 0) break;
    startingAfter = page.data[page.data.length - 1].id;
  }

  const results: any[] = [];
  let created = 0;
  let skipped = 0;

  for (const s of sessions.slice(0, limit)) {
    if (s.payment_status !== "paid") { skipped++; continue; }
    if (existingBlob.includes(s.id)) {
      skipped++;
      results.push({ session: s.id, status: "already-in-shopify" });
      continue;
    }

    const li = await stripeGet(`checkout/sessions/${s.id}/line_items?limit=100`, stripeKey);
    const details = s.customer_details ?? {};
    const shipDetails = s.collected_information?.shipping_details ?? s.shipping_details ?? null;

    // Checkout stored the real shipping address in Stripe metadata
    let metaAddr: any = null;
    try {
      metaAddr = s.metadata?.shippingAddress ? JSON.parse(s.metadata.shippingAddress) : null;
    } catch { /* ignore */ }

    const addr = metaAddr
      ? {
          line1: metaAddr.address,
          city: metaAddr.city,
          state: metaAddr.state,
          postal_code: metaAddr.postal_code,
          country: metaAddr.country,
        }
      : (shipDetails?.address ?? details.address ?? {});
    const { first, last } = splitName(metaAddr?.name ?? shipDetails?.name ?? details.name);
    const orderName = s.metadata?.order_number ?? `SS-${s.id.slice(-8).toUpperCase()}`;

    const payload: Record<string, unknown> = {
      name: orderName,
      email: details.email ?? s.customer_email ?? undefined,
      phone: details.phone ?? undefined,
      financial_status: "paid",
      currency: (s.currency ?? "cad").toUpperCase(),
      inventory_behaviour: "bypass",
      send_receipt: false,
      send_fulfillment_receipt: false,
      processed_at: new Date(s.created * 1000).toISOString(),
      note: `Historical import from Stripe session ${s.id}`,
      tags: "stripe-backfill, sisterstorage-website",
      source_name: "sisterstorage.com",
      line_items: (li.data ?? []).map((item: any) => ({
        title: item.description ?? "Item",
        quantity: item.quantity ?? 1,
        price: money((item.amount_subtotal ?? 0) / (item.quantity || 1)),
        requires_shipping: true,
        taxable: false,
      })),
      transactions: [
        { kind: "sale", status: "success", amount: money(s.amount_total ?? 0), gateway: "stripe" },
      ],
    };

    if (addr?.line1 || addr?.city) {
      const a = {
        first_name: first,
        last_name: last,
        address1: addr.line1 ?? "",
        address2: addr.line2 ?? "",
        city: addr.city ?? "",
        province: addr.state ?? "",
        country: addr.country ?? "CA",
        zip: addr.postal_code ?? "",
        phone: details.phone ?? undefined,
      };
      payload.shipping_address = a;
      payload.billing_address = a;
    }

    const shipCost = s.total_details?.amount_shipping ?? 0;
    if (shipCost > 0) {
      payload.shipping_lines = [{ title: "Shipping", price: money(shipCost), code: "Standard" }];
    }
    const taxAmt = s.total_details?.amount_tax ?? 0;
    if (taxAmt > 0) {
      payload.tax_lines = [{ title: "Tax", price: money(taxAmt), rate: 0 }];
      payload.taxes_included = false;
    }

    if (dryRun) {
      results.push({ session: s.id, status: "would-create", orderName, total: money(s.amount_total ?? 0), metadata: s.metadata, hasAddress: Boolean(payload.shipping_address), items: (payload.line_items as any[]).length });
      continue;
    }

    const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API}/orders.json`, {
      method: "POST",
      headers: sHeaders,
      body: JSON.stringify({ order: payload }),
    });
    const text = await res.text();
    if (!res.ok) {
      results.push({ session: s.id, status: "failed", httpStatus: res.status, body: text.slice(0, 300) });
      continue;
    }
    const orderId = JSON.parse(text)?.order?.id;
    created++;
    const entry: any = { session: s.id, status: "created", orderName, shopifyOrderId: orderId };

    const ageDays = (Date.now() / 1000 - s.created) / 86400;
    const shouldShip = markShipped && (shipOlderThanDays <= 0 || ageDays >= shipOlderThanDays);

    if (shouldShip && orderId) {
      try {
        const foRes = await fetch(
          `https://${SHOPIFY_DOMAIN}/admin/api/${API}/orders/${orderId}/fulfillment_orders.json`,
          { headers: sHeaders },
        );
        const fo = await foRes.json();
        const ids = (fo.fulfillment_orders ?? []).map((f: any) => ({ fulfillment_order_id: f.id }));
        if (ids.length) {
          const fRes = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API}/fulfillments.json`, {
            method: "POST",
            headers: sHeaders,
            body: JSON.stringify({
              fulfillment: { line_items_by_fulfillment_order: ids, notify_customer: false },
            }),
          });
          entry.fulfilled = fRes.ok;
          if (!fRes.ok) entry.fulfillError = (await fRes.text()).slice(0, 200);
        }
      } catch (e) {
        entry.fulfillError = String(e);
      }
    }

    results.push(entry);
    await new Promise((r) => setTimeout(r, 600)); // stay under Shopify rate limit
  }

  return new Response(
    JSON.stringify({ dryRun, scanned: sessions.length, created, skipped, results }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
