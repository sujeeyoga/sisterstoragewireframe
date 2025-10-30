-- Update shipping rates to match actual Stallion costs and prevent losses

-- 1. Update Toronto/GTA rate: increase rate and free shipping threshold
UPDATE shipping_zone_rates
SET 
  rate_amount = 11.50,
  free_threshold = 75.00,
  updated_at = now()
WHERE id = 'edcf4f84-0d2d-49c9-86fc-4f4aeb182bb1'; -- Toronto/GTA Standard Shipping

-- 2. Update US Standard rate to match actual cost
UPDATE shipping_zone_rates
SET 
  rate_amount = 20.00,
  free_threshold = 100.00,
  updated_at = now()
WHERE id = 'b17afd58-cb69-4736-b24b-5af2cd025dd7'; -- US Standard Shipping

-- 3. Update US West Coast rate to match actual cost
UPDATE shipping_zone_rates
SET 
  rate_amount = 20.00,
  free_threshold = 100.00,
  updated_at = now()
WHERE id = '86f78388-e25f-44f9-b7c2-9898280d87fa'; -- US West Coast Standard Shipping

-- Log the changes
DO $$
BEGIN
  RAISE NOTICE 'Updated shipping rates:';
  RAISE NOTICE '- Toronto/GTA: $11.50 (free over $75)';
  RAISE NOTICE '- US Standard: $20.00 (free over $100)';
  RAISE NOTICE '- US West Coast: $20.00 (free over $100)';
END $$;