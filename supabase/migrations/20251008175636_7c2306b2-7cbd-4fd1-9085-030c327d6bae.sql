-- Add visible column to woocommerce_products
ALTER TABLE public.woocommerce_products 
ADD COLUMN visible BOOLEAN NOT NULL DEFAULT true;

-- Add index for visibility filtering
CREATE INDEX idx_woocommerce_products_visible ON public.woocommerce_products(visible);