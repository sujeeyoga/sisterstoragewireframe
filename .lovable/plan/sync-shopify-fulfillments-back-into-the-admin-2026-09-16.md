# Sync Shopify fulfillments back into the admin

## Problem
When an order is fulfilled directly in Shopify (or its tracking is added there first), the local admin order record still shows as "unfulfilled" or missing tracking. The customer-facing `/track` page already reads Shopify, but the admin Orders list and OrderDrawer do not.

## Goal
Pull the latest fulfillment data from Shopify into the local `orders` / `woocommerce_orders` records so the admin shows the real tracking number, carrier, status, and a tracking link — without requiring staff to re-enter it.

## Scope of changes

### 1. New edge function: `shopify-pull-fulfillment`
- Accepts `orderNumber` (the Sister Storage order number, e.g. `SS-XXXXXXXX`).
- Searches Shopify Admin API for an order by `name`.
- Reads `fulfillments` and `fulfillment_orders` to get:
  - tracking number(s)
  - carrier / company
  - Shopify `tracking_url` if present
  - fulfillment status
- Returns the first valid tracking set plus the raw Shopify order ID.
- Uses the shared `supabase/functions/_shared/shopify-token.ts` helper.

### 2. Database columns
Add to both `public.orders` and `public.woocommerce_orders`:
- `tracking_url TEXT` — the carrier/Shopify tracking URL.
- `shopify_fulfillment_synced_at TIMESTAMPTZ` — when we last pulled Shopify data.
- `shopify_order_id TEXT` (if absent) — to make future lookups faster and webhooks possible.

Include the usual `GRANT`s and leave RLS unchanged; only admins already have access.

### 3. Client helper: `src/lib/shopifyFulfillmentPull.ts`
- Calls `shopify-pull-fulfillment`.
- On success, writes `tracking_number`, `carrier_name`, `tracking_url`, `fulfillment_status = 'fulfilled'`, `fulfilled_at`, `shopify_fulfillment_synced_at` into the correct table (`orders` for Stripe-origin, `woocommerce_orders` for Woo-origin).
- Returns `{ success, notFound, noTracking, error }`.

### 4. OrderDrawer UI
- Add a **"Sync tracking from Shopify"** button in the Fulfillment section.
- Auto-sync once when the drawer opens if:
  - the order has no local tracking number, and
  - an order number exists that could map to a Shopify order.
- Show the tracking URL as a clickable **"Track shipment"** link when available.
- Toast success / not-found / no-tracking states clearly.

### 5. OrdersList bulk action
- Add **"Pull Shopify tracking"** to the bulk-action bar.
- For each selected order, calls the helper sequentially and reports a summary ("3 updated, 1 no Shopify match, 0 failed").

### 6. Optional: Shopify fulfillment webhook (phase 2)
- A separate `shopify-fulfillment-webhook` edge function that Shopify can call when a fulfillment is created.
- Validates Shopify HMAC, looks up the local order by Shopify order name/tag, and updates the same columns in real time.
- Mentioned in this plan but treated as a follow-up; first ship the manual/auto pull.

### 7. Admin assistant guide update
- Add a short entry: when an order is fulfilled in Shopify, staff can open it in Orders and click **"Sync tracking from Shopify"**, or use the bulk action.
- Keep the assistant read-only.

## Files to create / edit
- `supabase/functions/shopify-pull-fulfillment/index.ts` (new)
- `supabase/migrations/YYYY_add_tracking_url_and_synced_at.sql` (new)
- `src/lib/shopifyFulfillmentPull.ts` (new)
- `src/components/admin/OrderDrawer.tsx` (edit)
- `src/components/admin/OrdersList.tsx` (edit)
- `supabase/functions/admin-assistant/guide.ts` (edit)
- `supabase/config.toml` — add `[functions.shopify-pull-fulfillment]` if needed for deploy

## Acceptance criteria
1. Fulfilling an order in Shopify, then opening it in `/admin/orders`, shows the tracking number, carrier, and a tracking link after clicking (or auto-) sync.
2. The sync button reports clearly if no matching Shopify order or no tracking exists.
3. Bulk "Pull Shopify tracking" works for multiple selected orders.
4. `/track` for customers continues to work unchanged.
5. No local order data is overwritten blindly; sync only updates when Shopify returns valid fulfillment data.
6. Typecheck and build pass; the new function deploys successfully.
