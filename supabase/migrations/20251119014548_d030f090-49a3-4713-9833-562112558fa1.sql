-- Update Travel Size Bangle Box image to use available image
UPDATE woocommerce_products
SET images = jsonb_build_array(
  jsonb_build_object(
    'id', 1,
    'src', '/lovable-uploads/160b5d30-ba2c-4e66-8423-c4a6288d1af0.png',
    'name', 'travel-bangle-box.png',
    'alt', 'Travel Size Bangle Box - Compact 1 rod jewelry organizer'
  )
)
WHERE name = 'Travel Size Bangle Box (1 Rod)';