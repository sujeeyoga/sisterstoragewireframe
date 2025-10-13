-- Update Medium Bangle Box (2 Rod) with final image
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 25813969,
      'src', '/lovable-uploads/medium-bangle-2rod-final.jpg',
      'name', 'medium-bangle-2rod-final',
      'alt', 'Medium acrylic bangle storage box with 2 removable rods holding pink and orange bangles'
    )
  ),
  updated_at = now()
WHERE id = 25813968;