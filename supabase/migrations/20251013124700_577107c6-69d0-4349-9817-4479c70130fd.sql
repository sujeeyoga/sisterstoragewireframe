-- Update Open Box Bangle Boxes: 4 in stock with 25% discount
UPDATE woocommerce_products 
SET 
  stock_quantity = 4,
  sale_price = 11.25,  -- 25% off regular price of $15
  price = 11.25,
  updated_at = now()
WHERE slug = 'open-box-deals';