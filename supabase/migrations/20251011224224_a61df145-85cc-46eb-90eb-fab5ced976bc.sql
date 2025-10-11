-- Add shipping notification tracking to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_notification_sent_at TIMESTAMPTZ;

-- Create index for queries
CREATE INDEX IF NOT EXISTS idx_orders_shipping_notification 
ON public.orders(shipping_notification_sent_at);

-- Add comment
COMMENT ON COLUMN public.orders.shipping_notification_sent_at IS 'Timestamp when shipping notification email was sent to customer';