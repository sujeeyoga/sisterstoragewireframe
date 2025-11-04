-- Create active_carts table for real-time cart tracking
CREATE TABLE IF NOT EXISTS public.active_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  visitor_id TEXT,
  email TEXT,
  cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.active_carts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert/update their own cart (we'll validate session_id on insert)
CREATE POLICY "Anyone can manage their own active cart"
ON public.active_carts
FOR ALL
USING (
  session_id IN (
    SELECT session_id 
    FROM visitor_analytics 
    WHERE created_at > now() - INTERVAL '24 hours'
  )
)
WITH CHECK (
  session_id IN (
    SELECT session_id 
    FROM visitor_analytics 
    WHERE created_at > now() - INTERVAL '24 hours'
  )
);

-- Policy: Admins can view all active carts
CREATE POLICY "Admins can view all active carts"
ON public.active_carts
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_active_carts_session_id ON public.active_carts(session_id);
CREATE INDEX idx_active_carts_last_updated ON public.active_carts(last_updated);
CREATE INDEX idx_active_carts_converted_at ON public.active_carts(converted_at);

-- Function to cleanup old active carts (older than 24 hours and not converted)
CREATE OR REPLACE FUNCTION public.cleanup_old_active_carts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.active_carts 
  WHERE last_updated < NOW() - INTERVAL '24 hours'
    AND converted_at IS NULL;
END;
$$;

-- Add updated_at trigger
CREATE TRIGGER update_active_carts_updated_at
BEFORE UPDATE ON public.active_carts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();