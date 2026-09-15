// Diagnostic: checks Shopify connection, granted scopes and order count.
import { getShopifyAdminToken, SHOPIFY_SHOP_DOMAIN } from "../_shared/shopify-token.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = await getShopifyAdminToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "No Shopify token" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const base = `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/2025-07`;
  const h = { "X-Shopify-Access-Token": token, "Content-Type": "application/json" };

  // Cleanup helper: DELETE /shopify-order-probe?deleteOrderId=123
  const deleteId = new URL(req.url).searchParams.get("deleteOrderId");
  if (deleteId) {
    const del = await fetch(`${base}/orders/${deleteId}.json`, { method: "DELETE", headers: h });
    return new Response(JSON.stringify({ deleted: del.status, body: await del.text() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const orderId = new URL(req.url).searchParams.get("orderId");
  if (orderId) {
    const one = await fetch(`${base}/orders/${orderId}.json`, { headers: h });
    return new Response(await one.text(), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const scopesRes = await fetch(`${base}/oauth/access_scopes.json`, { headers: h });
  const scopes = await scopesRes.text();

  const countRes = await fetch(`${base}/orders/count.json?status=any`, { headers: h });
  const count = await countRes.text();

  const listRes = await fetch(`${base}/orders.json?status=any&limit=5&fields=id,name,email,created_at,financial_status`, { headers: h });
  const list = await listRes.text();

  return new Response(
    JSON.stringify({
      scopes: { status: scopesRes.status, body: scopes },
      count: { status: countRes.status, body: count },
      recent: { status: listRes.status, body: list },
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
