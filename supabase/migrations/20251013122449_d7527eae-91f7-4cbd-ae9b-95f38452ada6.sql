-- Update images for products with placeholders using static data

-- Update bundle-1 (Everyday Starter)
UPDATE woocommerce_products 
SET images = '[{"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Starter-Set-2x-Large-1x-Medium-Box-1x-Small-Box/1759980850863-5xgr2a.jpg", "alt": "Starter Set Bundle - 2 Large, 1 Medium, 1 Travel Box", "name": "starter-set"}]'::jsonb,
    updated_at = now()
WHERE slug = 'bundle-1';

-- Update bundle-3 (Full Luxe Collection)
UPDATE woocommerce_products 
SET images = '[{"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/The-Complete-Family-Set-4-Large-2-Medium-2-Travel/1759980920453-ezsfq.jpg", "alt": "Family Edition Bundle - 4 Large, 2 Medium, 2 Travel Boxes", "name": "family-edition"}]'::jsonb,
    updated_at = now()
WHERE slug = 'bundle-3';

-- Update bundle-2 (Home & Away Set)
UPDATE woocommerce_products 
SET images = '[{"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Together%20Bundle-%203%20Large%202%20Medium%201%20Travel/1759979157485-d2rva.jpg", "alt": "Sister Staples Bundle - 3 Large, 2 Medium, 1 Travel Box", "name": "sister-staples"}]'::jsonb,
    updated_at = now()
WHERE slug = 'bundle-2';

-- Update jewelry-bag-organizer
UPDATE woocommerce_products 
SET images = '[
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979983043-ydw0xu.jpg", "alt": "Jewelry Bag Organizer with 7 pouches", "name": "jewelry-organizer-1"},
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979982197-8onior.jpg", "alt": "Jewelry Bag Organizer detail", "name": "jewelry-organizer-2"},
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/jewlery%20bag/1759979981266-gqug88.jpg", "alt": "Jewelry Bag Organizer pouches", "name": "jewelry-organizer-3"}
]'::jsonb,
    updated_at = now()
WHERE slug = 'jewelry-bag-organizer';

-- Update large-bangle-box
UPDATE woocommerce_products 
SET images = '[
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Large%20bangle%20box/1759979146338-cqpngb.jpg", "alt": "Large Bangle Box with 4 rods", "name": "large-box-1"},
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Large%20bangle%20box/1759979145474-zyaeti.jpg", "alt": "Large Bangle Box detail", "name": "large-box-2"},
  {"src": "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Large%20bangle%20box/1759979144578-clou37.jpg", "alt": "Large Bangle Box open view", "name": "large-box-3"}
]'::jsonb,
    updated_at = now()
WHERE slug = 'large-bangle-box';