-- Add weight and dimensions columns to woocommerce_products for ChitChats shipping
ALTER TABLE woocommerce_products 
ADD COLUMN IF NOT EXISTS weight numeric DEFAULT NULL,  -- in grams
ADD COLUMN IF NOT EXISTS length numeric DEFAULT NULL,  -- in cm
ADD COLUMN IF NOT EXISTS width numeric DEFAULT NULL,   -- in cm
ADD COLUMN IF NOT EXISTS height numeric DEFAULT NULL,  -- in cm
ADD COLUMN IF NOT EXISTS package_value numeric DEFAULT NULL;  -- for customs

COMMENT ON COLUMN woocommerce_products.weight IS 'Product weight in grams';
COMMENT ON COLUMN woocommerce_products.length IS 'Product length in centimeters';
COMMENT ON COLUMN woocommerce_products.width IS 'Product width in centimeters';
COMMENT ON COLUMN woocommerce_products.height IS 'Product height in centimeters';
COMMENT ON COLUMN woocommerce_products.package_value IS 'Declared value for customs (USD)';