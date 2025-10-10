-- Add first sister story video
INSERT INTO public.sister_stories (
  title,
  author,
  description,
  video_url,
  video_path,
  display_order,
  is_active
) VALUES (
  'Sister Story 1',
  '@sisterstorage',
  'Organization journey shared with love',
  'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/videos/1760062793750-171q1r.mp4',
  '1760062793750-171q1r.mp4',
  0,
  true
);