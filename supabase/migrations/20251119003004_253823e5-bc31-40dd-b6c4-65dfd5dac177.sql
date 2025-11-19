-- Update Canada Wide Shipping rate to $35
UPDATE shipping_zone_rates
SET rate_amount = 35.00
WHERE zone_id = '22222222-2222-2222-2222-222222222222'
AND method_name = 'Canada Wide Shipping';