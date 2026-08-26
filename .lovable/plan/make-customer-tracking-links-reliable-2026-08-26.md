# Make customer tracking links reliable

## Goal
Ensure every shipment email gives customers a working carrier tracking link, and prevent broken order-detail links from being the only way to track a package.

## Confirmed issues
- Two active email templates still send tracking clicks to a generic Google search instead of the carrier: the standard shipping template and delayed-tracking template.
- Stripe orders currently depend on Shopify fulfillment to send the customer notification; if the Shopify order lookup or fulfillment fails, no direct Sister Storage tracking email is sent.
- The manual backfill tool can send a notification without item or address fields expected by the shipping function, and the function does not validate required customer/tracking data before attempting delivery.
- The customer order-detail URL requires authentication and readable order records. The currently connected Lovable Cloud database has no `orders`, `woocommerce_orders`, or `email_logs` tables, so existing customer records and delivery history cannot be verified there. Recent tracking functions also have no logs in this backend.

## Changes
1. **Use direct carrier links everywhere**
   - Consolidate the same carrier-aware routing for Stallion Express, Chit Chats, Canada Post, UPS, and FedEx across both shipping email paths.
   - URL-encode tracking numbers and use a safe fallback only when the carrier truly cannot be identified.
   - Pass an explicit tracking URL into Shopify fulfillment so Shopify emails use the same reliable destination.

2. **Guarantee a customer notification**
   - Update Stallion and Chit Chats sync flows so a Shopify fulfillment failure does not silently end the notification path.
   - Fall back to the Sister Storage shipment email when Shopify cannot find or fulfill the matching order.
   - Only mark `shipping_notification_sent_at` after one notification path succeeds; retain a retryable state on failure.

3. **Harden manual resend/backfill**
   - Validate recipient email, tracking number, carrier, order ID, and source before sending.
   - Make optional order items/address safe so historical orders can still receive a tracking-only message.
   - Show the admin a clear per-order result instead of treating an invocation as successful without checking the returned outcome.

4. **Keep order details secondary**
   - Keep the email's main “Track Your Package” button pointed directly to the carrier.
   - Include “View Order Details” only as a secondary authenticated link with the correct Stripe/WooCommerce source.
   - Preserve carrier-aware links inside the customer order page once the order is readable.

5. **Restore and verify the data path**
   - Apply the saved customer-order access policy only to the backend that actually contains the historical order tables.
   - Verify one affected order end to end: stored carrier/tracking number, generated URL, notification result, and authenticated order-page access.
   - Add focused tests for carrier aliases, encoded tracking numbers, Shopify-failure fallback, and retry behavior; then deploy and inspect fresh function logs.

## Technical notes
- No database migration should be applied to the currently empty Cloud schema merely to imitate the legacy order database.
- Customer notifications must not be marked sent when both Shopify and direct email delivery fail.
- The direct carrier URL remains useful even if the customer cannot sign into the order portal.
