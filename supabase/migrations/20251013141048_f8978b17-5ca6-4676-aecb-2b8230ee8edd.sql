-- Update bundle names to match the correct product names
UPDATE woocommerce_products 
SET name = 'The Complete Family Set',
    short_description = '4 Large Boxes, 2 Medium Boxes, 2 Travel Boxes'
WHERE slug = 'bundle-3';

UPDATE woocommerce_products 
SET name = 'Together Bundle',
    short_description = '3 Large Boxes, 2 Medium Boxes, 1 Travel Box'
WHERE slug = 'bundle-2';

UPDATE woocommerce_products 
SET name = 'Starter Set',
    short_description = '2 Large Boxes, 1 Medium Box, 1 Travel Box'
WHERE slug = 'bundle-1';