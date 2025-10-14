-- Create site_texts table for managing all site content
CREATE TABLE IF NOT EXISTS public.site_texts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  title text,
  subtitle text,
  description text,
  button_text text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Site texts are publicly viewable"
  ON public.site_texts
  FOR SELECT
  USING (enabled = true OR has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage
CREATE POLICY "Only admins can insert site texts"
  ON public.site_texts
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update site texts"
  ON public.site_texts
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete site texts"
  ON public.site_texts
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_site_texts_updated_at
  BEFORE UPDATE ON public.site_texts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default content
INSERT INTO public.site_texts (section_key, title, subtitle, description, enabled) VALUES
  ('hero_main', 'Sister Storage', 'Culture Without Clutter', 'Organize your bangles beautifully with our handcrafted storage solutions', true),
  ('footer_copyright', null, '© 2025 Sister Storage — Culture without clutter.', null, true),
  ('newsletter_header', 'Join Our Community', 'Subscribe for exclusive offers and updates', null, true),
  ('promo_banner', 'Free Shipping', 'On orders over $50 in the GTA', null, true),
  ('shop_hero', 'Shop Our Collection', 'Premium bangle storage solutions', null, true)
ON CONFLICT (section_key) DO NOTHING;