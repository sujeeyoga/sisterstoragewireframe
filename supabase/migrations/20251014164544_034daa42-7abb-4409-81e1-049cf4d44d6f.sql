-- Update Multipurpose Box category from Uncategorized to Organizers
UPDATE woocommerce_products 
SET categories = '[{"id": 20, "name": "Organizers", "slug": "organizers"}]'::jsonb
WHERE id = 25814133;