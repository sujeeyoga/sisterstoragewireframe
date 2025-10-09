-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
DROP POLICY IF EXISTS "Images are publicly viewable" ON storage.objects;

-- Create public access policies for images bucket
CREATE POLICY "Anyone can upload to images bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Anyone can update images bucket"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'images');

CREATE POLICY "Anyone can delete from images bucket"
ON storage.objects
FOR DELETE
USING (bucket_id = 'images');

CREATE POLICY "Anyone can view images bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');