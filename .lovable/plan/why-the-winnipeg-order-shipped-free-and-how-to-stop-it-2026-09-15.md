# Why the Winnipeg order shipped free — and how to stop it

## What I checked

- Asking the shipping calculator for that exact address today (Winnipeg, MB, R2P2N1, $102 order) returns **$15.00 Canada Standard Shipping** — the rule itself is correct, and Manitoba has no free-shipping threshold.
- The order still went through Stripe with **$0 shipping** ($102 + $12.24 tax = $114.24), so the $0 came from the checkout page, not from the rule.
- Detailed logs only go back 24 hours, so the exact moment can't be replayed. Two confirmed weaknesses in the checkout code explain it.

## The two gaps (both confirmed in the code)

1. **A stale quote can survive an address change.** The checkout only re-asks for a shipping price when the address first becomes complete or when the cart total changes. If a shopper fills in a Toronto/GTA address (free over $60), then edits the city, province, and postal code to Winnipeg, the earlier "FREE" option stays selected and gets charged. Changing country clears the rates; changing city/province/postal does not.

2. **No quote = free shipping.** If the quote fails or hasn't returned, the checkout treats shipping as $0 and still allows the order. The backup check inside the payment step is also skipped when the city is missing, and any error there silently keeps the $0 the page sent.

## The fix

- Clear the selected shipping option and re-request a quote whenever the city, province, postal code, or country changes — not just on country change.
- Never treat "no quote" as free: if there is no successfully matched rate for the current address, block the Pay button with a clear message instead of defaulting to $0.
- In the payment step, always recalculate from the address (fall back to postal code when city is missing) and refuse to create the payment if the recalculated price is higher than what the page sent — rather than silently trusting $0.
- Tag each quote with the address it was calculated for, so a rate belonging to a different address can never be used.

## Underlying data issue (worth fixing separately)

The shipping zone tables don't exist in the current database, so every quote runs on the built-in backup rates (GTA $11.50 / free over $60, rest of Canada $15, US $30). That's working, but rates can't be edited from the dashboard until the zone tables are restored.

## Verification

- Simulate: GTA address with $102 (free) → change to Winnipeg → confirm the page re-quotes to $15 and the free option disappears.
- Confirm an order cannot be submitted while shipping is unquoted.
- Re-check Vaughan L4L over $60 still free, Markham under $60 still $11.50, Winnipeg $15.
