-- Add chitchats_shipment_id column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS chitchats_shipment_id TEXT;

-- Add chitchats_shipment_id column to woocommerce_orders table
ALTER TABLE public.woocommerce_orders ADD COLUMN IF NOT EXISTS chitchats_shipment_id TEXT;

-- Add indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_orders_chitchats_shipment_id ON public.orders(chitchats_shipment_id);
CREATE INDEX IF NOT EXISTS idx_woocommerce_orders_chitchats_shipment_id ON public.woocommerce_orders(chitchats_shipment_id);