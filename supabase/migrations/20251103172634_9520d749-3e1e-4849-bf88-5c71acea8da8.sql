-- Simplify the Multipurpose Box description
UPDATE woocommerce_products
SET description = '<p>The ultimate solution for organizing jewelry, accessories, and small items. Features up to 24 adjustable compartments that you can customize to fit your collection perfectly.</p>',
    short_description = 'Versatile storage box with adjustable compartments for jewelry, accessories, and small items.',
    updated_at = now()
WHERE id = 25814133;