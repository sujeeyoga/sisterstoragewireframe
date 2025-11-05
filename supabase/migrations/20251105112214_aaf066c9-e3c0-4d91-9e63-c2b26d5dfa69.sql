-- Update Bundle 1 (Starter Set) weight
UPDATE woocommerce_products 
SET weight = 1628.4, updated_at = NOW()
WHERE id = 8580;

-- Update Bundle 2 (Sister Staples) weight  
UPDATE woocommerce_products
SET weight = 2506.1, updated_at = NOW()
WHERE id = 8582;

-- Update Bundle 3 (Family Set) weight
UPDATE woocommerce_products
SET weight = 3256.8, updated_at = NOW()
WHERE id = 8584;