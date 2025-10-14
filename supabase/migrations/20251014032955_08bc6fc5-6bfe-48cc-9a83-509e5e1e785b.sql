-- Insert shop section texts
INSERT INTO site_texts (section_key, title, subtitle, enabled) 
VALUES 
  ('shop_bundles', 'Top-Selling Bundles', 'Complete collections for every Sister', true),
  ('shop_boxes', 'Individual Boxes', 'Build your own perfect collection', true),
  ('shop_pouches', 'Jewelry Pouches', 'Soft protection, travel-ready', true)
ON CONFLICT (section_key) DO NOTHING;