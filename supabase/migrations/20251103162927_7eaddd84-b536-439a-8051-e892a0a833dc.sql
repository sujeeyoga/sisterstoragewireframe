-- Update product weights (converting from pounds to grams)
-- 1 lb = 453.592 grams

-- Travel Bangle Box: 0.375 lb = 170.1 grams
UPDATE woocommerce_products
SET weight = 170.1,
    package_value = 75,
    updated_at = now()
WHERE name ILIKE '%travel%bangle%'
   OR name ILIKE '%small%bangle%';

-- Medium Bangle Box: 0.655 lb = 297.1 grams
UPDATE woocommerce_products
SET weight = 297.1,
    package_value = 85,
    updated_at = now()
WHERE name ILIKE '%medium%bangle%';

-- Large Bangle Box: 1.280 lb = 580.6 grams
UPDATE woocommerce_products
SET weight = 580.6,
    package_value = 95,
    updated_at = now()
WHERE name ILIKE '%large%bangle%';

-- Jewelry Bag Organizer: 1.085 lb = 492.1 grams
UPDATE woocommerce_products
SET weight = 492.1,
    package_value = 65,
    updated_at = now()
WHERE name ILIKE '%jewelry%bag%'
   OR name ILIKE '%organizer%bag%';

-- Multipurpose/Open Box: 1.83 lb = 830.1 grams
UPDATE woocommerce_products
SET weight = 830.1,
    package_value = 50,
    updated_at = now()
WHERE name ILIKE '%open%box%'
   OR name ILIKE '%multipurpose%';