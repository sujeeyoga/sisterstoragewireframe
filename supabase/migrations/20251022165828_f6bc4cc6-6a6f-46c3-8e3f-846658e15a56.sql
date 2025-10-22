
-- Update Toronto zone rate to include $50 free shipping threshold
UPDATE shipping_zone_rates 
SET free_threshold = 50
WHERE zone_id = 'c574a2a4-4e6b-4b51-95f6-4139375525e8'
  AND method_name = 'Standard Shipping';
