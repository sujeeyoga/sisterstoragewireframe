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

/**
 * US_SHIPPING_ENABLED — United States as a checkout destination.
 *
 * Currently OFF (requested 2026-09-04): US orders temporarily disabled.
 * The checkout country dropdown hides "United States", and the
 * calculate-shipping-zones edge function also rejects US addresses
 * (it has its own matching US_SHIPPING_ENABLED switch — flip both).
 *
 * To re-enable US orders: set this to true and flip the edge-function flag.
 */
export const US_SHIPPING_ENABLED = false;
