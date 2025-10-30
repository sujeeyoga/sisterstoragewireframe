-- Add closed_at column to abandoned_carts table for dismissing/closing carts
ALTER TABLE public.abandoned_carts 
ADD COLUMN closed_at timestamp with time zone DEFAULT NULL;

-- Add index for better query performance when filtering by closed status
CREATE INDEX idx_abandoned_carts_closed_at ON public.abandoned_carts(closed_at);

COMMENT ON COLUMN public.abandoned_carts.closed_at IS 'Timestamp when admin closed/dismissed this abandoned cart';