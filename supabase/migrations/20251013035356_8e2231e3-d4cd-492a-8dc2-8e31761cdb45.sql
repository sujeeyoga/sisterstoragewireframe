
-- Fix open box product image paths
UPDATE woocommerce_products 
SET 
  images = '[{"id": 1, "src": "/src/assets/open-box-bangle-boxes.jpg", "name": "Open Box Bangle Boxes", "alt": "Pink acrylic bangle storage boxes in various sizes"}]'::jsonb,
  updated_at = now()
WHERE id = 25814007;

UPDATE woocommerce_products 
SET 
  images = '[{"id": 1, "src": "/src/assets/open-box-large-bangle-4rod.jpg", "name": "Large Bangle Box 4 Rod", "alt": "Large pink acrylic bangle storage box with 4 removable rods"}]'::jsonb,
  updated_at = now()
WHERE id = 25814132;
