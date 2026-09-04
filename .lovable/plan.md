# Fix: BC orders incorrectly getting GTA free shipping

## What happened
A BC customer ordering $116 got free shipping. That is **not** the intended rate — BC should pay $15.00 flat (Canada Standard Shipping, no free threshold).

## Root cause (confirmed)
In the shipping zone seed data, the **Toronto & GTA** zone has a matching rule of `country = CA` in addition to its GTA postal-code rules. Since the GTA zone has the highest priority (300), **any** Canadian address — BC included — matches "Toronto & GTA" first and gets the GTA rate: free over $60, $11.50 under.

The in-code fallback path is correct (only GTA postal prefixes get the GTA rate), but when the database zone tables respond, the bad `country = CA` rule wins.

## Fix (two parts)

1. **Remove the bad rule from the live database**
   - Delete the `('country','CA')` rule belonging to the `Toronto & GTA` zone, keeping its postal-code rules intact.
   - Also correct the seed file `supabase/manual-sql/shipping-zones-restore.sql` so re-running the migration never re-adds it.

2. **Add a safety guard in the shipping calculator**
   - In `calculate-shipping-zones`, if the matched zone is Toronto & GTA but the address is not actually a GTA postal code/city, skip that zone and fall through to Ontario / Canada-Wide — so a bad rule can never cause this again, even if data changes.

## Verification
- Run test quotes: BC address ($116 → expect $15.00), Vaughan L4L ($116 → free), Markham L3R ($40 → $11.50), US address ($30 flat).
- Confirm no other zones have overly broad rules.
