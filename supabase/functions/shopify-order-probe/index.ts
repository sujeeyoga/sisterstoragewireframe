// Temporary diagnostic: confirms the Shopify connection can read real orders.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOP_DOMAIN = "n1wiud-ns.myshopify.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const clientId = Deno.env.get("SHOPIFY_TRACKING_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_TRACKING_CLIENT_SECRET");

  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, grant_type: "client_credentials" }),
  });
  const tokenJson = await tokenRes.json().catch(() => ({}));
  const token = tokenJson.access_token;
  if (!token) {
    return new Response(JSON.stringify({ step: "token", ok: false, status: tokenRes.status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const countRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-07/orders/count.json?status=any`, {
    headers: { "X-Shopify-Access-Token": token },
  });
  const countBody = await countRes.text();

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-07/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({
      query: `{
        orders(first: 5, sortKey: CREATED_AT, reverse: true, query: "status:any") {
          edges { node {
            name
            createdAt
            displayFulfillmentStatus
            email
            fulfillments(first: 5) { trackingInfo { company number url } }
          } }
        }
      }`,
    }),
  });

  const json = await res.json();
  const orders = (json.data?.orders?.edges ?? []).map((e: any) => ({
    name: e.node.name,
    createdAt: e.node.createdAt,
    status: e.node.displayFulfillmentStatus,
    emailDomain: typeof e.node.email === "string" ? e.node.email.split("@")[1] ?? null : null,
    tracking: (e.node.fulfillments ?? []).flatMap((f: any) => f.trackingInfo ?? []),
  }));

  return new Response(JSON.stringify({ ok: !json.errors, count: orders.length, orders, errors: json.errors ?? null }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
