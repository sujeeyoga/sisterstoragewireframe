# Migration: legacy store DB → Lovable Cloud

Approved: move EVERYTHING off legacy, maintenance window OK now.

## Tasks
- [ ] Inventory legacy tables, columns, row counts
- [ ] Create matching schema on Cloud (migration tool; verify DDL works)
- [ ] Copy all data legacy → Cloud (migrate function)
- [ ] Migrate admin auth user(s) to Cloud auth
- [ ] Switch frontend client + edge functions to Cloud
- [ ] Pause checkout, final delta sync, flip live
- [ ] Verify: products load, checkout saves order, email, Shopify sync, admin pages
- [ ] Publish

## BLOCKER (move to Lovable Cloud)
Cloud DB's stored superuser credential is out of sync on the hosting side:
migration tool, run_sql, and SUPABASE_DB_URL edge-function connections all fail
with "password authentication failed for user postgres". Data API (anon/service
keys) works fine. Restart did not resync. User declined pause/resume cycle.
Ready when unblocked: /tmp/cloud_schema.sql + deployed cloud-ddl-runner
(runs the full schema; header x-run-token). Remaining: apply schema -> migrate
data -> switch client.ts + 14 edge functions -> create admin auth users ->
pause checkout for delta sync -> verify -> publish.
