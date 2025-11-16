
-- Disable all existing rates for US shipping zones
UPDATE shipping_zone_rates 
SET enabled = false, updated_at = NOW()
WHERE zone_id IN (
  '33333333-3333-3333-3333-333333333333', -- United States - Standard
  '44444444-4444-4444-4444-444444444444'  -- US West Coast
);

-- Insert new $30 flat rate for United States - Standard zone
INSERT INTO shipping_zone_rates (
  zone_id,
  method_name,
  rate_type,
  rate_amount,
  free_threshold,
  enabled,
  display_order
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Flat Rate Shipping',
  'flat_rate',
  30.00,
  NULL,
  true,
  0
);

-- Disable the US West Coast zone entirely
UPDATE shipping_zones 
SET enabled = false, updated_at = NOW()
WHERE id = '44444444-4444-4444-4444-444444444444';
