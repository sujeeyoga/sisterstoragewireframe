/**
 * Site-wide feature switches.
 *
 * TRACKING_ENABLED — customer-facing order tracking (Track Order nav link,
 * /customer/* portal pages, tracking button on the success page).
 *
 * Currently OFF. Verified 2026-09-03: the connected backend's public schema has
 * no tables at all (no `orders` / `woocommerce_orders`), so every tracking
 * lookup returns nothing and the portal fails silently for customers.
 * Tracking numbers still go out by email — that path is unaffected.
 *
 * To turn tracking back on once the order tables are restored: set this to true.
 */
export const TRACKING_ENABLED = false;
