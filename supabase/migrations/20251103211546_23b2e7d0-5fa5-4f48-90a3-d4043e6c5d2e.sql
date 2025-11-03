-- Update stock quantity for multipurpose box to 15 units
UPDATE woocommerce_products 
SET 
  stock_quantity = 15,
  updated_at = now()
WHERE slug = 'multipurpose-box-1-large-box';