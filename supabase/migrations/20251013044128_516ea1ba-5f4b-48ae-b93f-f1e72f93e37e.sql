-- Update Medium Bangle Box with fresh image path
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 999999,
      'src', '/lovable-uploads/medium-box-updated.jpg',
      'name', 'medium-box-updated',
      'alt', 'Medium acrylic bangle storage box with 2 removable rods holding pink and orange bangles'
    )
  ),
  updated_at = now()
WHERE id = 25813968;