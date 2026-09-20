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
