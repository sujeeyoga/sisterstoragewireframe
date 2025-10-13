-- Update Travel Bangle Box with correct images
UPDATE woocommerce_products 
SET images = '[
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/travel%20size/1759979156639-wffbli.jpg", "alt": "Travel Bangle Box with 1 rod - compact size", "name": "travel-box-1"},
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/travel%20size/1759979155834-hrflz.jpg", "alt": "Travel Bangle Box detail view", "name": "travel-box-2"},
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/travel%20size/1759979155051-i3xg07.jpg", "alt": "Travel Bangle Box open view", "name": "travel-box-3"}
]'::jsonb,
    updated_at = now()
WHERE id = 25814006;