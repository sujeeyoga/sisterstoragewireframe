# Fix incorrect shipping messages and broken customer tracking

## Goal
Make cart and checkout shipping messages reflect the actual destination-specific quote, and ensure every tracking button opens the correct carrier page without depending on an inaccessible order record.

## Changes
1. **Use one source of truth for shipping**
   - Remove the cart drawer’s hardcoded GTA `$50` and global `$289` free-shipping checks.
   - Show free-shipping progress only after the shipping calculator returns a threshold for the customer’s entered destination.
   - Do not assume a GTA threshold while the customer’s location is unknown; show no threshold claim until a rate is resolved.
   - Keep the existing country-specific notice for US customers, but never show GTA eligibility to a US destination.

2. **Make tracking links carrier-aware everywhere**
   - Add a shared frontend helper for Stallion Express, Chit Chats, Canada Post, UPS, FedEx, and a safe generic fallback.
   - Replace the customer order page’s Google-only link with the correct carrier URL.
   - URL-encode tracking numbers in both the customer page and shipment email.

3. **Remove the fragile email path**
   - Keep the shipment email’s primary “Track Your Package” button as the reliable path that goes directly to the carrier.
   - Add the order source to internal order-detail URLs so Stripe/native and WooCommerce records are not guessed.
   - Ensure every notification caller supplies the source consistently.

4. **Restore customer access to synced orders**
   - Add a backend migration allowing authenticated customers to read only WooCommerce orders whose billing email matches their authenticated email, while retaining the existing `auth.uid() = user_id` rule.
   - Include explicit authenticated/service-role grants in the same migration.
   - If the connected Cloud database still has no order tables, keep the migration in the repository for the legacy database restoration path rather than applying it to an unrelated empty schema.

5. **Verify**
   - Check GTA below/above threshold, US, and unknown-location carts to confirm messaging matches returned rates.
   - Check carrier links for all supported carriers and verify source-specific order URLs.
   - Run focused tests/build validation and inspect the rendered cart and order-detail page.

## Technical notes
- The cart currently hardcodes `$50` for GTA and `$289` globally, while the shipping function’s GTA fallback uses `$60`.
- The customer detail page currently sends all tracking numbers to Google even though the shipment email already has carrier-specific routing.
- Repository migrations show WooCommerce customer reads depend on `auth.uid() = user_id`; the connected Cloud database query currently returns no `orders` or `woocommerce_orders` tables, so schema application must target the database that actually stores orders.
