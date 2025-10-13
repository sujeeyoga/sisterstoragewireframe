
-- Update open box Large Bangle Box to use actual product photo
UPDATE woocommerce_products 
SET 
  images = '[
    {
      "id": 25813964,
      "src": "https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1.jpg",
      "name": "Large Bangle Box",
      "alt": "Pink acrylic large bangle storage box with 4 removable rods",
      "thumbnail": "https://sisterstorage.com/wp-content/uploads/2024/12/pr3-2-1-600x600.jpg"
    }
  ]'::jsonb,
  updated_at = now()
WHERE id = 25814132;

-- Update open box bangle boxes to use actual bundle photo
UPDATE woocommerce_products 
SET 
  images = '[
    {
      "id": 25814504,
      "src": "https://sisterstorage.com/wp-content/uploads/2025/04/4-LARGE-BANGLE-BOXES.png",
      "name": "Bangle Storage Boxes",
      "alt": "Multiple pink acrylic bangle storage boxes",
      "thumbnail": "https://sisterstorage.com/wp-content/uploads/2025/04/4-LARGE-BANGLE-BOXES-600x600.png"
    }
  ]'::jsonb,
  updated_at = now()
WHERE id = 25814007;
