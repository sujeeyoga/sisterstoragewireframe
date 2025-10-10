-- Update hero_images table to use optimized images from storage bucket
UPDATE hero_images 
SET image_url = 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png',
    updated_at = now()
WHERE image_url = '/lovable-uploads/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png';

UPDATE hero_images 
SET image_url = 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/fb8da55a-c9bb-419e-a96f-175a667875e1.png',
    updated_at = now()
WHERE image_url = '/lovable-uploads/fb8da55a-c9bb-419e-a96f-175a667875e1.png';

UPDATE hero_images 
SET image_url = 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/4ef08ea3-3380-4111-b4a1-eb939cba275b.png',
    updated_at = now()
WHERE image_url = '/lovable-uploads/4ef08ea3-3380-4111-b4a1-eb939cba275b.png';