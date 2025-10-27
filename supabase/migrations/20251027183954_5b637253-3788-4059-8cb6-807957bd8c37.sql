-- Create visitor analytics table
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  ip_hash TEXT,
  country TEXT,
  country_name TEXT,
  region TEXT,
  city TEXT,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_end TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visited_at ON public.visitor_analytics(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_country ON public.visitor_analytics(country);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_session ON public.visitor_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_page ON public.visitor_analytics(page_path);

-- Enable Row Level Security
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can insert visitor analytics"
  ON public.visitor_analytics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all visitor analytics"
  ON public.visitor_analytics
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can update visitor analytics"
  ON public.visitor_analytics
  FOR UPDATE
  USING (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_visitor_analytics_updated_at
  BEFORE UPDATE ON public.visitor_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to delete old visitor analytics (older than 90 days)
CREATE OR REPLACE FUNCTION public.delete_old_visitor_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.visitor_analytics 
  WHERE visited_at < NOW() - INTERVAL '90 days';
END;
$$;