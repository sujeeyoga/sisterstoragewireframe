# Estimated shipping in the cart from the visitor's location

Right now the cart's shipping bar stays blank until a shopper types a full address at checkout. This adds an automatic location lookup so the cart can show an estimated shipping cost and the free-shipping goal right away.

## What the shopper sees

- Opening the cart shows: "Estimated shipping to Toronto, ON: $4.99" (or "Free shipping — you qualify!").
- A small note under it: "Estimated — confirmed at checkout."
- The free-shipping progress bar fills based on that region's threshold.
- If the location can't be detected, the cart behaves exactly as it does today (no estimate, no error shown).
- Nothing at checkout changes: the real address the shopper enters still decides the final rate.

## How it works

1. A small backend action returns the visitor's country, province/state and city from their connection (same geolocation service the visitor tracking already uses).
2. The result is remembered for the browsing session so it's looked up once, not on every cart open.
3. The cart passes that location into the existing shipping calculator to get the rate and free-shipping threshold.
4. Because a postal code isn't available from a connection lookup, the calculator is called with a representative postal code for the detected city (e.g. Toronto/GTA cities map to an M-code) so GTA vs. rest-of-Ontario pricing is right; unknown cities fall back to the province-level rate.
5. US visitors: since US orders are currently turned off, the cart shows the existing "not shipping to the US right now" message instead of a rate.

## Technical notes

- New edge function `geo-locate`: reads `x-forwarded-for`, calls ip-api.com with the existing ipapi.co fallback, returns `{ country, region, city }`. No IP stored or logged; `verify_jwt = false`; called through `functionsClient`.
- New hook `src/hooks/useVisitorLocation.tsx`: fetches once, caches in `sessionStorage`, returns `{ country, region, city, postalCodeHint, loading }`.
- `src/components/cart/FreeShippingThresholdBar.tsx` and `FreeShippingCartIndicator.tsx`: when the passed-in `city/region/country` props are empty, fall back to the detected location and set an `isEstimate` flag; keep the existing 500 ms debounce, `itemsKey` memo and `cancelled` guard so the bar doesn't flicker.
- `CartDrawer.tsx` renders the "Estimated — confirmed at checkout" caption when `isEstimate` is true.
- GTA city → postal-prefix map lives next to the existing zone logic; no change to `calculate-shipping-zones` pricing rules.

## Out of scope

- Pre-filling checkout address fields.
- Any change to the actual rates, zones or the checkout quote logic.
