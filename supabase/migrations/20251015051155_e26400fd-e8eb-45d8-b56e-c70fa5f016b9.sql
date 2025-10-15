-- Insert site_texts for homepage hero
INSERT INTO site_texts (section_key, title, subtitle, description, button_text, enabled)
VALUES 
  ('homepage_hero', 'CULTURE / WITHOUT CLUTTER.', 'BROUGHT TO YOU BY SISTERS WHO GET IT.', 'Made by sisters, for sisters. Clutter never had a place in our culture.', 'SHOP THE DROP', true),
  ('promotional_banner', 'YOUR JEWELS DESERVE BETTER SIS.', NULL, 'Stop letting your precious jewelry tangle in drawers. Our thoughtfully designed storage solutions keep everything organized, protected, and easy to find.', 'SHOP', true),
  ('footer_brand', 'SISTER STORAGE', NULL, 'Culture without clutter. Storage designed for us, by us – bringing organization and elegance to your cultural treasures.', NULL, true),
  ('footer_newsletter', 'Stay Organized. Stay Inspired.', NULL, 'Join our list for exclusive drops, inspiration, and promotions made for our sisters.', 'Sign Up', true),
  ('footer_copyright', NULL, NULL, 'Culture without clutter since 2020.', NULL, true)
ON CONFLICT (section_key) DO UPDATE 
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  button_text = EXCLUDED.button_text,
  enabled = EXCLUDED.enabled;