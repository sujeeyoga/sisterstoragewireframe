// Creates a paid order in Shopify after a successful Stripe checkout.
// Called fire-and-forget from stripe-webhook.

const SHOPIFY_DOMAIN = "n1wiud-ns.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  sku?: string;
}

interface ShippingAddress {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface RequestBody {
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress | null;
  stripeSessionId?: string;
}

function splitName(full?: string): { first: string; last: string } {
  if (!full) return { first: "", last: "" };
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const token = Deno.env.get("SHOPIFY_ACCESS_TOKEN");
  if (!token) {
    return new Response(
      JSON.stringify({ error: "SHOPIFY_ACCESS_TOKEN not set" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const addr = body.shippingAddress || {};
  const { first, last } = splitName(addr.name || body.customerName);

  const lineItems = (body.items || []).map((i) => ({
    title: i.name,
    quantity: i.quantity,
    price: i.price.toFixed(2),
    requires_shipping: true,
    taxable: false,
    ...(i.sku ? { sku: i.sku } : {}),
  }));

  const shopifyOrder: Record<string, unknown> = {
    email: body.customerEmail,
    phone: body.customerPhone || undefined,
    financial_status: "paid",
    currency: "CAD",
    inventory_behaviour: "decrement_ignoring_policy",
    send_receipt: false,
    send_fulfillment_receipt: false,
    note: `Synced from sisterstorage.com — Stripe session ${body.stripeSessionId || "n/a"}`,
    tags: "stripe-sync, sisterstorage-website",
    source_name: "sisterstorage.com",
    line_items: lineItems,
    transactions: [
      {
        kind: "sale",
        status: "success",
        amount: body.total.toFixed(2),
        gateway: "stripe",
      },
    ],
  };

  if (addr && (addr.address || addr.city)) {
    const shipAddr = {
      first_name: first,
      last_name: last,
      address1: addr.address || "",
      city: addr.city || "",
      province: addr.state || "",
      country: addr.country || "CA",
      zip: addr.postal_code || "",
      phone: body.customerPhone || undefined,
    };
    shopifyOrder.shipping_address = shipAddr;
    shopifyOrder.billing_address = shipAddr;
  }

  if (body.shipping > 0) {
    shopifyOrder.shipping_lines = [
      { title: "Shipping", price: body.shipping.toFixed(2), code: "Standard" },
    ];
  }

  if (body.tax > 0) {
    shopifyOrder.tax_lines = [
      { title: "Tax", price: body.tax.toFixed(2), rate: 0 },
    ];
    shopifyOrder.taxes_included = false;
  }

  // Idempotency: tag with order number so duplicates are visible
  shopifyOrder.name = body.orderNumber;

  try {
    const res = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({ order: shopifyOrder }),
      },
    );

    const text = await res.text();
    if (!res.ok) {
      console.error("Shopify order create failed", res.status, text);
      return new Response(
        JSON.stringify({ error: "Shopify error", status: res.status, body: text }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = JSON.parse(text);
    console.log("✅ Shopify order created", data?.order?.id, data?.order?.name);
    return new Response(
      JSON.stringify({ ok: true, shopify_order_id: data?.order?.id, shopify_order_name: data?.order?.name }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("Shopify order create exception", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
