## Migration plan: External Supabase → Lovable Cloud

### Heads-up on the destination
Lovable Cloud is built on Supabase. You're not changing technology — you're moving to a fresh Supabase project provisioned and billed through Lovable. Benefits: $25/month free Cloud credit, no separate Supabase account/billing, fixes the current egress quota block.

### Prerequisite (blocker)
Your current Supabase project is restricted (`exceed_cached_egress_quota`). To migrate data out, the source DB must be reachable. You need to either:
- Briefly upgrade / pay the overage on the old project to unlock egress, OR
- Contact Supabase support to lift the restriction temporarily

Without this, only a "fresh start with no data" migration is possible.

---

### Phase 1 — Provision Lovable Cloud (≈10 min)
- Enable Lovable Cloud on this project (creates a new Supabase project under the hood)
- New `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` get auto-populated in `.env`
- Old project stays untouched as backup

### Phase 2 — Recreate schema (≈1 hr)
Migration files will rebuild everything in the new project:
- 30+ tables: `woocommerce_products`, `woocommerce_orders`, `woocommerce_customers`, `orders`, `customer_profiles`, `shop_sections`, `launch_cards`, `hero_images`, `sister_stories`, `site_texts`, `store_settings`, `flash_sales`, `shipping_zones`/`zone_rates`/`zone_rules`, `tariff_rates`, `shipping_fallback_settings`, `product_reviews`, `email_campaigns`/`logs`, `abandoned_carts`, `active_carts`, `visitor_analytics`, `seo_analytics`, `keyword_rankings`, `page_content`, `page_performance`, `qr_codes`/`scans`, `refunds`, `uploaded_images`/`videos`, `user_roles`, `waitlist_signups`
- All RLS policies (preserved exactly, including the `has_role` pattern)
- All 14 database functions (`has_role`, `add_admin_by_email`, `send_tracking_notification`, fulfillment triggers, etc.)
- The `app_role` enum and `refund_type` enum
- 3 storage buckets (`sister`, `images`, `videos`) with public access

### Phase 3 — Migrate data (≈1–3 hrs depending on volume)
Using `pg_dump` + `pg_restore` from old project to new:
- Products, orders, customers (full history)
- Reviews, abandoned carts, active carts
- Analytics tables (visitor_analytics, seo_analytics, conversion data)
- Content tables (shop_sections, launch_cards, hero_images, sister_stories, site_texts, page_content)
- Shipping config (zones, rates, rules, tariffs)
- User roles (admin assignments)
- Storage bucket files (sister, images, videos) — copied via Supabase storage API or rclone

Sequence numbers (e.g., `woocommerce_products.id` is bigint) get reset after import to avoid collisions on new inserts.

### Phase 4 — Migrate secrets & edge functions (≈30 min)
14 secrets re-added to the new project (you'll re-enter values in a secure form):
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `CHITCHATS_CLIENT_ID`, `CHITCHATS_API_TOKEN`
- `STALLION_EXPRESS_API_TOKEN`
- `WOOCOMMERCE_BASE_URL`, `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`
- `SUPABASE_URL`/`ANON_KEY`/`SERVICE_ROLE_KEY`/`PUBLISHABLE_KEY`/`DB_URL` are auto-injected by Lovable Cloud

40+ edge functions auto-deploy from the existing `supabase/functions/` code (no changes needed — they already use `Deno.env.get(...)` for everything).

### Phase 5 — Frontend cutover (≈15 min, ~zero code changes)
The Supabase client at `src/integrations/supabase/client.ts` reads from `import.meta.env.VITE_SUPABASE_*`. Once `.env` points to the new project, the entire frontend (~150 hooks/components) works automatically — including `useProducts`, `useShopSections`, cart, checkout, admin dashboard, all of it.

`src/integrations/supabase/types.ts` regenerates from the new project's schema.

### Phase 6 — External webhook reconfiguration (manual, ≈30 min)
You'll need to update third-party services to point to the new project URL:
- **Stripe webhook endpoint** → new `stripe-webhook` URL
- **Chitchats / Stallion** tracking webhooks (if any)
- **WooCommerce sync** webhook target (if used)

Old Supabase project URL: `attczdhexkpxpyqyasgz.supabase.co`
New URL: assigned during Phase 1

### Phase 7 — Verification (≈1 hr)
Walk through critical flows on the live preview:
- [ ] Shop page loads products
- [ ] Product detail page works
- [ ] Add to cart + checkout (test mode Stripe)
- [ ] Order confirmation email arrives
- [ ] Admin login + admin dashboard data loads
- [ ] Customer login + order history visible
- [ ] Hero/sections/launch cards render
- [ ] Reviews submit + display
- [ ] Stripe webhook fires on test purchase
- [ ] Shipping rate calculation works

### Phase 8 — Decommission (after a verification window)
- Keep old Supabase project read-only for 2–4 weeks as a backup
- Then cancel its billing

---

### Downtime window
~2–4 hours during Phases 3–6 (data freeze on old → restore on new → DNS/webhook swap). I recommend doing it during your lowest-traffic window.

### Risks
- **Data loss if old project egress isn't unblocked** — can't dump what we can't read
- **Stripe webhook gap** — orders placed during the cutover window may not auto-process; safer to disable checkout briefly
- **Sequence conflicts** — handled by resetting bigint sequences post-import
- **WooCommerce sync** — if you sync from WooCommerce regularly, pause it during cutover

### What you need to do
1. Confirm the plan
2. Unblock the old Supabase project's egress (upgrade plan or contact support) so data export works
3. Be ready to re-enter the 9 third-party API keys when prompted
4. Update Stripe/WooCommerce webhook URLs after cutover (I'll give you the exact URLs)
