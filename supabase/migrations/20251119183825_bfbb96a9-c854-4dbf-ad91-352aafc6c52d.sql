-- Update free shipping thresholds to $289 for US zones
UPDATE shipping_zone_rates
SET free_threshold = 289.00
WHERE zone_id IN (
  SELECT id FROM shipping_zones 
  WHERE name LIKE '%United States%' OR name LIKE '%US%'
)
AND free_threshold IS NOT NULL;