-- Create hero_images table to store home page hero images
CREATE TABLE public.hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('spotlight', 'gallery')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- Public can view active hero images
CREATE POLICY "Anyone can view active hero images"
  ON public.hero_images
  FOR SELECT
  USING (is_active = true OR has_role(auth.uid(), 'admin'));

-- Only admins can manage hero images
CREATE POLICY "Admins can manage hero images"
  ON public.hero_images
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON public.hero_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default images from current Hero component
INSERT INTO public.hero_images (image_url, position, display_order, is_active, alt_text) VALUES
  ('/lovable-uploads/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png', 'gallery', 1, true, 'Beautiful jewelry storage solutions'),
  ('/lovable-uploads/fb8da55a-c9bb-419e-a96f-175a667875e1.png', 'gallery', 2, true, 'Elegant pink and white bangle organizers'),
  ('/lovable-uploads/4ef08ea3-3380-4111-b4a1-eb939cba275b.png', 'gallery', 3, true, 'Organized jewelry display');