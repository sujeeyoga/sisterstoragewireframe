# Test the checkout end-to-end without charging a card

## Why
No new orders have come through in a couple of days. The newest orders in Shopify are from Sep 15 (and those came from the historical import, not fresh sales). So we need to confirm whether the store can actually take an order right now, or whether something is silently breaking.

## What I'll do (no real money involved)

1. **Walk the storefront like a customer**
   Add a product to the cart, open checkout, fill in a Toronto address and a test email, and confirm each step loads: shipping options appear, totals are right, and the payment step comes up without errors.

2. **Check the payment step opens correctly**
   Confirm the payment session is created and the payment form appears. I stop right before paying — no card is charged.

3. **Check what happens after payment**
   Review the order-creation path (the piece that runs when a payment succeeds) and its recent activity logs to confirm it is healthy and would: save the order, email the confirmation, and push the order into Shopify.

4. **Look for silent failures in the last 5 days**
   Review the logs of checkout, payment-confirmation, email, and Shopify order creation for errors, and compare against payment records, so we can tell the difference between "no one ordered" and "orders happened but never landed".

5. **Report back plainly**
   A short summary: what works, what doesn't, and — if something is broken — exactly where it fails.

## If step 4 shows real payments that never became orders
I'll list them and propose a follow-up to recover those orders (save them, notify you, push to Shopify) before doing anything else.

## Optional follow-up (your call, after this)
A small real order placed by you, refunded straight after, is the only way to prove the card charge itself works end-to-end. I'd only suggest it if the checks above come back clean but you still see nothing arriving.

## Technical notes
- Drive the live preview with a headless browser to exercise cart → checkout → shipping quote → payment intent creation.
- Read `create-checkout`, `stripe-webhook`, `send-email`, and `shopify-create-order` edge function logs for the past days.
- Query Stripe for recent successful payment intents/sessions and cross-check against Shopify orders (`orders.json`) and the admin order tables.
- Read-only throughout; no orders created, no data modified.
