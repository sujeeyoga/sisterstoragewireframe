-- Update all main bangle box products with consistent image sources

-- Large Bangle Box (4 Rod) - Use the existing WooCommerce image
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 25813964,
      'src', 'https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1.jpg',
      'name', 'large-bangle-box-4rod',
      'alt', 'Large pink acrylic bangle storage box with 4 removable rods',
      'thumbnail', 'https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1-600x600.jpg'
    )
  ),
  updated_at = now()
WHERE slug = 'large-bangle-box-4-rod';

-- Medium Bangle Box - Already updated, ensure it's correct
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 25813969,
      'src', '/lovable-uploads/medium-bangle-box.jpg',
      'name', 'medium-bangle-box',
      'alt', 'Medium acrylic bangle storage box with 2 removable rods'
    )
  ),
  updated_at = now()
WHERE slug = 'medium-bangle-box-2-rod';

-- Small Bangle Box - Use WooCommerce image
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 25813966,
      'src', 'https://sisterstorage.com/wp-content/uploads/2024/12/pr2-2-1.jpg',
      'name', 'small-bangle-box',
      'alt', 'Small acrylic bangle storage box with 1 removable rod',
      'thumbnail', 'https://sisterstorage.com/wp-content/uploads/2024/12/pr2-2-1-600x600.jpg'
    )
  ),
  updated_at = now()
WHERE slug = 'small-bangle-box';

-- Travel Bangle Box - Use WooCommerce image  
UPDATE woocommerce_products 
SET 
  images = jsonb_build_array(
    jsonb_build_object(
      'id', 25813967,
      'src', 'https://sisterstorage.com/wp-content/uploads/2024/12/pr4-2-1.jpg',
      'name', 'travel-bangle-box',
      'alt', 'Compact travel bangle storage box',
      'thumbnail', 'https://sisterstorage.com/wp-content/uploads/2024/12/pr4-2-1-600x600.jpg'
    )
  ),
  updated_at = now()
WHERE slug = 'travel-bangle-box';