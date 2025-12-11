-- Update free shipping threshold from $50 to $60 for Toronto/GTA zones
UPDATE shipping_zone_rates 
SET free_threshold = 60, updated_at = NOW()
WHERE zone_id IN (
  SELECT id FROM shipping_zones 
  WHERE name ILIKE '%GTA%' OR name ILIKE '%Toronto%'
);