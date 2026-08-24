# Shipping rates: restore the database as the source of truth, safely

Right now the checkout gets its shipping prices from rules hard-coded inside the shipping function, because the database has no shipping tables at all (the `public` schema is currently empty — confirmed by querying it). That fallback works, but every rate change requires a code edit.

This plan re-creates the shipping tables, seeds them with the exact rates the fallback uses today, and makes the switch back to database rates automatic and reversible — if the database is ever unreachable again, checkout silently drops back to the in-code rates instead of breaking.

## What gets built

1. **Re-runnable shipping schema migration**
   Creates the four tables the shipping function already looks for: shipping zones, zone rules (postal/city/province/country matching), zone rates (price, free-shipping threshold, method name), and fallback settings (the default rate used when nothing matches). Written so it can be re-run safely if it fails partway.

2. **Seed data that matches today's live behaviour exactly**
   Toronto & GTA zone ($11.50, free over $60) with the full list of Toronto and GTA postal prefixes currently in the code, plus Ontario, rest-of-Canada and US zones at their current rates. Seeding is a separate step so rates can be corrected later without touching the schema.

3. **Automatic switch-over with a safety net**
   The shipping function already prefers the database and falls back to code on error. It gets hardened so that:
   - a missing-table error is treated as "not migrated yet" (fallback, no alarm), while a real database error is logged loudly;
   - every response keeps reporting its source (`database` vs `static_fallback`) in the existing debug block, so the admin tester shows at a glance which one served the rate;
   - the in-code rules stay in place permanently as the emergency path — they are never deleted.

4. **Admin visibility**
   The Shipping Zone Tester gets a clear badge: "Live database rates" or "Code fallback in use — database rates not available", so the state is obvious without reading logs.

5. **Verification after migration**
   Re-run the Markham, Vaughan, Toronto, Ottawa and Buffalo test addresses and confirm identical prices before and after the switch ($11.50 under $60, free at/over $60 in the GTA).

## Technical notes

- Tables: `public.shipping_zones`, `public.shipping_zone_rules`, `public.shipping_zone_rates`, `public.shipping_fallback_settings` — each with public read access for the storefront, write access restricted to admins, plus the required grants.
- Postal matching uses the same `FSA*` pattern rules the code fallback uses (`GTA_FSA_PREFIXES`), so the two paths cannot disagree.
- Only `supabase/functions/calculate-shipping-zones/index.ts` and `src/components/admin/ShippingZoneTester.tsx` change on the code side; checkout needs no change because it already reads whichever rate the function returns.
- If the migration fails again with the platform credential error, nothing regresses: checkout continues on the code fallback and the migration can be re-applied later unchanged.
