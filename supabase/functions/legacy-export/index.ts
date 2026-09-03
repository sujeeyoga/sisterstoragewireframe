// One-time export: dump full rows of legacy content tables for migration to Lovable Cloud.
const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TABLES = ["page_content", "shop_sections", "shipping_zones", "shipping_zone_rates", "store_settings"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const key = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
  if (!key) {
    return new Response(JSON.stringify({ ok: false, error: "missing key" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const out: Record<string, unknown[]> = {};
  for (const table of TABLES) {
    const res = await fetch(`${LEGACY_URL}/rest/v1/${table}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    out[table] = res.ok ? await res.json() : [{ error: `status ${res.status}` }];
  }

  return new Response(JSON.stringify({ ok: true, tables: out }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
