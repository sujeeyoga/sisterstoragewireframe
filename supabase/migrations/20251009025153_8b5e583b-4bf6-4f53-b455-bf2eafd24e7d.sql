-- Create storage bucket for optimized images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for images bucket
CREATE POLICY "Admins can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
);

CREATE POLICY "Admins can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
);

CREATE POLICY "Admins can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'images' AND
  auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin')
);

CREATE POLICY "Images are publicly viewable"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Create table to track uploaded images
CREATE TABLE IF NOT EXISTS public.uploaded_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer NOT NULL,
  original_size integer NOT NULL,
  mime_type text NOT NULL,
  width integer,
  height integer,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for uploaded_images
CREATE POLICY "Admins can manage uploaded images"
ON public.uploaded_images
FOR ALL
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));

CREATE POLICY "Images metadata is publicly viewable"
ON public.uploaded_images
FOR SELECT
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_uploaded_images_updated_at
BEFORE UPDATE ON public.uploaded_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();