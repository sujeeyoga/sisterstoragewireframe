-- Update Medium Bangle Box with new uploaded image
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 999003,
      'src', '/lovable-uploads/medium-bangle-box-2rod-v2.jpg',
      'name', 'medium-bangle-box-2rod-v2',
      'alt', 'Medium acrylic bangle storage box with 2 removable rods holding pink and orange bangles'
    ),
    (images->1),
    (images->2),
    (images->3)
  ),
  updated_at = now()
WHERE id = 25813968;