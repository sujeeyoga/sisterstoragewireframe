-- Update stock quantity for open box items to 15 units
UPDATE woocommerce_products 
SET 
  stock_quantity = 15,
  updated_at = now()
WHERE slug IN ('open-box-bangle-boxes', 'open-box-item-large-bangle-box-4-rods');