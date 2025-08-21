-- Create storage policies for the sister bucket to allow public access

-- Policy to allow anyone to view/list objects in the sister bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'sister');

-- Policy to allow anyone to list files in the sister bucket  
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('sister', 'sister', true, 52428800, ARRAY['video/mp4', 'video/webm', 'video/quicktime'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime'];