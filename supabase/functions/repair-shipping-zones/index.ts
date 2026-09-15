import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";

/**
 * Rewrites the saved shipping zone rates to the correct, current prices and
 * reads them back so the admin sees the real stored result (never an assumed
 * success). Admin-only.
 */
const CORRECT_RATES: Array<{
  match: RegExp;
  method_name: string;
  rate_amount: number;
  free_threshold: number | null;
}> = [
  { match: /toronto|gta/i, method_name: "Toronto/GTA Delivery", rate_amount: 11.5, free_threshold: 60 },
  { match: /canada wide|canada-wide/i, method_name: "Canada Wide Shipping", rate_amount: 15, free_threshold: null },
  { match: /united states|^us$/i, method_name: "US Standard Shipping", rate_amount: 30, free_threshold: null },
  { match: /other regions|international/i, method_name: "Standard International Shipping", rate_amount: 25, free_threshold: null },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const serviceKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) throw new Error("Shipping data key is not configured");

    const db = createClient(LEGACY_URL, serviceKey, { auth: { persistSession: false } });

    // Admin check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await db.auth.getUser(token);
    if (userError || !user) throw new Error("Unauthorized");

    const { data: roleData } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Admin access required");

    const { data: zones, error: zonesError } = await db
      .from("shipping_zones")
      .select("id, name");
    if (zonesError) throw zonesError;

    const results: Array<Record<string, unknown>> = [];

    for (const zone of zones ?? []) {
      const target = CORRECT_RATES.find((r) => r.match.test(zone.name));
      if (!target) {
        results.push({ zone: zone.name, status: "skipped", reason: "no matching rule" });
        continue;
      }

      const { error: updateError } = await db
        .from("shipping_zone_rates")
        .update({
          method_name: target.method_name,
          rate_amount: target.rate_amount,
          free_threshold: target.free_threshold,
        })
        .eq("zone_id", zone.id)
        .eq("enabled", true);

      // Read back what is actually stored now.
      const { data: stored, error: readError } = await db
        .from("shipping_zone_rates")
        .select("method_name, rate_amount, free_threshold, enabled")
        .eq("zone_id", zone.id)
        .eq("enabled", true);

      const applied =
        !updateError &&
        !readError &&
        (stored ?? []).every(
          (r: any) =>
            Number(r.rate_amount) === target.rate_amount &&
            (r.free_threshold ?? null) === target.free_threshold,
        ) &&
        (stored ?? []).length > 0;

      results.push({
        zone: zone.name,
        status: applied ? "updated" : "failed",
        error: updateError?.message ?? readError?.message ?? (applied ? null : "write was rejected"),
        stored,
      });
    }

    const allApplied = results.every((r) => r.status !== "failed");

    return new Response(JSON.stringify({ success: allApplied, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("repair-shipping-zones error:", error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
