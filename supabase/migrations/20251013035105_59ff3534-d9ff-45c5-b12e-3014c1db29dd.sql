
-- Update open box products with proper images
UPDATE woocommerce_products 
SET 
  images = '[{"src": "/src/assets/open-box-bangle-boxes.jpg"}]'::jsonb,
  updated_at = now()
WHERE id = 25814007;

UPDATE woocommerce_products 
SET 
  images = '[{"src": "/src/assets/open-box-large-bangle-4rod.jpg"}]'::jsonb,
  updated_at = now()
WHERE id = 25814132;
