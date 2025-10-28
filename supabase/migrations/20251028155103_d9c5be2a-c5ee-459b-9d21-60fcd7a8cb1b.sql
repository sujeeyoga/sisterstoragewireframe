-- Create US shipping zones and rates

-- US Zone: United States - Standard
INSERT INTO shipping_zones (id, name, description, priority, enabled)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'United States - Standard',
  'Standard shipping to all US states',
  100,
  true
);

-- Add US country rule
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'country',
  'US'
);

-- Add standard shipping rate for US
INSERT INTO shipping_zone_rates (
  zone_id, 
  method_name, 
  rate_type, 
  rate_amount, 
  free_threshold, 
  enabled, 
  display_order
)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Standard Shipping (5-7 business days)',
  'flat_rate',
  14.99,
  75.00,
  true,
  1
);

-- Add expedited shipping rate for US
INSERT INTO shipping_zone_rates (
  zone_id, 
  method_name, 
  rate_type, 
  rate_amount, 
  free_threshold, 
  enabled, 
  display_order
)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Express Shipping (2-3 business days)',
  'flat_rate',
  24.99,
  NULL,
  true,
  2
);

-- Optional: Create zone for US West Coast (faster/cheaper shipping)
INSERT INTO shipping_zones (id, name, description, priority, enabled)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'US West Coast',
  'California, Oregon, Washington',
  150,
  true
);

-- Add state rules for West Coast
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'province', 'CA'),
  ('44444444-4444-4444-4444-444444444444', 'province', 'OR'),
  ('44444444-4444-4444-4444-444444444444', 'province', 'WA');

-- Add country rule for US (required for matching)
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES ('44444444-4444-4444-4444-444444444444', 'country', 'US');

-- Add West Coast rates (slightly cheaper)
INSERT INTO shipping_zone_rates (
  zone_id, 
  method_name, 
  rate_type, 
  rate_amount, 
  free_threshold, 
  enabled, 
  display_order
)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Standard Shipping (3-5 business days)',
  'flat_rate',
  12.99,
  75.00,
  true,
  1
),
(
  '44444444-4444-4444-4444-444444444444',
  'Express Shipping (1-2 business days)',
  'flat_rate',
  19.99,
  NULL,
  true,
  2
);