# Markham shipping: verify, log, and explain at checkout

## What I already verified (live calls to the shipping function)

- Markham, "Ontario", "Canada", L3R 0B8, $45 subtotal → **$11.50** (GTA Local Delivery, matched rule `L3R*`)
- Markham, ON, CA, L6C 1A1, $85 subtotal → **$0** (free over $60)

So the rate logic is correct today. Two things the logs also confirm:

- The shipping tables (`shipping_zones`) still do not exist, so every quote comes from the in-code static fallback. Rates are right, but they are not editable from the admin.
- Checkout reads `result.matched_zone`, while the function returns `zone` and `matchedRule`. The zone name shown at checkout is therefore empty — this is a real bug to fix as part of the breakdown work.

## 1. End-to-end Markham checkout verification

Drive the live preview through a real Markham checkout in two passes and capture screenshots at each step:

- Pass A: cart under $60 → expect $11.50 shipping in the order summary and the same amount carried into the Stripe session.
- Pass B: cart over $60 → expect $0 shipping and "free shipping" messaging.

For each pass, confirm the total sent to Stripe matches the on-screen total, and stop at the Stripe checkout page (no real payment). Report exactly what each step showed, including any mismatch between the quoted rate and the Stripe line items.

## 2. Detailed rule-match logging in `calculate-shipping-zones`

Add one structured log line per request that makes an incorrect-rate report diagnosable without guesswork:

- Raw address exactly as received (country, province, city, postal) plus the normalized version, so "Canada"/"Ontario" vs "CA"/"ON" is visible.
- The derived FSA (first 3 postal characters) and whether it hit the GTA prefix set.
- Which path decided the rate: database zone or static fallback, plus zone name, rule type and rule value.
- Subtotal, free threshold, rate before threshold, and final rate.

Also echo these fields back in the response under a `debug` object so the admin Shipping Zone Tester can display them.

## 3. Shipping breakdown on the checkout page

Under the selected shipping method, show a compact breakdown:

- Zone name (e.g. "Toronto & GTA")
- Why it matched (e.g. "postal code L3R")
- The rate rule in plain words: "$11.50 flat — free on orders over $60"
- When free: "Free shipping applied — order is over $60" with the $11.50 struck through
- When under the threshold: "Add $X more for free shipping"

This uses the existing rates response; no new backend call. Fixing the `matched_zone` → `zone` mismatch is part of this step.

## Technical notes

- Files: `supabase/functions/calculate-shipping-zones/index.ts` (logging + `debug` in response), `src/pages/Checkout.tsx` (breakdown UI, response key fix), `src/components/admin/ShippingZoneTester.tsx` (surface `debug`).
- No database migration here — the shipping tables are still unavailable, so the static fallback stays the source of truth. Restoring those tables remains a separate task.
- Breakdown copy uses existing design tokens, no hardcoded colors.
