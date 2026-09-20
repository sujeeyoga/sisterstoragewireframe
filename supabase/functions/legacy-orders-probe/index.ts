// Read-only diagnostic: reports what the legacy store database key can do.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const key = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!key) {
    return new Response(JSON.stringify({ error: "Legacy key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let keyRole = "unknown";
  let keyShape = key.startsWith("sb_") ? "publishable/secret style" : "jwt style";
  try {
    if (keyShape === "jwt style") {
      const payload = JSON.parse(atob(key.split(".")[1]));
      keyRole = payload.role ?? "unknown";
    }
  } catch (_e) { /* ignore */ }

  const supabase = createClient(LEGACY_URL, key);
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  const { count: wooCount, error: wooError } = await supabase
    .from("woocommerce_orders")
    .select("id", { count: "exact", head: true });

  // Full schema inventory via the REST OpenAPI spec
  let tables: Record<string, Record<string, string>> = {};
  try {
    const specRes = await fetch(`${LEGACY_URL}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const spec = await specRes.json();
    const defs = spec.definitions ?? {};
    for (const [name, def] of Object.entries<any>(defs)) {
      const cols: Record<string, string> = {};
      for (const [col, meta] of Object.entries<any>(def.properties ?? {})) {
        cols[col] = [meta.type, meta.format].filter(Boolean).join(":");
      }
      tables[name] = cols;
    }
  } catch (e) {
    tables = { _error: { err: String(e) } };
  }

  const { data: sample } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sampleColumns = sample ? Object.keys(sample) : null;

  return new Response(
    JSON.stringify({
      keyRole,
      keyShape,
      keyPrefix: key.slice(0, 6),
      ordersCount: count ?? null,
      ordersError: error?.message ?? null,
      woocommerceOrdersCount: wooCount ?? null,
      woocommerceOrdersError: wooError?.message ?? null,
      sampleColumns,
      sampleRow: sample ?? null,
      tables,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
