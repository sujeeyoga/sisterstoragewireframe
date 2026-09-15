# Sync Admin Fulfillment to Shopify

## Goal
Make our admin dashboard the single place you fulfill orders. Whether you create the label through our built-in Stallion/Chit Chats buttons or paste in a tracking number from any other platform, the matching Shopify order gets marked as fulfilled with the tracking number and carrier.

## Current state
- Orders created on sisterstorage.com are synced into Shopify as paid orders.
- The admin order drawer has two fulfillment paths:
  1. **"Manage Fulfillment"** — opens a Stallion or Chit Chats dialog, creates the shipment through the carrier API, saves tracking to our database, and emails the customer.
  2. **"Save Tracking & Notify Customer"** — lets you manually enter any tracking number and carrier, saves it to our database, and emails the customer.
- Neither path currently updates Shopify. The Shopify order stays "Unfulfilled" unless you manually fulfill it there or run the carrier-tracking sync function separately.

## What we will change

### 1. Backend: improve `shopify-fulfill-order`
File: `supabase/functions/shopify-fulfill-order/index.ts`
- Import `getTrackingUrl` from `../_shared/tracking-url.ts` so the function can auto-generate a tracking URL if the caller does not provide one.
- Normalize common carrier names (`ChitChats` → `Chit Chats`, etc.).
- Default `notifyCustomer` to `false` when called from our admin, because our own shipping-notification email is already sent.
- Return clearer error info if the Shopify order is not found.

### 2. Frontend shared helper
File: `src/lib/shopifyFulfillment.ts`
- Add `fulfillShopifyOrder({ orderNumber, trackingNumber, carrier, notifyCustomer? })`.
- It calls the `shopify-fulfill-order` edge function through the project functions client.
- It returns `{ success, alreadyFulfilled?, notFound?, error? }` so the UI can show the right message.

### 3. Manual tracking flow
File: `src/components/admin/OrderDrawer.tsx`
- Add a checked-by-default checkbox: "Mark as fulfilled in Shopify".
- After the local tracking save and customer email succeed, call `fulfillShopifyOrder`.
- Show a separate toast:
  - success → "Order also marked fulfilled in Shopify"
  - notFound → "No matching Shopify order — local tracking saved"
  - error → "Local tracking saved, but Shopify sync failed"

### 4. Built-in carrier flows
Files: `src/components/admin/StallionFulfillmentDialog.tsx`, `src/components/admin/ChitChatsFulfillmentDialog.tsx`
- After the shipment is created and the local database is updated, call `fulfillShopifyOrder` with the generated tracking number and carrier.
- Pass `notifyCustomer: false`.
- Update the confirmation screen copy to mention that Shopify has been updated.

### 5. UI clarity
- In the OrderDrawer fulfillment section, add a short sentence explaining that saving tracking will also update Shopify when the order exists there.
- In the Stallion/Chit Chats dialogs, add a line noting that the tracking number will be pushed to Shopify.

## Out of scope
- We will not change Shopify's own "Create shipping label" button.
- We will not remove the existing carrier-sync functions; this is an additional, immediate admin-driven sync.

## Verification
- Place a test order, open it in `/admin/orders`, save a manual tracking number with "Mark as fulfilled in Shopify" checked, and confirm the Shopify order shows "Fulfilled" with the tracking number.
- Use "Manage Fulfillment" → Stallion/Chit Chats on a test order and confirm the same.
