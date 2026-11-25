# Checkout and cart rules

- Use the pure catalog-pricing module under `supabase/functions/_shared` for checkout price resolution and cart refresh so cached or client-supplied prices cannot override catalog prices.
- Fail checkout closed when products or prices cannot be verified; validate gift eligibility from store settings so a client cannot mark paid products as free.
- Hydrate saved carts before persisting state, and migrate cache versions by refreshing prices rather than deleting items so returning shoppers keep their selections.

## Stale-price regression

Symptom: a returning cart charged an expired sale price. Root cause: checkout trusted browser prices and cart restoration never refreshed them. Fix: resolve catalog prices before discounts, Stripe line items, and shipping subtotal; refresh saved carts on load and return to the tab. Before reuse, run `deno test supabase/functions/_shared/catalog-pricing_test.ts` and `bun test src/lib/cartCatalog.test.ts` with the $24-to-$30 regression fixtures.