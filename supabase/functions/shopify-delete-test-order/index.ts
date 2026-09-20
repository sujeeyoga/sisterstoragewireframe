// One-off maintenance helper: deletes a Shopify order created by the pipeline test.
// Only order names starting with SS-PIPELINE-TEST can be deleted.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOP_DOMAIN = "n1wiud-ns.myshopify.com";
const API_VERSION = "2025-07";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!token) {
    return new Response(JSON.stringify({ error: "Shopify token not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { orderId, orderName } = await req.json();
    if (!orderId || typeof orderName !== "string" || !orderName.startsWith("SS-PIPELINE-TEST")) {
      return new Response(JSON.stringify({ error: "Only pipeline test orders can be deleted" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const base = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}`;
    const headers = { "X-Shopify-Access-Token": token, "Content-Type": "application/json" };

    const check = await fetch(`${base}/orders/${orderId}.json`, { headers });
    const checkData = await check.json();
    if (!check.ok || checkData?.order?.name !== orderName) {
      return new Response(JSON.stringify({ error: "Order name mismatch", data: checkData }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const del = await fetch(`${base}/orders/${orderId}.json`, { method: "DELETE", headers });
    const text = await del.text();
    return new Response(JSON.stringify({ ok: del.ok, status: del.status, body: text }), {
      status: del.ok ? 200 : del.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
