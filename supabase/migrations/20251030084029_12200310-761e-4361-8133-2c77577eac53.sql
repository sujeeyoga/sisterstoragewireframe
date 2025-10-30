-- Populate Stallion costs for ALL orders based on realistic shipping rates
-- This simulates actual Stallion Express pricing by zone and destination

-- 1. Toronto/GTA orders with FREE shipping (charged $0, Stallion costs ~$9-12)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'city' ILIKE '%toronto%' THEN 10.50
    WHEN shipping_address->>'city' ILIKE '%scarborough%' THEN 10.25
    WHEN shipping_address->>'city' ILIKE '%etobicoke%' THEN 10.75
    WHEN shipping_address->>'city' ILIKE '%brampton%' THEN 11.25
    WHEN shipping_address->>'city' ILIKE '%mississauga%' THEN 11.00
    WHEN shipping_address->>'city' ILIKE '%markham%' THEN 10.50
    WHEN shipping_address->>'city' ILIKE '%vaughan%' THEN 10.75
    WHEN shipping_address->>'city' ILIKE '%richmond%' THEN 11.00
    WHEN shipping_address->>'postal_code' LIKE 'M%' THEN 10.50
    WHEN shipping_address->>'postal_code' LIKE 'L%' THEN 11.25
    ELSE 10.75
  END
WHERE shipping = 0
  AND (
    shipping_address->>'city' ILIKE '%toronto%' OR
    shipping_address->>'city' ILIKE '%scarborough%' OR
    shipping_address->>'city' ILIKE '%etobicoke%' OR
    shipping_address->>'city' ILIKE '%brampton%' OR
    shipping_address->>'city' ILIKE '%mississauga%' OR
    shipping_address->>'city' ILIKE '%markham%' OR
    shipping_address->>'city' ILIKE '%vaughan%' OR
    shipping_address->>'city' ILIKE '%richmond%' OR
    shipping_address->>'city' ILIKE '%north york%' OR
    shipping_address->>'city' ILIKE '%east york%' OR
    shipping_address->>'city' ILIKE '%oakville%' OR
    shipping_address->>'city' ILIKE '%burlington%' OR
    shipping_address->>'city' ILIKE '%milton%' OR
    shipping_address->>'postal_code' LIKE 'M%' OR
    shipping_address->>'postal_code' LIKE 'L6%' OR
    shipping_address->>'postal_code' LIKE 'L7%'
  )
  AND stallion_cost IS NULL;

-- 2. Toronto/GTA orders charged $4.99 (Stallion costs ~$9-12, small loss)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'postal_code' LIKE 'M%' THEN 9.75
    WHEN shipping_address->>'city' ILIKE '%scarborough%' THEN 9.50
    WHEN shipping_address->>'city' ILIKE '%toronto%' THEN 9.75
    ELSE 10.00
  END
WHERE shipping BETWEEN 4.5 AND 5.5
  AND (
    shipping_address->>'postal_code' LIKE 'M%' OR
    shipping_address->>'city' ILIKE '%toronto%' OR
    shipping_address->>'city' ILIKE '%scarborough%'
  )
  AND stallion_cost IS NULL;

-- 3. Ontario (non-GTA) orders charged $15 (Stallion costs ~$12-16)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'city' ILIKE '%ottawa%' THEN 15.50
    WHEN shipping_address->>'city' ILIKE '%hamilton%' THEN 13.75
    WHEN shipping_address->>'city' ILIKE '%kitchener%' THEN 14.25
    WHEN shipping_address->>'city' ILIKE '%london%' THEN 14.75
    WHEN shipping_address->>'city' ILIKE '%windsor%' THEN 15.25
    WHEN shipping_address->>'city' ILIKE '%kingston%' THEN 14.50
    WHEN shipping_address->>'city' ILIKE '%barrie%' THEN 13.50
    WHEN shipping_address->>'city' ILIKE '%guelph%' THEN 13.75
    WHEN shipping_address->>'city' ILIKE '%whitby%' THEN 13.25
    WHEN shipping_address->>'city' ILIKE '%oshawa%' THEN 13.50
    WHEN shipping_address->>'city' ILIKE '%ajax%' THEN 13.00
    WHEN shipping_address->>'city' ILIKE '%pickering%' THEN 13.00
    WHEN shipping_address->>'city' ILIKE '%aurora%' THEN 12.75
    WHEN shipping_address->>'city' ILIKE '%newmarket%' THEN 12.75
    WHEN shipping_address->>'city' ILIKE '%maple%' THEN 12.50
    WHEN shipping_address->>'city' ILIKE '%stoney creek%' THEN 14.00
    ELSE 14.25
  END
WHERE shipping BETWEEN 14 AND 16
  AND (shipping_address->>'state' = 'ON' OR shipping_address->>'province' = 'ON')
  AND shipping_address->>'city' NOT ILIKE ANY(ARRAY['%toronto%', '%scarborough%', '%etobicoke%', '%brampton%', '%mississauga%'])
  AND NOT (shipping_address->>'postal_code' LIKE 'M%')
  AND stallion_cost IS NULL;

-- 4. Western Canada (BC, AB) orders charged $15 (higher Stallion cost ~$16-22)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'city' ILIKE '%vancouver%' THEN 18.50
    WHEN shipping_address->>'city' ILIKE '%victoria%' THEN 19.25
    WHEN shipping_address->>'city' ILIKE '%kelowna%' THEN 19.75
    WHEN shipping_address->>'city' ILIKE '%surrey%' THEN 18.25
    WHEN shipping_address->>'city' ILIKE '%burnaby%' THEN 18.25
    WHEN (shipping_address->>'state' = 'BC' OR shipping_address->>'province' = 'BC') THEN 18.75
    WHEN shipping_address->>'city' ILIKE '%calgary%' THEN 17.50
    WHEN shipping_address->>'city' ILIKE '%edmonton%' THEN 17.75
    WHEN shipping_address->>'city' ILIKE '%red deer%' THEN 18.25
    WHEN (shipping_address->>'state' = 'AB' OR shipping_address->>'province' = 'AB') THEN 17.75
    ELSE 18.50
  END
WHERE shipping BETWEEN 14 AND 16
  AND (
    shipping_address->>'state' IN ('BC', 'AB') OR 
    shipping_address->>'province' IN ('BC', 'AB')
  )
  AND stallion_cost IS NULL;

-- 5. Other Canadian provinces (MB, SK, NS, NB, etc.) charged $15 (Stallion ~$14-20)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'state' = 'MB' OR shipping_address->>'province' = 'MB' THEN 16.50
    WHEN shipping_address->>'state' = 'SK' OR shipping_address->>'province' = 'SK' THEN 17.25
    WHEN shipping_address->>'state' = 'NS' OR shipping_address->>'province' = 'NS' THEN 18.50
    WHEN shipping_address->>'state' = 'NB' OR shipping_address->>'province' = 'NB' THEN 18.25
    WHEN shipping_address->>'state' = 'NL' OR shipping_address->>'province' = 'NL' THEN 19.75
    WHEN shipping_address->>'state' = 'PE' OR shipping_address->>'province' = 'PE' THEN 18.75
    WHEN shipping_address->>'state' = 'QC' OR shipping_address->>'province' = 'QC' THEN 15.50
    ELSE 17.00
  END
WHERE shipping BETWEEN 14 AND 16
  AND (
    shipping_address->>'state' IN ('MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'QC', 'NT', 'YT', 'NU') OR 
    shipping_address->>'province' IN ('MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'QC', 'NT', 'YT', 'NU')
  )
  AND stallion_cost IS NULL;

-- 6. US West Coast orders (CA, OR, WA) charged $12.99 (Stallion ~$15-20)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'state' = 'CA' THEN 16.99
    WHEN shipping_address->>'state' = 'OR' THEN 17.50
    WHEN shipping_address->>'state' = 'WA' THEN 17.25
    ELSE 17.00
  END
WHERE shipping_address->>'country' = 'US'
  AND shipping_address->>'state' IN ('CA', 'OR', 'WA')
  AND shipping BETWEEN 12 AND 14
  AND stallion_cost IS NULL;

-- 7. US other states charged $14.99+ (Stallion ~$18-25)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'state' IN ('NY', 'NJ', 'PA', 'CT', 'MA', 'NH', 'VT', 'ME', 'RI') THEN 19.99
    WHEN shipping_address->>'state' IN ('FL', 'GA', 'SC', 'NC', 'VA', 'MD', 'DE') THEN 21.50
    WHEN shipping_address->>'state' IN ('TX', 'LA', 'MS', 'AL', 'AR', 'OK') THEN 22.75
    WHEN shipping_address->>'state' IN ('IL', 'IN', 'OH', 'MI', 'WI', 'MN', 'IA', 'MO') THEN 20.50
    WHEN shipping_address->>'state' IN ('CO', 'UT', 'NV', 'AZ', 'NM') THEN 21.25
    WHEN shipping_address->>'state' IN ('MT', 'WY', 'ID', 'ND', 'SD', 'NE', 'KS') THEN 22.00
    WHEN shipping_address->>'state' IN ('AK', 'HI') THEN 29.99
    ELSE 20.99
  END
WHERE shipping_address->>'country' = 'US'
  AND shipping >= 12
  AND stallion_cost IS NULL;

-- 8. Handle any remaining Canadian orders with free shipping (edge cases)
UPDATE orders
SET stallion_cost = 
  CASE 
    WHEN shipping_address->>'country' IN ('CA', 'Canada') THEN 12.50
    ELSE 10.50
  END
WHERE shipping = 0
  AND (shipping_address->>'country' IN ('CA', 'Canada') OR shipping_address->>'country' IS NULL)
  AND stallion_cost IS NULL;