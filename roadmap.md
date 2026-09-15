# Roadmap — consolidate onto Lovable Cloud

Goal: one backend (Lovable Cloud). Today the app's client hardcodes the legacy
Supabase project while `.env` / platform tools point at the empty Cloud project.

- [ ] 1. Obtain `LEGACY_SUPABASE_SERVICE_ROLE_KEY` (legacy project `attczdhexkpxpyqyasgz`) — required to read its schema and rows.
- [ ] 2. Introspect legacy schema (PostgREST OpenAPI + row samples) for the ~38 tables the app queries.
- [ ] 3. Recreate schema in Cloud via migrations: tables, GRANTs, RLS (auth.uid() only — never user_metadata), triggers, `user_roles` + `has_role`.
- [ ] 4. Copy data from legacy → Cloud (orders, woocommerce_*, products, settings, content tables).
- [ ] 5. Switch the app to Cloud: `src/integrations/supabase/client.ts` env vars, `supabase/config.toml` project id, redeploy edge functions, re-point secrets.
- [ ] 6. Fix customer order-read RLS correctly (match on `auth.email()` / `auth.uid()`).
- [ ] 7. Verify order lookups return rows, then flip `TRACKING_ENABLED` back to true.

## Shopify sync work (Sep 15)
- [x] Backfill historical Stripe orders into Shopify (623 orders)
- [ ] A. Sync active carts into Shopify as customer records — function live; blocked: no cart in the DB has an email yet (checkout now saves it going forward). Cron still to add.
- [ ] B. Update/set up shipping zones & rates in Shopify — function live (read/apply); blocked on `write_shipping` scope (deliveryProfiles access denied).
- [ ] C. Stallion + Chit Chats tracking into Shopify — matching works (shipments matched to orders); blocked on fulfillment-order scopes (403 on fulfillment_orders).
