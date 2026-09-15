const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOP_DOMAIN = "n1wiud-ns.myshopify.com";
const ADMIN_API = `https://${SHOP_DOMAIN}/admin/api/2025-07/graphql.json`;

const encodeTracking = (t: string) => encodeURIComponent(t.trim());

const getTrackingUrl = (carrier: string | null | undefined, trackingNumber: string): string => {
  const c = carrier?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "";
  const e = encodeTracking(trackingNumber);
  if (c.includes("stallion")) return `https://www.stallionexpress.ca/tracking?tracking_number=${e}`;
  if (c.includes("chitchat")) return `https://chitchats.com/tracking?shipment_id=${e}`;
  if (c.includes("canadapost")) return `https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=${e}`;
  if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${e}`;
  if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?tracknumbers=${e}`;
  return `https://www.google.com/search?q=${encodeURIComponent(`${trackingNumber.trim()} tracking`)}`;
};

const ORDER_QUERY = `
  query TrackOrder($query: String!) {
    orders(first: 5, query: $query) {
      edges {
        node {
          id
          name
          email
          createdAt
          displayFulfillmentStatus
          fulfillments(first: 10) {
            trackingInfo {
              company
              number
              url
            }
            status
            updatedAt
          }
        }
      }
    }
  }
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const tokenCandidates = [
      ["SHOPIFY_APP_AUTOMATION_TOKEN", Deno.env.get("SHOPIFY_APP_AUTOMATION_TOKEN")],
      ["SHOPIFY_ACCESS_TOKEN", Deno.env.get("SHOPIFY_ACCESS_TOKEN")],
    ].filter(([, v]) => !!v) as [string, string][];
    if (tokenCandidates.length === 0) throw new Error("Order lookup is not configured");

    const body = await req.json().catch(() => ({}));
    const rawOrder = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawOrder || !rawEmail || !rawEmail.includes("@")) {
      return new Response(
        JSON.stringify({ success: false, error: "Please enter both your order number and the email you ordered with." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    const orderName = rawOrder.replace(/^#/, "");

    const res = await fetch(ADMIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: ORDER_QUERY,
        variables: { query: `name:${JSON.stringify(orderName)}` },
      }),
    });

    if (!res.ok) {
      console.error("Shopify lookup failed", res.status, await res.text());
      throw new Error("We could not reach our order system. Please try again shortly.");
    }

    const json = await res.json();
    if (json.errors) {
      console.error("Shopify GraphQL errors", JSON.stringify(json.errors));
      throw new Error("We could not look up that order right now. Please try again shortly.");
    }

    const nodes = (json.data?.orders?.edges ?? []).map((e: any) => e.node);
    // Email must match — never reveal another customer's order.
    const order = nodes.find((n: any) => (n.email ?? "").toLowerCase() === rawEmail);

    if (!order) {
      return new Response(
        JSON.stringify({
          success: false,
          notFound: true,
          error: "We couldn't find an order with that number and email. Please double-check both.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    const shipments = (order.fulfillments ?? [])
      .flatMap((f: any) =>
        (f.trackingInfo ?? []).map((t: any) => ({
          carrier: t.company ?? null,
          trackingNumber: t.number ?? null,
          trackingUrl: t.number ? getTrackingUrl(t.company, t.number) : (t.url ?? null),
          status: f.status ?? null,
          updatedAt: f.updatedAt ?? null,
        })),
      )
      .filter((s: any) => s.trackingNumber || s.trackingUrl);

    return new Response(
      JSON.stringify({
        success: true,
        order: {
          orderNumber: order.name,
          placedAt: order.createdAt,
          fulfillmentStatus: order.displayFulfillmentStatus,
        },
        shipments,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (error) {
    console.error("track-order error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
