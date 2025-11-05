-- Update individual product dimensions
UPDATE woocommerce_products 
SET length = 38, width = 25, height = 9, package_value = 55, updated_at = NOW()
WHERE id = 8552;

UPDATE woocommerce_products 
SET length = 25, width = 19, height = 9, package_value = 30, updated_at = NOW()
WHERE id = 8513;

UPDATE woocommerce_products 
SET length = 25, width = 10, height = 9, package_value = 20, updated_at = NOW()
WHERE id = 8540;

-- Update Bundle 1 (Starter Set) - 38x25x27cm, 1628.4g, $90 CAD
UPDATE woocommerce_products 
SET length = 38, width = 25, height = 27, package_value = 90, updated_at = NOW()
WHERE id = 8580;

-- Update Bundle 2 (Sister Staples) - 38x25x36cm, 2506.1g, $137 CAD
UPDATE woocommerce_products
SET length = 38, width = 25, height = 36, package_value = 137, updated_at = NOW()
WHERE id = 8582;

-- Update Bundle 3 (Family Set) - 38x25x45cm, 3256.8g, $174 CAD
UPDATE woocommerce_products
SET length = 38, width = 25, height = 45, package_value = 174, updated_at = NOW()
WHERE id = 8584;

-- Create UK shipping zone
INSERT INTO shipping_zones (name, description, priority, enabled)
VALUES ('United Kingdom', 'Shipping to UK via ChitChats International Tracked', 200, true);

-- Get the UK zone ID for the rules and rates
DO $$
DECLARE
  uk_zone_id uuid;
BEGIN
  SELECT id INTO uk_zone_id FROM shipping_zones WHERE name = 'United Kingdom';
  
  -- Add country rule for UK
  INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
  VALUES (uk_zone_id, 'country', 'GB');
  
  -- Add free shipping for orders over $200 CAD (must come first with display_order 0)
  INSERT INTO shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, free_threshold, display_order, enabled)
  VALUES (uk_zone_id, 'Free International Shipping', 'flat_rate', 0, 200.00, 0, true);
  
  -- Add shipping rates based on weight tiers
  -- Light packages (< 2kg): $26 CAD
  INSERT INTO shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, display_order, enabled)
  VALUES (uk_zone_id, 'ChitChats International Tracked (Light)', 'flat_rate', 26.00, 1, true);
  
  -- Medium packages (2-3kg): $76 CAD
  INSERT INTO shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, display_order, enabled)
  VALUES (uk_zone_id, 'ChitChats International Tracked (Medium)', 'flat_rate', 76.00, 2, true);
  
  -- Heavy packages (> 3kg): $102 CAD
  INSERT INTO shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, display_order, enabled)
  VALUES (uk_zone_id, 'ChitChats International Tracked (Heavy)', 'flat_rate', 102.00, 3, true);
END $$;