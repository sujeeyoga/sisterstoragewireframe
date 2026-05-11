const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SHOP_DOMAIN = 'n1wiud-ns.myshopify.com';
const API_VERSION = '2025-07';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const token = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  if (!token) {
    return new Response(JSON.stringify({ error: 'SHOPIFY_ACCESS_TOKEN not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    // resource: shop | products | orders | customers | <custom path>
    const resource = url.searchParams.get('resource') ?? 'shop';
    const limit = url.searchParams.get('limit') ?? '50';

    // Map shorthand to actual endpoint
    const pathMap: Record<string, string> = {
      shop: 'shop.json',
      products: `products.json?limit=${limit}`,
      orders: `orders.json?limit=${limit}&status=any`,
      customers: `customers.json?limit=${limit}`,
    };
    const apiPath = pathMap[resource] ?? resource;

    const adminUrl = `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/${apiPath}`;

    const res = await fetch(adminUrl, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Shopify API error', status: res.status, data }), {
        status: res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
