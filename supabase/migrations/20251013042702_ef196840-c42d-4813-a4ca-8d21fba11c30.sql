-- Update open box products with the uploaded product image
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 999002,
      'src', '/lovable-uploads/open-box-bangle-4rod.jpg',
      'name', 'open-box-bangle-4rod',
      'alt', 'Open box large bangle storage box with 4 rods holding colorful bangles'
    )
  ),
  updated_at = now()
WHERE id IN (25814132, 25814007);