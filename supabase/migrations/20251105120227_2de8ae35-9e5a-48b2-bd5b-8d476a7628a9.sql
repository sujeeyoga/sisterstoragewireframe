-- Create SEO analytics table to track search engine performance
CREATE TABLE IF NOT EXISTS public.seo_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  meta_description TEXT,
  keywords TEXT[],
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr NUMERIC(5,2) DEFAULT 0,
  avg_position NUMERIC(5,2) DEFAULT 0,
  traffic_source TEXT,
  device_type TEXT,
  country TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_seo_analytics_page_path ON public.seo_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_seo_analytics_recorded_at ON public.seo_analytics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_analytics_keywords ON public.seo_analytics USING GIN(keywords);

-- Enable RLS
ALTER TABLE public.seo_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all SEO analytics"
  ON public.seo_analytics
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert SEO analytics"
  ON public.seo_analytics
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update SEO analytics"
  ON public.seo_analytics
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete SEO analytics"
  ON public.seo_analytics
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'));

-- Create keyword rankings table
CREATE TABLE IF NOT EXISTS public.keyword_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  page_path TEXT NOT NULL,
  position INTEGER NOT NULL,
  search_volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  tracked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_keyword ON public.keyword_rankings(keyword);
CREATE INDEX IF NOT EXISTS idx_keyword_rankings_tracked_at ON public.keyword_rankings(tracked_at DESC);

-- Enable RLS
ALTER TABLE public.keyword_rankings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage keyword rankings"
  ON public.keyword_rankings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create page performance table
CREATE TABLE IF NOT EXISTS public.page_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  load_time_ms INTEGER,
  first_contentful_paint_ms INTEGER,
  largest_contentful_paint_ms INTEGER,
  cumulative_layout_shift NUMERIC(5,3),
  time_to_interactive_ms INTEGER,
  seo_score INTEGER,
  accessibility_score INTEGER,
  performance_score INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_performance_page_path ON public.page_performance(page_path);
CREATE INDEX IF NOT EXISTS idx_page_performance_recorded_at ON public.page_performance(recorded_at DESC);

-- Enable RLS
ALTER TABLE public.page_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage page performance"
  ON public.page_performance
  FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create trigger to update updated_at
CREATE TRIGGER update_seo_analytics_updated_at
  BEFORE UPDATE ON public.seo_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();