# Push active carts into Shopify as customer records

Live cart data from the website gets mirrored into Shopify as customer records, so you can see in Shopify who is shopping and what they left behind.

## What you'll get

- Every shopper with an active cart appears in Shopify under Customers.
- Their customer note shows what's in the cart, the total, and when it was last updated, for example:
  `Active cart (updated Sep 15, 5:12 PM) - 2x Open Box 4-Rod Bangle Stand, 1x Multipurpose Box - $89.97 CAD`
- They get the tag `active-cart` so you can filter them in Shopify. Once the cart converts to an order or is emptied, the tag is removed and the note is cleared.
- This runs automatically every 15 minutes, keeping Shopify in step with the site.

## One limitation to know

Shopify can only store a customer if there's an email (or phone) to identify them. Carts from shoppers who never entered an email can't become Shopify customers — there's nothing to attach them to. Those still show on the Active Carts page in your admin, and the sync reports how many were skipped for that reason.

## Technical details

New edge function `shopify-sync-cart-customers`:
- Reads `active_carts` (joined with the matching visitor row for city/country) from the data project using the existing legacy service-role key, same pattern as `legacy-orders-probe`.
- Gets a Shopify token via `getShopifyAdminToken()` from `_shared/shopify-token.ts` (client-credentials flow already working).
- For each cart with an email: search `customers.json?query=email:<email>`; create if absent, otherwise update. Sets `note` (cart summary) and merges the `active-cart` tag. Carts with no email are counted as `skipped_no_email`.
- For customers currently tagged `active-cart` whose cart no longer exists (converted or emptied), removes the tag and clears the cart note.
- Rate limiting: 600ms pause between Shopify writes, same as the order backfill.
- Params: `dryRun` (default true when called manually), `limit`.
- Registered in `supabase/config.toml` with `verify_jwt = false`.

Scheduling: `pg_cron` + `pg_net` job invoking the function every 15 minutes.

Requires the `write_customers` scope on the Order Tracking API app (currently it has read/write orders and fulfillments). If Shopify rejects writes with a scope error, the function reports it clearly and no partial data is written.
