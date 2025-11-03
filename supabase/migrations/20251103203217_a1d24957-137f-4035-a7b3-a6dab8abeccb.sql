-- Update open box products to $16 sale price promotion
UPDATE woocommerce_products 
SET 
  sale_price = 16.00, 
  price = 16.00,
  updated_at = now()
WHERE slug IN ('open-box-bangle-boxes', 'open-box-item-large-bangle-box-4-rods');

-- Verify the update
SELECT id, name, slug, regular_price, sale_price, price, stock_quantity
FROM woocommerce_products
WHERE slug IN ('open-box-bangle-boxes', 'open-box-item-large-bangle-box-4-rods');