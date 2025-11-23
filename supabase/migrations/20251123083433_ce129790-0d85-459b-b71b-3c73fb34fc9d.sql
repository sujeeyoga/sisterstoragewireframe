-- Update Medium Bangle Box with correct image
UPDATE woocommerce_products 
SET images = jsonb_build_array(
  jsonb_build_object(
    'id', 0,
    'src', '/lovable-uploads/medium-bangle-2rod-correct.jpg',
    'name', 'medium-bangle-2rod-correct',
    'alt', 'Medium acrylic bangle storage box with 2 removable rods holding pink and orange bangles'
  )
)
WHERE id = 25814005 AND name = 'Medium Bangle Box';