-- Create product_reviews table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit a review (will validate order in application)
CREATE POLICY "Anyone can submit reviews"
ON public.product_reviews
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Only approved reviews are publicly visible
CREATE POLICY "Approved reviews are publicly visible"
ON public.product_reviews
FOR SELECT
TO public
USING (status = 'approved' OR has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can update reviews
CREATE POLICY "Admins can update reviews"
ON public.product_reviews
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.product_reviews
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_product_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_status ON public.product_reviews(status);
CREATE INDEX idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_product_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_reviews_updated_at_trigger
BEFORE UPDATE ON public.product_reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_reviews_updated_at();

-- Add review settings to store_settings if not exists
INSERT INTO public.store_settings (setting_key, setting_value, enabled)
VALUES (
  'reviews',
  jsonb_build_object(
    'enabled', true,
    'requireApproval', true,
    'requireVerifiedPurchase', true,
    'allowAnonymous', false,
    'minRating', 1,
    'maxRating', 5,
    'adminEmailNotification', true
  ),
  true
)
ON CONFLICT (setting_key) DO NOTHING;