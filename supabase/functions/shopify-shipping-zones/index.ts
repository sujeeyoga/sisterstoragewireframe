// Reads (and optionally rewrites) the shipping zones + rates in Shopify so they
// match the website's rules.
//   GET  ?mode=read              -> current zones and rates in Shopify
//   GET  ?mode=apply&confirm=yes -> rewrite the default profile's zones/rates
//
// Website rules mirrored here:
//   Ontario            $11.50, free over $60
//   Rest of Canada     $15.00, no free threshold
//   International      $25.00
//   United States      not offered (US orders are turned off)

import { getShopifyAdminToken, SHOPIFY_SHOP_DOMAIN } from "../_shared/shopify-token.ts";

const API = "2025-07";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CA_PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "PE", "QC", "SK", "YT",
];

async function gql(query: string, variables: Record<string, unknown>, token: string) {
  const res = await fetch(`https://${SHOPIFY_SHOP_DOMAIN}/admin/api/${API}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch { /* ignore */ }
  return { ok: res.ok, status: res.status, json, text };
}

const PROFILE_QUERY = `
  query {
    deliveryProfiles(first: 10) {
      nodes {
        id
        name
        default
        profileLocationGroups {
          locationGroup { id }
          locationGroupZones(first: 25) {
            nodes {
              zone {
                id
                name
                countries { code { countryCode restOfWorld } provinces { code } }
              }
              methodDefinitions(first: 25) {
                nodes {
                  id
                  name
                  active
                  rateProvider {
                    ... on DeliveryRateDefinition { id price { amount currencyCode } }
                  }
                  methodConditions {
                    field
                    operator
                    conditionCriteria {
                      ... on MoneyV2 { amount currencyCode }
                      ... on Weight { value unit }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const PROFILE_UPDATE = `
  mutation profileUpdate($id: ID!, $profile: DeliveryProfileInput!) {
    deliveryProfileUpdate(id: $id, profile: $profile) {
      profile { id name }
      userErrors { field message }
    }
  }
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = new URL(req.url);
  const mode = url.searchParams.get("mode") ?? "read";
  const confirm = url.searchParams.get("confirm") === "yes";

  const token = await getShopifyAdminToken();
  if (!token) {
    return new Response(JSON.stringify({ error: "Shopify credentials unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const read = await gql(PROFILE_QUERY, {}, token);
  if (!read.ok || read.json?.errors) {
    return new Response(
      JSON.stringify({ error: "Could not read shipping settings", detail: read.text.slice(0, 600) }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const profiles = read.json?.data?.deliveryProfiles?.nodes ?? [];
  const current = profiles.map((p: any) => ({
    id: p.id,
    name: p.name,
    default: p.default,
    zones: (p.profileLocationGroups ?? []).flatMap((lg: any) =>
      (lg.locationGroupZones?.nodes ?? []).map((z: any) => ({
        zoneId: z.zone?.id,
        zoneName: z.zone?.name,
        countries: (z.zone?.countries ?? []).map((c: any) =>
          c.code?.restOfWorld ? "REST_OF_WORLD" : c.code?.countryCode,
        ),
        provinces: (z.zone?.countries ?? []).flatMap((c: any) =>
          (c.provinces ?? []).map((pr: any) => pr.code),
        ),
        rates: (z.methodDefinitions?.nodes ?? []).map((m: any) => ({
          id: m.id,
          name: m.name,
          active: m.active,
          price: m.rateProvider?.price?.amount ?? null,
          conditions: (m.methodConditions ?? []).map((c: any) => ({
            field: c.field,
            operator: c.operator,
            value: c.conditionCriteria?.amount ?? c.conditionCriteria?.value ?? null,
          })),
        })),
      })),
    ),
  }));

  if (mode !== "apply") {
    return new Response(JSON.stringify({ mode: "read", profiles: current }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!confirm) {
    return new Response(
      JSON.stringify({
        mode: "apply",
        applied: false,
        note: "Add &confirm=yes to write these zones",
        planned: {
          ontario: { rate: 11.5, freeOver: 60 },
          restOfCanada: { rate: 15 },
          international: { rate: 25 },
          unitedStates: "not offered",
        },
        currentProfiles: current,
      }, null, 2),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const defaultProfile = profiles.find((p: any) => p.default) ?? profiles[0];
  if (!defaultProfile) {
    return new Response(JSON.stringify({ error: "No delivery profile found" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const locationGroupId = defaultProfile.profileLocationGroups?.[0]?.locationGroup?.id;
  const existingZoneIds: string[] = (defaultProfile.profileLocationGroups ?? []).flatMap((lg: any) =>
    (lg.locationGroupZones?.nodes ?? []).map((z: any) => z.zone?.id).filter(Boolean),
  );

  const money = (amount: number) => ({ amount, currencyCode: "CAD" });

  const profileInput: Record<string, unknown> = {
    zonesToDelete: existingZoneIds,
    locationGroupsToUpdate: [
      {
        id: locationGroupId,
        zonesToCreate: [
          {
            name: "Ontario",
            countries: [{ code: "CA", provinces: [{ code: "ON" }] }],
            methodDefinitionsToCreate: [
              {
                name: "Standard Shipping",
                active: true,
                rateDefinition: { price: money(11.5) },
                priceConditionsToCreate: [{ criteria: money(0), operator: "GREATER_THAN_OR_EQUAL_TO" }],
              },
              {
                name: "Free Shipping (orders $60+)",
                active: true,
                rateDefinition: { price: money(0) },
                priceConditionsToCreate: [{ criteria: money(60), operator: "GREATER_THAN_OR_EQUAL_TO" }],
              },
            ],
          },
          {
            name: "Rest of Canada",
            countries: [{ code: "CA", provinces: CA_PROVINCES.map((code) => ({ code })) }],
            methodDefinitionsToCreate: [
              {
                name: "Canada Standard Shipping",
                active: true,
                rateDefinition: { price: money(15) },
              },
            ],
          },
          {
            name: "International",
            countries: [{ restOfWorld: true }],
            methodDefinitionsToCreate: [
              {
                name: "International Shipping",
                active: true,
                rateDefinition: { price: money(25) },
              },
            ],
          },
        ],
      },
    ],
  };

  const write = await gql(PROFILE_UPDATE, { id: defaultProfile.id, profile: profileInput }, token);
  const userErrors = write.json?.data?.deliveryProfileUpdate?.userErrors ?? [];

  if (!write.ok || write.json?.errors || userErrors.length) {
    return new Response(
      JSON.stringify({
        mode: "apply",
        applied: false,
        error: "Shopify refused the update",
        userErrors,
        detail: write.text.slice(0, 800),
      }, null, 2),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  // Read back so we report what Shopify actually stored
  const verify = await gql(PROFILE_QUERY, {}, token);
  return new Response(
    JSON.stringify({
      mode: "apply",
      applied: true,
      stored: verify.json?.data?.deliveryProfiles?.nodes ?? null,
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
