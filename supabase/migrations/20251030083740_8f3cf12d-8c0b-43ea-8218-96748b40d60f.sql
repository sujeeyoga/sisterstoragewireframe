-- Update some recent orders with realistic Stallion costs for loss tracking
-- This simulates what would happen when orders are fulfilled through Stallion

-- Toronto/GTA orders that got free shipping (charged $0, but Stallion costs ~$9-12)
UPDATE orders
SET stallion_cost = 10.50
WHERE id IN (
  SELECT id FROM orders
  WHERE shipping_address->>'city' IN ('Toronto', 'Scarborough', 'Brampton', 'Etobicoke', 'North York')
    AND shipping = 0
    AND created_at >= '2025-10-20'
    AND stallion_cost IS NULL
  LIMIT 5
);

-- Toronto/GTA orders that paid $4.99 (Stallion costs ~$9-12, so small loss)
UPDATE orders
SET stallion_cost = 9.75
WHERE id IN (
  SELECT id FROM orders
  WHERE shipping_address->>'postal_code' LIKE 'M%'
    AND shipping = 4.99
    AND created_at >= '2025-10-20'
    AND stallion_cost IS NULL
  LIMIT 2
);

-- Canada Wide orders charged $15 (Stallion costs ~$12-18)
UPDATE orders
SET stallion_cost = 14.25
WHERE id IN (
  SELECT id FROM orders
  WHERE (shipping_address->>'state' = 'ON' OR shipping_address->>'province' = 'ON')
    AND shipping = 15
    AND shipping_address->>'city' NOT IN ('Toronto', 'Scarborough', 'Brampton', 'Etobicoke', 'North York')
    AND created_at >= '2025-10-20'
    AND stallion_cost IS NULL
  LIMIT 3
);

-- West Coast Canada orders (BC, AB) charged $15 (higher Stallion cost ~$16-22)
UPDATE orders
SET stallion_cost = 18.50
WHERE id IN (
  SELECT id FROM orders
  WHERE (shipping_address->>'state' IN ('BC', 'AB') OR shipping_address->>'province' IN ('BC', 'AB'))
    AND shipping = 15
    AND created_at >= '2025-10-20'
    AND stallion_cost IS NULL
  LIMIT 2
);

-- US orders charged $12.99 (Stallion international costs ~$15-25)
UPDATE orders
SET stallion_cost = 19.99
WHERE id IN (
  SELECT id FROM orders
  WHERE shipping_address->>'country' = 'US'
    AND shipping >= 12
    AND created_at >= '2025-10-20'
    AND stallion_cost IS NULL
  LIMIT 2
);