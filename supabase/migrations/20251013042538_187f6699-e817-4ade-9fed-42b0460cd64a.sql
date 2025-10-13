-- Update Medium Bangle Box (2 Rod) with the uploaded product image
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 999001,
      'src', '/lovable-uploads/medium-bangle-box-2rod.jpg',
      'name', 'medium-bangle-box-2rod',
      'alt', 'Medium acrylic bangle storage box with 2 removable rods holding pink and orange bangles'
    ),
    (images->1),
    (images->2),
    (images->3)
  ),
  updated_at = now()
WHERE id = 25813968;