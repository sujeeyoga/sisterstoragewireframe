# Fix $35 shipping quotes to Markham

## What I verified

- The shipping zone tables are still missing from the database (`shipping_zones`, rates, rules — none exist), so every quote comes from the emergency static fallback in the shipping function.
- Calling the live shipping function for Markham L3R 0B8 with country `CA` / province `ON` returns **$11.50**, and **$0 free over $60** — as intended.
- Calling the same address with country spelled `Canada` and province `Ontario` fails the GTA match and returns the **$15 Canada-wide** rate.

So $35 is not a value the current shipping function can return for a Canadian address, which means the quote the customer saw came from either a different code path or an address shape I haven't reproduced yet. I will not guess at the cause — step 1 is reproducing it.

## Plan

1. **Reproduce the $35 quote.** Drive the real checkout in a browser against Markham addresses (L3R, L3P, L6B, L6C, L6E), varying cart subtotal and quantity, and capture what the shipping function actually returns and what the page displays. If $35 appears, capture the exact request/response that produced it.
2. **Harden address normalization** (needed regardless). The GTA match currently requires the exact strings `CA` and `ON`. Accept full names and common variants (`Canada`, `Ontario`, lowercase, extra spaces) before matching, so a manually typed or autocomplete-quirk address can never fall through to the Canada-wide rate.
3. **Broaden GTA postal coverage.** Match all Markham/York/Peel/Durham prefixes explicitly rather than the current broad `L1`–`L9` rule, so out-of-GTA `L` codes (Niagara, Kitchener) aren't wrongly included and no GTA code is missed.
4. **Restore the shipping zone tables** so rates are data-driven again instead of relying on the hardcoded fallback: Toronto & GTA ($11.50, free over $60), Canada-wide ($15), US ($30), with the postal/city rules from step 3. The static fallback stays as a safety net.
5. **Verify.** Re-run quotes for a Markham address at subtotals below and above $60, plus a non-GTA Ontario address and a US address, and confirm each returns the correct rate end to end through checkout.

## Technical notes

- Shipping logic lives in `supabase/functions/calculate-shipping-zones/index.ts` (`isGTAAddress`, `calculateStaticShipping`).
- Checkout calls it via `useShippingZones` → `Checkout.tsx`; `create-checkout` re-calculates server-side, so both paths pick up the same fix.
- Step 4 requires a database migration; if the migration runner is still blocked, steps 2 and 3 alone restore correct Markham pricing.
