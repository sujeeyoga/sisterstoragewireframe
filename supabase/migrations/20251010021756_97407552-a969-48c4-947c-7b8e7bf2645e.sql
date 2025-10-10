-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true);

-- Create uploaded_videos table
CREATE TABLE public.uploaded_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  duration NUMERIC,
  width INTEGER,
  height INTEGER,
  folder_path TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on uploaded_videos
ALTER TABLE public.uploaded_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for uploaded_videos
CREATE POLICY "Videos metadata is publicly viewable"
  ON public.uploaded_videos
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert uploaded videos metadata"
  ON public.uploaded_videos
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update uploaded videos metadata"
  ON public.uploaded_videos
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete uploaded videos metadata"
  ON public.uploaded_videos
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Storage policies for videos bucket
CREATE POLICY "Videos are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'videos');

CREATE POLICY "Admins can upload videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'videos' 
    AND has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update videos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'videos' 
    AND has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete videos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'videos' 
    AND has_role(auth.uid(), 'admin')
  );

-- Trigger for updated_at
CREATE TRIGGER update_uploaded_videos_updated_at
  BEFORE UPDATE ON public.uploaded_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();