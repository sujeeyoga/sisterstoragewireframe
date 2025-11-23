-- Set individual sale prices for bangle boxes (20% off sale)

-- Large Bangle Boxes: Regular $30, Sale $24
UPDATE woocommerce_products 
SET regular_price = 30.00, sale_price = 24.00, price = 24.00 
WHERE id IN (25814004, 5796, 25814777);

-- Medium Bangle Boxes: Regular $25, Sale $20
UPDATE woocommerce_products 
SET regular_price = 25.00, sale_price = 20.00, price = 20.00 
WHERE id IN (25814005, 8536, 25813968);

-- Travel Bangle Boxes: Regular $15, Sale $12
UPDATE woocommerce_products 
SET regular_price = 15.00, sale_price = 12.00, price = 12.00 
WHERE id IN (25814006, 25813973, 8542);