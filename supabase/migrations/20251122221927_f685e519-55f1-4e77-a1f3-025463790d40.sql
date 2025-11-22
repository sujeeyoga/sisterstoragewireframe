-- Fix incorrect image URLs for Jewelry Bag Organizer and Medium Bangle Box
UPDATE woocommerce_products 
SET images = '[{"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979983043-ydw0xu.jpg", "name": "jewelry-bag-organizer.jpg", "alt": "Jewelry Bag Organizer"}]'::jsonb
WHERE id = 25814008;

UPDATE woocommerce_products 
SET images = '[{"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/HERO%20IMAGE%20REPLACEMENT/1759979141544-6zp7u6.jpg", "name": "medium-bangle-box.jpg", "alt": "Medium Bangle Box"}]'::jsonb
WHERE id = 25814005;