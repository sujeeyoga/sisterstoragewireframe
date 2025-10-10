-- Allow public access to videos and sister buckets for anonymous users
CREATE POLICY "Public videos are accessible to everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Public sister videos are accessible to everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'sister');