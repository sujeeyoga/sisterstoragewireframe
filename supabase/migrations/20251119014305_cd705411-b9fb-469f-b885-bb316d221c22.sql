-- Update Jewelry Bag Organizer product images to use available images
UPDATE woocommerce_products
SET images = jsonb_build_array(
  jsonb_build_object(
    'id', 1,
    'src', '/lovable-uploads/03cc68a5-5bfc-4417-bf01-d43578ffa321.png',
    'name', 'jewelry-bag-organizer.png',
    'alt', 'Jewelry Bag Organizer - Portable jewelry storage pouches'
  )
)
WHERE name ILIKE '%jewelry bag organizer%';