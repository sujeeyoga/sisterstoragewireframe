-- Add shipping_metadata column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_metadata jsonb DEFAULT '{}'::jsonb;

-- Add shipping_metadata column to woocommerce_orders table
ALTER TABLE public.woocommerce_orders 
ADD COLUMN IF NOT EXISTS shipping_metadata jsonb DEFAULT '{}'::jsonb;

-- Add comment explaining the shipping_metadata structure
COMMENT ON COLUMN public.orders.shipping_metadata IS 'Stores shipping calculation details: zone_name, zone_description, matched_rule, rate_method, is_free, free_threshold, original_rate, applied_rate, reason, source';
COMMENT ON COLUMN public.woocommerce_orders.shipping_metadata IS 'Stores shipping calculation details: zone_name, zone_description, matched_rule, rate_method, is_free, free_threshold, original_rate, applied_rate, reason, source';