// Mirrors website active carts into Shopify as customer records.
// Carts with an email become/update a Shopify customer tagged "active-cart"
// with a note describing the cart. Customers whose cart is gone get cleaned up.
// Params: dryRun (default true), limit (default 200)

import { createClient } from "npm:@supabase/supabase-js@2";
import { getShopifyAdminToken, SHOPIFY_SHOP_DOMAIN } from "../_shared/shopify-token.ts";

const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";
const API = "2025-07";
const TAG = "active-cart";
const NOTE_PREFIX = "Active cart";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function splitName(full?: string | null) {
  if (!full) return { first: "", last: "" };
  const p = String(full).trim().split(/\s+/);
  return p.length === 1 ? { first: p[0], last: "" } : { first: p[0], last: p.slice(1).join(" ") };
}

function buildNote(cart: any): string {
  const items = Array.isArray(cart.cart_items) ? cart.cart_items : [];
  const summary = items
    .map((i: any) => `${i.quantity ?? 1}x ${i.name ?? "Item"}`)
    .join(", ");
  const when = new Date(cart.last_updated ?? cart.created_at ?? Date.now()).toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const total = Number(cart.subtotal ?? 0).toFixed(2);
  return `${NOTE_PREFIX} (updated ${when}) - ${summary || "no items"} - $${total} CAD`;
}

function mergeTags(existing: string | null | undefined, add: string): string {
  const set = new Set(
    String(existing ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  );
  set.add(add);
  return Array.from(set).join(", ");
}

function stripTag(existing: string | null | undefined, remove: string): string {
  return String(existing ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t && t.toLowerCase() !== remove.toLowerCase())
    .join(", ");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  let dryRun = (url.searchParams.get("dryRun") ?? "true") !== "false";
  let limit = Math.min(Number(url.searchParams.get("limit") ?? "200"), 1000);

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (typeof body?.dryRun === "boolean") dryRun = body.dryRun;
      if (Number(body?.limit) > 0) limit = Math.min(Number(body.limit), 1000);
    } catch (_e) { /* cron sends {time}; ignore */ }
  }

  const legacyKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
  const token = await getShopifyAdminToken();
  if (!legacyKey || !token) {
    return new Response(
      JSON.stringify({ error: "Missing cart database key or Shopify credentials" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const sHeaders = { "Content-Type": "application/json", "X-Shopify-Access-Token": token };
  const db = createClient(LEGACY_URL, legacyKey, { auth: { persistSession: false } });

  // 1. Load active (unconverted) carts
  const { data: carts, error: cartError } = await db
    .from("active_carts")
    .select("*")
    .is("converted_at", null)
    .order("last_updated", { ascending: false })
    .limit(limit);

  if (cartError) {
    return new Response(JSON.stringify({ error: `Cart lookup failed: ${cartError.message}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const allCarts = carts ?? [];
  const withEmail = allCarts.filter((c: any) => c.email && String(c.email).includes("@"));
  const skippedNoEmail = allCarts.length - withEmail.length;

  // Enrich with visitor location where available
  const sessionIds = withEmail.map((c: any) => c.session_id).filter(Boolean);
  const locations = new Map<string, { city?: string; country?: string }>();
  if (sessionIds.length) {
    const { data: visitors } = await db
      .from("visitor_analytics")
      .select("session_id, city, country")
      .in("session_id", sessionIds);
    for (const v of visitors ?? []) {
      if (v.session_id && !locations.has(v.session_id)) {
        locations.set(v.session_id, { city: v.city ?? undefined, country: v.country ?? undefined });
      }
    }
  }

  const results: any[] = [];
  let created = 0;
  let updated = 0;
  let failed = 0;
  const activeEmails = new Set<string>();

  for (const cart of withEmail) {
    const email = String(cart.email).trim().toLowerCase();
    activeEmails.add(email);
    const note = buildNote(cart);

    if (dryRun) {
      results.push({ email, action: "would-sync", note });
      continue;
    }

    try {
      const searchRes = await fetch(
        `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/customers/search.json?query=${encodeURIComponent(`email:${email}`)}`,
        { headers: sHeaders },
      );
      const searchJson = await searchRes.json().catch(() => ({ customers: [] }));
      const existing = (searchJson.customers ?? [])[0];

      if (existing) {
        const res = await fetch(
          `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/customers/${existing.id}.json`,
          {
            method: "PUT",
            headers: sHeaders,
            body: JSON.stringify({
              customer: { id: existing.id, note, tags: mergeTags(existing.tags, TAG) },
            }),
          },
        );
        if (res.ok) {
          updated++;
          results.push({ email, action: "updated", customerId: existing.id });
        } else {
          failed++;
          results.push({ email, action: "update-failed", body: (await res.text()).slice(0, 300) });
        }
      } else {
        const loc = locations.get(cart.session_id) ?? {};
        const { first, last } = splitName(cart.customer_name ?? null);
        const payload: Record<string, unknown> = {
          email,
          first_name: first || undefined,
          last_name: last || undefined,
          note,
          tags: TAG,
          accepts_marketing: false,
          verified_email: false,
        };
        if (loc.city || loc.country) {
          payload.addresses = [{ city: loc.city ?? "", country_code: loc.country ?? "CA" }];
        }
        const res = await fetch(`https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/customers.json`, {
          method: "POST",
          headers: sHeaders,
          body: JSON.stringify({ customer: payload }),
        });
        const text = await res.text();
        if (res.ok) {
          created++;
          results.push({ email, action: "created", customerId: JSON.parse(text)?.customer?.id });
        } else {
          failed++;
          results.push({ email, action: "create-failed", httpStatus: res.status, body: text.slice(0, 300) });
        }
      }
    } catch (e) {
      failed++;
      results.push({ email, action: "error", error: String(e) });
    }

    await sleep(600);
  }

  // 2. Clean up customers tagged active-cart whose cart is gone
  let cleaned = 0;
  if (!dryRun) {
    try {
      const tagRes = await fetch(
        `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/customers/search.json?query=${encodeURIComponent(`tag:${TAG}`)}&limit=250`,
        { headers: sHeaders },
      );
      const tagged = (await tagRes.json().catch(() => ({ customers: [] }))).customers ?? [];
      for (const c of tagged) {
        const email = String(c.email ?? "").trim().toLowerCase();
        if (!email || activeEmails.has(email)) continue;
        const nextNote = String(c.note ?? "").startsWith(NOTE_PREFIX) ? "" : c.note;
        const res = await fetch(
          `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/customers/${c.id}.json`,
          {
            method: "PUT",
            headers: sHeaders,
            body: JSON.stringify({
              customer: { id: c.id, note: nextNote, tags: stripTag(c.tags, TAG) },
            }),
          },
        );
        if (res.ok) {
          cleaned++;
          results.push({ email, action: "cleared" });
        }
        await sleep(600);
      }
    } catch (e) {
      results.push({ action: "cleanup-error", error: String(e) });
    }
  }

  return new Response(
    JSON.stringify(
      {
        dryRun,
        carts_found: allCarts.length,
        skipped_no_email: skippedNoEmail,
        created,
        updated,
        cleared: cleaned,
        failed,
        results,
      },
      null,
      2,
    ),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
