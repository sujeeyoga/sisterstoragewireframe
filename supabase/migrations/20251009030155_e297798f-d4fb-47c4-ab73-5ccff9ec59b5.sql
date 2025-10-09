-- Allow anyone to delete uploaded images metadata
CREATE POLICY "Anyone can delete uploaded images metadata"
ON public.uploaded_images
FOR DELETE
TO anon, authenticated
USING (true);

-- Allow anyone to update uploaded images metadata
CREATE POLICY "Anyone can update uploaded images metadata"
ON public.uploaded_images
FOR UPDATE
TO anon, authenticated
USING (true);