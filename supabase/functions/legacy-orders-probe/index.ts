// Read-only diagnostic: lists the most recent orders in the legacy store database.
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

  const supabase = createClient(LEGACY_URL, key);
  const { data, error } = await supabase
    .from("orders")
    .select("order_number, created_at, total, customer_email, payment_status, status, stripe_session_id")
    .order("created_at", { ascending: false })
    .limit(10);

  return new Response(JSON.stringify({ ok: !error, error: error?.message ?? null, orders: data ?? [] }), {
    status: error ? 500 : 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
