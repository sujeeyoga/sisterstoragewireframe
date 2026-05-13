// Pushes customers and orders into Shopify via the Admin REST API.
// POST { type: 'customer' | 'order', items: [...] } → returns { created, skipped, errors }
// Requires SHOPIFY_ACCESS_TOKEN secret (Admin API access token, custom app).
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SHOP = 'n1wiud-ns.myshopify.com';
const API_VERSION = '2024-10';
const BASE = `https://${SHOP}/admin/api/${API_VERSION}`;

interface Batch {
  type: 'customer' | 'order';
  items: any[];
}

function mapFinancial(status?: string): string {
  switch (status) {
    case 'completed':
    case 'processing':
    case 'paid':
      return 'paid';
    case 'pending':
    case 'on-hold':
      return 'pending';
    case 'refunded':
      return 'refunded';
    case 'cancelled':
    case 'failed':
    case 'voided':
      return 'voided';
    default:
      return 'pending';
  }
}

function mapFulfillment(status?: string): string | null {
  if (status === 'completed' || status === 'fulfilled') return 'fulfilled';
  return null;
}

function buildAddress(addr: any) {
  if (!addr || (!addr.address_1 && !addr.address1 && !addr.city)) return undefined;
  return {
    first_name: addr.first_name || '',
    last_name: addr.last_name || '',
    address1: addr.address_1 || addr.address1 || addr.line1 || '',
    address2: addr.address_2 || addr.address2 || addr.line2 || '',
    city: addr.city || '',
    province: addr.state || addr.province || '',
    country: addr.country || 'CA',
    zip: addr.postcode || addr.zip || addr.postal_code || '',
    phone: addr.phone || '',
    company: addr.company || '',
  };
}

async function shopifyPost(path: string, body: any, token: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  return { ok: res.ok, status: res.status, data };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const token = Deno.env.get('SHOPIFY_ACCESS_TOKEN');
  if (!token) {
    return new Response(JSON.stringify({ error: 'SHOPIFY_ACCESS_TOKEN not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let payload: Batch;
  try { payload = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { type, items } = payload;
  if (!type || !Array.isArray(items)) {
    return new Response(JSON.stringify({ error: 'Expected { type, items[] }' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const results: { created: number; skipped: number; errors: any[] } = { created: 0, skipped: 0, errors: [] };

  for (const item of items) {
    try {
      if (type === 'customer') {
        if (!item.email) { results.skipped++; continue; }
        const addr = item.billing || item.shipping || {};
        const body = {
          customer: {
            first_name: item.first_name || addr.first_name || '',
            last_name: item.last_name || addr.last_name || '',
            email: item.email,
            phone: item.phone || addr.phone || undefined,
            verified_email: true,
            tags: 'imported-from-sisterstorage',
            addresses: buildAddress(addr) ? [buildAddress(addr)] : [],
          },
        };
        const r = await shopifyPost('/customers.json', body, token);
        if (r.ok) results.created++;
        else if (r.status === 422 && JSON.stringify(r.data).includes('taken')) results.skipped++;
        else results.errors.push({ email: item.email, status: r.status, error: r.data });
      } else if (type === 'order') {
        const billing = item.billing || {};
        const shipping = item.shipping || item.shipping_address || billing;
        const lineItems = (item.line_items && item.line_items.length > 0)
          ? item.line_items.map((li: any) => ({
              title: li.name || li.title || li.product_name || 'Item',
              quantity: Number(li.quantity || li.qty || 1),
              price: String(li.price ?? li.unit_price ?? (li.total && li.quantity ? Number(li.total) / Number(li.quantity) : 0)),
              sku: li.sku || undefined,
              requires_shipping: true,
              taxable: true,
            }))
          : [{ title: `Order #${item.order_number || item.id}`, quantity: 1, price: String(item.total ?? 0) }];

        const body: any = {
          order: {
            email: item.customer_email || billing.email,
            phone: billing.phone,
            financial_status: mapFinancial(item.status),
            fulfillment_status: mapFulfillment(item.status),
            currency: item.currency || 'CAD',
            processed_at: item.date_created,
            tags: `imported,${item.source || 'legacy'}`,
            note: item.customer_note || '',
            line_items: lineItems,
            billing_address: buildAddress(billing),
            shipping_address: buildAddress(shipping),
            total_tax: item.tax ? String(item.tax) : undefined,
            shipping_lines: item.shipping_cost ? [{ title: 'Shipping', price: String(item.shipping_cost), code: 'Imported' }] : [],
            transactions: mapFinancial(item.status) === 'paid'
              ? [{ kind: 'sale', status: 'success', amount: String(item.total ?? 0) }]
              : undefined,
            send_receipt: false,
            send_fulfillment_receipt: false,
            inventory_behaviour: 'bypass',
          },
        };
        const r = await shopifyPost('/orders.json', body, token);
        if (r.ok) results.created++;
        else results.errors.push({ order_number: item.order_number || item.id, status: r.status, error: r.data });
      }
    } catch (e: any) {
      results.errors.push({ item: item.email || item.order_number || item.id, error: e?.message });
    }
    // Tiny pacing to avoid Shopify 2 req/sec REST limit
    await new Promise((r) => setTimeout(r, 550));
  }

  return new Response(JSON.stringify(results), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
