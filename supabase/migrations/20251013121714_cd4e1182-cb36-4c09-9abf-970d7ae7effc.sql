-- Hide the second open box product (OPEN BOX ITEM - Large Bangle Box)
UPDATE woocommerce_products 
SET visible = false, updated_at = now()
WHERE id = 25814132;