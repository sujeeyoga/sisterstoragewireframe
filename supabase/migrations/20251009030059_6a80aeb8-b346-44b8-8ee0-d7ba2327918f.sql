-- Storage policies: allow anon and authenticated explicitly
DROP POLICY IF EXISTS "Anyone can upload to images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete from images bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images bucket" ON storage.objects;

CREATE POLICY "Anon and authed can upload to images"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anon and authed can update images"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'images');

CREATE POLICY "Anon and authed can delete images"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id = 'images');

CREATE POLICY "Anon and authed can view images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'images');

-- Uploaded images metadata: allow inserts without auth
DROP POLICY IF EXISTS "Admins can manage uploaded images" ON public.uploaded_images;
CREATE POLICY "Anyone can insert uploaded images metadata"
ON public.uploaded_images
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow reading by anyone (keep existing or ensure present)
DROP POLICY IF EXISTS "Images metadata is publicly viewable" ON public.uploaded_images;
CREATE POLICY "Images metadata is publicly viewable"
ON public.uploaded_images
FOR SELECT
TO anon, authenticated
USING (true);
