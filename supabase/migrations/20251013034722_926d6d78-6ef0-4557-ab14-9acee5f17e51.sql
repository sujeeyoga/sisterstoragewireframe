
-- Update the Large Bangle Box (4 Rods) to be an open box item with 4 in stock
UPDATE woocommerce_products 
SET 
  stock_quantity = 4,
  categories = '[{"slug": "open-box"}, {"slug": "open-box-deals"}, {"slug": "bangle-boxes"}]'::jsonb,
  updated_at = now()
WHERE id = 25814132;
