# Turn off order tracking on the website (temporarily)

## Goal
Stop customers from hitting a tracking flow that silently fails. Hide every customer-facing tracking entry point behind one switch that can be flipped back on later without rebuilding anything.

## Single on/off switch
Add one flag, `TRACKING_ENABLED`, in a small config file (`src/config/features.ts`), default `false`. Everything below reads that flag. Turning tracking back on = change `false` to `true`.

## What gets hidden while off
1. **Navbar** — remove the "TRACK ORDER" / "TRACK" link (desktop and mobile menu).
2. **Routes** — `/customer/login`, `/customer/dashboard`, `/customer/orders/:orderId` redirect to a simple "Order updates by email" page (or to `/contact`) instead of rendering the broken flow, so old links and bookmarks don't dead-end.
3. **Payment success page** — replace the "Track Your Order" button with "Continue Shopping" plus a line saying shipping confirmation and tracking details will be emailed.
4. **Shipping FAQ** — soften the two claims that promise on-site tracking: keep "you'll get tracking by email", drop any pointer to a tracking page/portal.
5. **Order detail tracking button** — no longer reachable, but also flag-gated so nothing renders a link if the page is re-enabled partially.

## What stays untouched
- Emails still send tracking numbers and carrier links (that path already works and is the reliable one).
- Admin fulfillment, carrier syncs, and all backend functions stay exactly as they are.
- No database or edge function changes.

## Why it is silently failing (unconfirmed, to verify in step 1 of the build)
The customer tracking pages read order records from the backend. Previous sessions found the `orders` table missing from the connected database and the customer-read policy unapplied, so the page finds nothing and shows an empty/failed state without a visible error. Before switching things off I'll confirm this with a direct query and log it in the code comment next to the flag, so re-enabling later starts from a known cause rather than a guess.

## Turning it back on
Flip `TRACKING_ENABLED` to `true`. The nav link, routes, success-page button and FAQ wording all return together.

## Technical notes
- Files touched: new `src/config/features.ts`; `src/App.tsx` (route guards), `src/components/Navbar.tsx`, `src/pages/PaymentSuccess.tsx`, `src/pages/ShippingFAQ.tsx`, `src/pages/CustomerOrderDetail.tsx`.
- `src/lib/trackingUrl.ts` and `supabase/functions/_shared/tracking-url.ts` stay in place — emails keep using them.
- Verify with a build check plus a headless pass over `/`, `/payment-success`, and `/customer/dashboard` to confirm no tracking entry points remain.
