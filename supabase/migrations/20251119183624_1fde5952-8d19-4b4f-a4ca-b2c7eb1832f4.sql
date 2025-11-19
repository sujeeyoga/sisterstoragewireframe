-- Update free shipping thresholds to $289 for main zones
UPDATE shipping_zone_rates
SET free_threshold = 289.00
WHERE zone_id IN (
  SELECT id FROM shipping_zones 
  WHERE name IN ('Toronto & GTA', 'Canada Wide', 'Toronto/GTA')
)
AND free_threshold IS NOT NULL;