
CREATE TABLE public.page_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug text NOT NULL,
  section_key text NOT NULL,
  title text,
  subtitle text,
  description text,
  button_text text,
  video_url text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE (page_slug, section_key)
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view enabled page content"
ON public.page_content
FOR SELECT
USING ((enabled = true) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage page content"
ON public.page_content
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_page_content_updated_at
BEFORE UPDATE ON public.page_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the Culture page features
INSERT INTO public.page_content (page_slug, section_key, title, description, video_url, display_order) VALUES
('culture', 'feature_1', 'Travel Friendly', '"Pack your bangles without the stress. TSA-approved and ready for any destination — from weddings abroad to weekend getaways."', 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/videos/1760062793750-171q1r.mp4', 0),
('culture', 'feature_2', 'Shake Test Done ✓', '"We tested it so you don''t have to. Your jewelry stays secure, protected, and exactly where you left it."', '/lovable-uploads/sister-story-new.mp4', 1),
('culture', 'feature_3', 'Organization for Brown Queens', '"Made by us, for us. Finally, storage that understands our collections, our traditions, and our style."', 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/bingewithanbu_.mp4', 2);

-- Seed Culture page hero
INSERT INTO public.page_content (page_slug, section_key, title, subtitle, description, button_text, display_order) VALUES
('culture', 'hero', 'Culture,', 'without clutter.', 'We Got you SIs', 'Shop the Collection', -1);

-- Seed Culture page "Why Sister Storage"
INSERT INTO public.page_content (page_slug, section_key, title, description, display_order) VALUES
('culture', 'why_section', 'Why Sister Storage?', 'We believe storage should feel personal, respectful, and empowering. Sister Storage was created to help women protect what matters — without compromising beauty or culture.', 3);
