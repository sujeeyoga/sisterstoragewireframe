// Diagnostic: verify LEGACY_SUPABASE_SERVICE_ROLE_KEY against the legacy project
// and report which core tables exist with row counts. Temporary — for migration planning.
const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TABLES = [
  "orders",
  "woocommerce_orders",
  "products",
  "customers",
  "profiles",
  "user_roles",
  "shipping_zones",
  "email_template_overrides",
  "page_content",
  "shop_sections",
  "order_items",
  "woocommerce_customers",
  "woo_orders",
  "cart_items",
  "checkouts",
  "payments",
  "stripe_orders",
  "newsletter_subscribers",
  "subscribers",
  "discount_codes",
  "discounts",
  "store_settings",
  "settings",
  "admin_users",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const key = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
  if (!key) {
    return new Response(JSON.stringify({ ok: false, error: "LEGACY_SUPABASE_SERVICE_ROLE_KEY not set" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results: Record<string, unknown> = {};
  for (const table of TABLES) {
    try {
      const res = await fetch(`${LEGACY_URL}/rest/v1/${table}?select=*&limit=0`, {
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "count=exact",
          Range: "0-0",
        },
      });
      const contentRange = res.headers.get("content-range") || "";
      const count = contentRange.includes("/") ? contentRange.split("/")[1] : null;
      results[table] = res.ok
        ? { exists: true, rows: count }
        : { exists: false, status: res.status };
    } catch (e) {
      results[table] = { exists: false, error: String(e) };
    }
  }

  return new Response(JSON.stringify({ ok: true, project: "attczdhexkpxpyqyasgz", tables: results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
