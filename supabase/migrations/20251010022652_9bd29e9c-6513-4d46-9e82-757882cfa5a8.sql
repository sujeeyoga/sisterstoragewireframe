-- Add all videos from sister storage bucket to database
INSERT INTO public.sister_stories (title, author, description, video_url, video_path, display_order, is_active) VALUES
('Sister Story 2', '@bingewithanbu', 'Organization journey shared with love', 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/bingewithanbu_.mp4', 'bingewithanbu_.mp4', 1, true),
('Sister Story 3', '@rishegaselva', 'Organization journey shared with love', 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/rishegaselva.mp4', 'rishegaselva.mp4', 2, true),
('Sister Story 4', '@nxtsisterduo', 'Organization journey shared with love', 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/nxtsisterduo_.mp4', 'nxtsisterduo_.mp4', 3, true),
('Sister Story 5', '@rishegaselva', 'Organization journey shared with love', 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/rishegaselva_.mp4', 'rishegaselva_.mp4', 4, true);