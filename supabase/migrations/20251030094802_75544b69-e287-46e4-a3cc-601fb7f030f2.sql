-- Fix shipping rates: GTA free over $50, US no free shipping

-- Update Toronto/GTA: $11.50 with free over $50
UPDATE shipping_zone_rates
SET 
  rate_amount = 11.50,
  free_threshold = 50.00,
  updated_at = now()
WHERE id = 'edcf4f84-0d2d-49c9-86fc-4f4aeb182bb1';

-- Update US Standard: $20.00 with NO free shipping
UPDATE shipping_zone_rates
SET 
  rate_amount = 20.00,
  free_threshold = NULL,
  updated_at = now()
WHERE id = 'b17afd58-cb69-4736-b24b-5af2cd025dd7';

-- Update US West Coast: $20.00 with NO free shipping
UPDATE shipping_zone_rates
SET 
  rate_amount = 20.00,
  free_threshold = NULL,
  updated_at = now()
WHERE id = '86f78388-e25f-44f9-b7c2-9898280d87fa';