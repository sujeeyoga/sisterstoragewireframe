-- Fix Medium Bangle Box (2 Rod) product image
UPDATE woocommerce_products 
SET images = jsonb_build_array(
  jsonb_build_object(
    'id', 0,
    'src', '/lovable-uploads/medium-bangle-2rod-final.jpg',
    'name', 'medium-bangle-2rod-final',
    'alt', 'Medium acrylic bangle storage box with 2 removable rods holding pink and orange bangles'
  )
)
WHERE id = 8536 AND name = 'Medium Bangle Box (2 Rod)';