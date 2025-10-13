
-- Clean up open box products - remove HTML markup and use actual shop photos

-- Update Large Bangle Box open box item
UPDATE woocommerce_products 
SET 
  description = 'Open Box Large 4-Rod Bangle Box: Our most popular size, perfect for your big (and still growing) collection—because let''s be real, you''re not stopping anytime soon. May have minor scuffs or scratches, but fully functional and ready to organize at a discounted price!',
  short_description = 'Dimensions: 38cm (L) × 25cm (W) × 9cm (H). Capacity: Approx. 348 regular-sized bangles. Open Box: Slight scuffs or scratches, but fully functional and ready to organize your bangles—at a discounted price!',
  images = '[
    {
      "id": 25813964,
      "src": "https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1.jpg",
      "name": "pr3-2 (1)",
      "alt": "Large pink acrylic bangle storage box with 4 removable rods",
      "thumbnail": "https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1-600x600.jpg",
      "srcset": "https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1.jpg 800w, https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1-600x600.jpg 600w"
    },
    {
      "id": 25813965,
      "src": "https://sisterstorage.com/wp-content/uploads/2024/12/4-1.jpg",
      "name": "4 (1)",
      "alt": "Large bangle box detail view",
      "thumbnail": "https://sisterstorage.com/wp-content/uploads/2024/12/4-1-600x600.jpg"
    }
  ]'::jsonb,
  updated_at = now()
WHERE id = 25814132;

-- Update Open Box Bangle Boxes
UPDATE woocommerce_products 
SET 
  description = 'SAVE. SMART. BEAUTIFUL. Smart savings on quality boxes.',
  short_description = 'Like-new condition boxes at reduced prices',
  updated_at = now()
WHERE id = 25814007;
