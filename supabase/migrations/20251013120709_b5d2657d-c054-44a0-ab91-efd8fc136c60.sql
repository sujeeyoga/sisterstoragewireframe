-- Update the medium-bangle-box product to use the correct image
UPDATE woocommerce_products 
SET 
  images = '[{"src": "/lovable-uploads/medium-bangle-2rod-final.jpg", "alt": "Medium acrylic bangle storage box with 2 removable rods holding pink and orange bangles", "name": "medium-bangle-2rod-final"}]'::jsonb,
  updated_at = now()
WHERE id = 25814005;