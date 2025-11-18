-- Update free shipping thresholds
-- Canada-wide (including GTA): $145
-- US: $199

-- Update Toronto/GTA zones to $145 (from $50)
UPDATE shipping_zone_rates 
SET free_threshold = 145.00
WHERE zone_id IN (
  '11111111-1111-1111-1111-111111111111',
  'aa000000-0000-0000-0000-000000000001'
);

-- Update Canada Wide zone to $145
UPDATE shipping_zone_rates 
SET free_threshold = 145.00
WHERE zone_id = '22222222-2222-2222-2222-222222222222';

-- Update US zones to $199
UPDATE shipping_zone_rates 
SET free_threshold = 199.00
WHERE zone_id IN (
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);