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
