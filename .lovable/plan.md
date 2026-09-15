# Fix shipping prices reverting and customer order tracking — for good

Yes, both are fixable, and I now have a confirmed cause for each. Tested live today, minutes ago.

## What's actually happening

**1. Shipping prices revert because there are two rate lists, and the old one wins.**
Live quotes right now:
- Winnipeg, $102 order → **free shipping** (old saved rule: free over $100 anywhere in Canada)
- Markham, $40 order → **$4.99** (old saved rule, not $11.50)

Every time the built-in prices get corrected, checkout still reads the old saved zone list in the store's backend and overrides them. That saved list is the Winnipeg free-shipping bug. Attempts to correct those saved rows from here were previously blocked by the backend's write permissions, so the old values kept coming back.

**2. Tracking fails because there are no order records to look up.**
The orders tables in the store's backend return zero rows, so any "track your order" page finds nothing, for every customer. Tracking numbers are only delivered by email today. Orders themselves now live in Shopify.

## The fix

### Shipping — one source of truth, with a safety net
1. Correct the saved zone list to the real prices: Toronto/GTA $11.50 with free shipping over $60; rest of Canada $15 with **no** free-shipping threshold.
2. Do the correction through a secure admin-only backend action that uses the store's full-access key, so the write cannot be silently rejected. After writing, read the rows back and show the result — no assuming it worked.
3. If that write is still refused by the backend, take the second path: stop checkout from reading the saved list at all and serve only the built-in prices, so nothing can override them.
4. Add a permanent guard in the shipping calculation: a free-shipping threshold is only ever honoured for zones that are allowed to have one (Toronto/GTA). A Canada-wide or unknown zone can never return $0 shipping. This is what makes the fix stick regardless of what's in the saved list.
5. Add a plain-English banner on the Shipping Zones admin page showing which list is live and the exact prices currently being quoted, so a wrong price is visible before a customer hits it.

### Tracking — look it up where the orders really are
1. Add a public **Track Your Order** page: customer enters order number + email, no account needed.
2. Behind it, a backend lookup that asks Shopify for that order's fulfillment and tracking number, matched against the email so nobody can look up someone else's order.
3. Show status, carrier, tracking number and a direct carrier link (Stallion, Chit Chats, Canada Post, UPS, FedEx) using the carrier-link logic already built.
4. Turn tracking back on site-wide, put the link in the site menu and in shipping emails, and keep the emails' main button pointing straight at the carrier.
5. Clear message when an order isn't shipped yet, instead of silence.

### Proof it's fixed
- Quote checks after the change: Vaughan $116 (expect free), Markham $40 (expect $11.50), Winnipeg $102 (expect $15), Vancouver $116 (expect $15).
- Tracking checks against real recent Shopify orders: one shipped, one not yet shipped, one wrong-email attempt (must be refused).
- Results reported back with the actual numbers, not a claim.

## Technical notes
- Live test confirms `rate_source: "database"` with stale rows: `Canada Wide` free_threshold 100, `Toronto/GTA` $4.99/threshold 60.
- Storefront reads project `attczdhexkpxpyqyasgz`; the newer Cloud project's public schema is empty and its migration tooling still fails on a platform password error — so the fix targets the project the site actually reads.
- Zone-threshold guard goes in `calculate-shipping-zones` after zone matching, applied to both saved-list and built-in paths, and `create-checkout` keeps its server-side recalculation.
- Tracking lookup uses the existing Shopify Admin token in a new edge function; `orders`/`woocommerce_orders` return zero rows today.
