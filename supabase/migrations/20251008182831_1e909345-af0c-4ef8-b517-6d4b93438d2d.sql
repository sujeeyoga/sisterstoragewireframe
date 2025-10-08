-- Insert shop page products into woocommerce_products table

-- Bundle 3: Full Luxe Collection
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814001, 
  'Full Luxe Collection',
  'bundle-3',
  174.00,
  240.00,
  'BIG. BUNDLE. LOVE. The ultimate set for you and yours.',
  '4 Large Boxes, 2 Medium Boxes, 2 Small Boxes',
  10,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/c80056-placeholder.png"}]'::jsonb,
  '[{"slug": "bundles"}, {"slug": "high-value-bundles"}]'::jsonb,
  '{"bundleContents": "4 Large Boxes, 2 Medium Boxes, 2 Small Boxes"}'::jsonb,
  '{"bestSeller": true, "sku": "bundle3", "caption": "The ultimate set for you and yours."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  updated_at = now();

-- Bundle 2: Home & Away Set
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814002,
  'Home & Away Set',
  'bundle-2',
  137.00,
  137.00,
  'SMART. SET. READY. Your smart set for every special occasion.',
  '3 Large Boxes, 2 Medium Boxes, 1 Small Box',
  15,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/e90064-placeholder.png"}]'::jsonb,
  '[{"slug": "bundles"}, {"slug": "high-value-bundles"}]'::jsonb,
  '{"bundleContents": "3 Large Boxes, 2 Medium Boxes, 1 Small Box"}'::jsonb,
  '{"sku": "bundle2", "caption": "Your smart set for every special occasion."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  updated_at = now();

-- Bundle 1: Everyday Starter
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814003,
  'Everyday Starter',
  'bundle-1',
  90.00,
  90.00,
  'START. SAFE. STYLE. Your first set, ready for everything.',
  '2 Large Boxes, 1 Medium Box, 1 Small Box',
  20,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/ff4d8d-placeholder.png"}]'::jsonb,
  '[{"slug": "bundles"}, {"slug": "entry-bundles"}]'::jsonb,
  '{"bundleContents": "2 Large Boxes, 1 Medium Box, 1 Small Box"}'::jsonb,
  '{"sku": "bundle1", "caption": "Your first set, ready for everything."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  updated_at = now();

-- Large Bangle Box
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814004,
  'Large Bangle Box',
  'large-bangle-box',
  30.00,
  30.00,
  'STACK. PROTECT. CHERISH. Keep every bangle safe, stylish, secure.',
  'Large capacity bangle box with 4 rods',
  35,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/e90064-placeholder.png"}]'::jsonb,
  '[{"slug": "bangle-boxes"}, {"slug": "large-4-rods"}]'::jsonb,
  '{"size": ["Large"], "rodCount": ["4"]}'::jsonb,
  '{"bestSeller": true, "sku": "large-1-1", "caption": "Keep every bangle safe, stylish, secure."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  updated_at = now();

-- Medium Bangle Box
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814005,
  'Medium Bangle Box',
  'medium-bangle-box',
  25.00,
  25.00,
  'MIDDLE. PERFECT. READY. Just the right size for your day.',
  'Medium bangle box with 2 rods',
  40,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/c80056-placeholder.png"}]'::jsonb,
  '[{"slug": "bangle-boxes"}, {"slug": "medium-2-rods"}]'::jsonb,
  '{"size": ["Medium"], "rodCount": ["2"]}'::jsonb,
  '{"sku": "medium", "caption": "Just the right size for your day."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  updated_at = now();

-- Small Travel Bangle Box
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814006,
  'Small Travel Bangle Box',
  'travel-size-bangle-box',
  15.00,
  15.00,
  'TRAVEL. LIGHT. BEAUTIFUL. Pack light, keep your beauty with you.',
  'Compact travel bangle box with 1 rod',
  45,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/ff4d8d-placeholder.png"}]'::jsonb,
  '[{"slug": "bangle-boxes"}, {"slug": "travel-1-rod"}]'::jsonb,
  '{"size": ["Small", "Travel"], "rodCount": ["1"]}'::jsonb,
  '{"sku": "travel", "caption": "Pack light, keep your beauty with you."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  updated_at = now();

-- Open Box Bangle Boxes
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, sale_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814007,
  'Open Box Bangle Boxes',
  'open-box-deals',
  8.00,
  15.00,
  8.00,
  'SAVE. SMART. BEAUTIFUL. Smart savings on quality boxes.',
  'Like-new condition boxes at reduced prices',
  12,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/ff6b35-placeholder.png"}]'::jsonb,
  '[{"slug": "open-box"}, {"slug": "open-box-deals"}]'::jsonb,
  '{}'::jsonb,
  '{"limitedEdition": true, "sku": "openbox-mix", "caption": "Smart savings on quality boxes."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  sale_price = EXCLUDED.sale_price,
  updated_at = now();

-- Jewelry Bag Organizer
INSERT INTO woocommerce_products (
  id, name, slug, price, regular_price, description, short_description,
  stock_quantity, manage_stock, in_stock, visible,
  images, categories, attributes, meta_data
) VALUES (
  25814008,
  'Jewelry Bag Organizer',
  'jewelry-bag-organizer',
  20.00,
  20.00,
  'HOLD. LOVE. KEEP. All your pieces, organized and loved.',
  'Jewelry organizer with 7 removable pouches',
  30,
  true,
  true,
  true,
  '[{"src": "/lovable-uploads/c80056-placeholder.png"}]'::jsonb,
  '[{"slug": "organizers"}, {"slug": "jewelry-bags-pouches"}]'::jsonb,
  '{}'::jsonb,
  '{"sku": "JEW-ORG-001", "caption": "All your pieces, organized and loved."}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  updated_at = now();