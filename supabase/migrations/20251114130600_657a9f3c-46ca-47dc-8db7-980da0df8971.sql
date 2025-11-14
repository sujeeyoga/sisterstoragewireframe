-- Add carrier tracking fields to orders table
ALTER TABLE public.orders
ADD COLUMN carrier_name TEXT,
ADD COLUMN carrier_cost_currency TEXT DEFAULT 'CAD';

-- Add carrier tracking fields to woocommerce_orders table
ALTER TABLE public.woocommerce_orders
ADD COLUMN carrier_name TEXT,
ADD COLUMN carrier_cost_currency TEXT DEFAULT 'CAD';

-- Add comments for documentation
COMMENT ON COLUMN public.orders.carrier_name IS 'Name of shipping carrier used (e.g., Stallion Express, ChitChats)';
COMMENT ON COLUMN public.orders.carrier_cost_currency IS 'Currency of the carrier cost (CAD, USD, etc.)';
COMMENT ON COLUMN public.woocommerce_orders.carrier_name IS 'Name of shipping carrier used (e.g., Stallion Express, ChitChats)';
COMMENT ON COLUMN public.woocommerce_orders.carrier_cost_currency IS 'Currency of the carrier cost (CAD, USD, etc.)';