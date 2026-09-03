// Diagnostic: count orders/customers in WooCommerce and Stripe. Read-only.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const report: Record<string, unknown> = {};

  // --- WooCommerce ---
  try {
    const base = Deno.env.get("WOOCOMMERCE_BASE_URL");
    const ck = Deno.env.get("WOOCOMMERCE_CONSUMER_KEY");
    const cs = Deno.env.get("WOOCOMMERCE_CONSUMER_SECRET");
    if (base && ck && cs) {
      const auth = btoa(`${ck}:${cs}`);
      const res = await fetch(`${base.replace(/\/$/, "")}/wp-json/wc/v3/orders?per_page=100&page=1&status=any`, {
        headers: { Authorization: `Basic ${auth}` },
      });
      if (res.ok) {
        const orders = await res.json();
        const total = res.headers.get("x-wp-total");
        report.woocommerce = {
          ok: true,
          total_orders: total ?? orders.length,
          recent: orders.slice(0, 5).map((o: Record<string, unknown>) => ({
            id: o.id,
            number: o.number,
            status: o.status,
            date: o.date_created,
            total: o.total,
            currency: o.currency,
            email: (o.billing as Record<string, unknown> | undefined)?.email,
          })),
        };
      } else {
        report.woocommerce = { ok: false, status: res.status, body: (await res.text()).slice(0, 300) };
      }
    } else {
      report.woocommerce = { ok: false, error: "missing env" };
    }
  } catch (e) {
    report.woocommerce = { ok: false, error: String(e) };
  }

  // --- Stripe ---
  try {
    const sk = Deno.env.get("STRIPE_SECRET_KEY");
    if (sk) {
      const res = await fetch("https://api.stripe.com/v1/payment_intents?limit=100", {
        headers: { Authorization: `Bearer ${sk}` },
      });
      if (res.ok) {
        const data = await res.json();
        const intents = data.data || [];
        report.stripe = {
          ok: true,
          recent_payment_intents: intents.length,
          has_more: data.has_more,
          recent: intents.slice(0, 5).map((p: Record<string, unknown>) => ({
            id: p.id,
            amount: (p.amount as number) / 100,
            currency: p.currency,
            status: p.status,
            created: new Date((p.created as number) * 1000).toISOString(),
            email: (p.receipt_email as string) || null,
          })),
        };
      } else {
        report.stripe = { ok: false, status: res.status, body: (await res.text()).slice(0, 300) };
      }
    } else {
      report.stripe = { ok: false, error: "missing env" };
    }
  } catch (e) {
    report.stripe = { ok: false, error: String(e) };
  }

  return new Response(JSON.stringify(report, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
