# Finish turning off USA orders + add a dashboard switch

Two things are true right now: checkout already blocks the United States, but other parts of the site still say we ship there, and there is no on/off switch in your dashboard.

## 1. Remove the leftover "we ship to the USA" messaging

- Top announcement bar: US visitors currently see "United States Shipping Available". Change it so US visitors see no shipping-available message (same as international visitors today).
- Shipping FAQ page: the answers "Do you ship to the United States?" and "we ship to Canada and the United States" get rewritten to say we currently ship within Canada and that US orders are paused, coming back soon.
- Terms page: same wording correction where it lists the US as a shipping destination.
- Checkout: remove the US tariff/cross-border notices, since a US order can no longer be placed.

## 2. Add a switch in the dashboard

- New "Shipping destinations" card on the admin Settings page with a single toggle: **Ship to United States — on/off**.
- The toggle is saved in the store settings so it takes effect for shoppers without a code change, and the storefront (announcement bar, FAQ text, checkout country list, shipping estimator) plus the shipping calculator read that saved value.
- If the setting can't be saved (the known backend permissions issue), the card shows a clear message and the site falls back to the current setting: USA off.

## Technical notes

- Replace the hardcoded `US_SHIPPING_ENABLED` constant in `src/config/features.ts` with a `useUsShippingEnabled()` hook backed by `store_settings.setting_key = 'us_shipping_enabled'`, defaulting to `false` when the row is missing or unreadable. Keep the constant exported as the default fallback so nothing breaks mid-load.
- Update consumers: `src/pages/Checkout.tsx`, `src/components/shop/ShippingCostEstimator.tsx`, `src/components/SaleBanner.tsx`, `src/pages/ShippingFAQ.tsx`, `src/pages/TermsOfService.tsx`.
- Admin card: new `src/components/admin/ShippingDestinationsCard.tsx` rendered from `AdminSettings.tsx`; upsert into `store_settings` and invalidate the query on save, with error toast on failure.
- Edge function `calculate-shipping-zones` reads the same `store_settings` row (service role) instead of its inline `const US_SHIPPING_ENABLED = false`, keeping the 400 rejection message when off; redeploy after the change.
- Verify with a Toronto quote (unchanged) and a New York quote (rejected) after saving the toggle both ways.
