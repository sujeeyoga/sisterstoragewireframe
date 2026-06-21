Root cause found: the deployed shipping calculator is failing before it can apply GTA rules because the backend does not currently have the `shipping_zones` tables in its schema cache. A direct test for Vaughan `L4L 8J7` returned a 500 error: table `public.shipping_zones` not found. That means checkout can fall back to the Canada shipping fee instead of applying GTA free shipping.

Plan:

1. Restore the shipping-zone database tables
   - Recreate `shipping_zones`, `shipping_zone_rules`, `shipping_zone_rates`, and `shipping_fallback_settings` if missing.
   - Add required data access grants for customer checkout and backend functions.
   - Enable RLS and add policies so customers can read enabled shipping settings, while only admins can manage them.

2. Seed the correct shipping rules
   - Add a high-priority `Toronto & GTA` zone.
   - Include Vaughan explicitly as a city rule.
   - Include GTA postal prefixes, including `L4*`, so `L4L 8J7` matches even if the city format varies.
   - Keep a separate Canada-wide zone/rate so non-GTA Canadian addresses still get the Canada shipping fee.
   - Set the GTA free-shipping threshold to the current store rule: free over $60.

3. Harden the shipping calculator
   - Accept both address field styles used in the app: `postalCode`/`country` and `postal_code`/`country_code`.
   - Return both `zone` and `matched_zone` aliases so all frontend components read the result consistently.
   - Preserve `original_rate_amount` when free shipping is applied, so the UI can show the before/after correctly.
   - Sort rates before choosing `appliedRate`, ensuring the free/cheapest option is selected.

4. Validate the reported customer address
   - Test the deployed calculator with:
     - `314 Velmar Drive, Vaughan, ON, L4L 8J7`
     - subtotal above the free-shipping threshold
   - Confirm the result matches `Toronto & GTA` and returns `$0` shipping.
   - Also test a non-GTA Ontario address to confirm it still returns the Canada shipping fee.

5. Check checkout behavior
   - Confirm checkout auto-selects the free GTA rate and hides paid options when free shipping applies.