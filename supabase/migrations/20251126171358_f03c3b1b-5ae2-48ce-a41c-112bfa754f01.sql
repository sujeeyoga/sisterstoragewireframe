-- Create flash_sales table
CREATE TABLE public.flash_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount', 'bogo')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  
  -- Targeting
  applies_to TEXT NOT NULL DEFAULT 'all' CHECK (applies_to IN ('all', 'products', 'categories')),
  product_ids BIGINT[],
  category_slugs TEXT[],
  
  -- Scheduling
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Status
  enabled BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  
  -- Validation: end must be after start
  CONSTRAINT valid_date_range CHECK (ends_at > starts_at)
);

-- Enable RLS
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage flash sales"
ON public.flash_sales
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view active flash sales"
ON public.flash_sales
FOR SELECT
USING (
  enabled = true 
  AND starts_at <= now() 
  AND ends_at >= now()
  OR public.has_role(auth.uid(), 'admin')
);

-- Create index for efficient queries
CREATE INDEX idx_flash_sales_active ON public.flash_sales(enabled, starts_at, ends_at) WHERE enabled = true;
CREATE INDEX idx_flash_sales_dates ON public.flash_sales(starts_at, ends_at);

-- Trigger to update updated_at
CREATE TRIGGER update_flash_sales_updated_at
BEFORE UPDATE ON public.flash_sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();