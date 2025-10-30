-- Remove fixed rates for US zones - they will use real-time Stallion pricing
UPDATE shipping_zone_rates
SET 
  free_threshold = NULL,
  updated_at = now()
WHERE zone_id IN (
  '33333333-3333-3333-3333-333333333333',  -- US Standard
  '44444444-4444-4444-4444-444444444444'   -- US West Coast
);