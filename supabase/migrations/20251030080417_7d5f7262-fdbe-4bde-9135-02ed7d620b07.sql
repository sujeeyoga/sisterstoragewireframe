-- Add stallion_cost column to orders table to track actual shipping costs paid to Stallion
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS stallion_cost numeric DEFAULT NULL;

-- Add stallion_cost column to woocommerce_orders table
ALTER TABLE public.woocommerce_orders
ADD COLUMN IF NOT EXISTS stallion_cost numeric DEFAULT NULL;

COMMENT ON COLUMN public.orders.stallion_cost IS 'Actual cost paid to Stallion Express for shipping (in USD)';
COMMENT ON COLUMN public.woocommerce_orders.stallion_cost IS 'Actual cost paid to Stallion Express for shipping (in USD)';