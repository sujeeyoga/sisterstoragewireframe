-- Create sister_stories table
CREATE TABLE public.sister_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_path TEXT NOT NULL,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sister_stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Sister stories are publicly viewable"
  ON public.sister_stories
  FOR SELECT
  USING (is_active = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert sister stories"
  ON public.sister_stories
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update sister stories"
  ON public.sister_stories
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete sister stories"
  ON public.sister_stories
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_sister_stories_updated_at
  BEFORE UPDATE ON public.sister_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for ordering
CREATE INDEX idx_sister_stories_display_order ON public.sister_stories(display_order, created_at);