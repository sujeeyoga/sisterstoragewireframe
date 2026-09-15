// Shared Shopify Admin API auth.
// Dev Dashboard apps don't expose a permanent admin token, so we exchange the
// app's client credentials for a short-lived token and cache it in memory.
export const SHOPIFY_SHOP_DOMAIN = "n1wiud-ns.myshopify.com";

let cached: { value: string; expiresAt: number } | null = null;

export async function getShopifyAdminToken(): Promise<string | null> {
  const clientId = Deno.env.get("SHOPIFY_TRACKING_CLIENT_ID");
  const clientSecret = Deno.env.get("SHOPIFY_TRACKING_CLIENT_SECRET");

  if (clientId && clientSecret) {
    if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;

    const res = await fetch(`https://${SHOPIFY_SHOP_DOMAIN}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
    });

    const text = await res.text();
    if (res.ok) {
      try {
        const data = JSON.parse(text);
        if (data.access_token) {
          const ttl = Number(data.expires_in) > 0
            ? Number(data.expires_in) * 1000
            : 23 * 60 * 60 * 1000;
          cached = { value: data.access_token, expiresAt: Date.now() + ttl };
          return data.access_token;
        }
      } catch (_e) {
        console.error("Could not parse Shopify token response", text);
      }
    } else {
      console.error("Shopify client credentials exchange failed", res.status, text);
    }
  }

  // Legacy fallbacks
  return (
    Deno.env.get("SHOPIFY_TRACKING_ADMIN_TOKEN") ??
    Deno.env.get("SHOPIFY_APP_AUTOMATION_TOKEN") ??
    Deno.env.get("SHOPIFY_ACCESS_TOKEN") ??
    null
  );
}
