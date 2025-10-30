-- Solution 1: Create fallback "Other Regions" zone
INSERT INTO shipping_zones (id, name, description, priority, enabled)
VALUES (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Other Regions',
  'Fallback zone for addresses that don''t match other zones',
  0,  -- Lowest priority
  true
);

-- Add catch-all country rule for fallback
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'country',
  '*'
);

-- Add fallback rate (using real Stallion pricing for international)
INSERT INTO shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, display_order)
VALUES (
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'Standard International Shipping',
  'flat_rate',
  25.00,
  0
);

-- Solution 2: Expand Toronto/GTA zone with more cities
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT 
  'aa000000-0000-0000-0000-000000000001',
  'city',
  unnest(ARRAY[
    'Ajax',
    'Pickering',
    'Oshawa',
    'Whitby',
    'Newmarket',
    'Aurora',
    'King City',
    'Stouffville',
    'Uxbridge',
    'Caledon',
    'Halton Hills',
    'Georgetown',
    'Acton',
    'Maple',
    'Concord',
    'Thornhill'
  ])
WHERE NOT EXISTS (
  SELECT 1 FROM shipping_zone_rules 
  WHERE zone_id = 'aa000000-0000-0000-0000-000000000001' 
  AND rule_type = 'city'
  AND rule_value IN ('Ajax', 'Pickering', 'Oshawa', 'Whitby', 'Newmarket', 
                      'Aurora', 'King City', 'Stouffville', 'Uxbridge', 
                      'Caledon', 'Halton Hills', 'Georgetown', 'Acton',
                      'Maple', 'Concord', 'Thornhill')
);

-- Add postal code patterns for better GTA coverage
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT 
  'aa000000-0000-0000-0000-000000000001',
  'postal_code_pattern',
  unnest(ARRAY['L*'])  -- Covers many GTA suburbs
WHERE NOT EXISTS (
  SELECT 1 FROM shipping_zone_rules 
  WHERE zone_id = 'aa000000-0000-0000-0000-000000000001' 
  AND rule_type = 'postal_code_pattern'
  AND rule_value = 'L*'
);