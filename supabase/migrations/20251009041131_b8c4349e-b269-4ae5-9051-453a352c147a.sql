-- Drop the existing permissive policies
DROP POLICY IF EXISTS "Anyone can insert uploaded images metadata" ON public.uploaded_images;
DROP POLICY IF EXISTS "Anyone can delete uploaded images metadata" ON public.uploaded_images;
DROP POLICY IF EXISTS "Anyone can update uploaded images metadata" ON public.uploaded_images;

-- Create admin-only policies for insert, update, delete
CREATE POLICY "Only admins can insert uploaded images metadata"
ON public.uploaded_images
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update uploaded images metadata"
ON public.uploaded_images
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete uploaded images metadata"
ON public.uploaded_images
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Keep the public select policy for the store
-- (Images metadata is publicly viewable policy already exists)