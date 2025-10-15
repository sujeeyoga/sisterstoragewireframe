-- Insert site_texts for all pages
INSERT INTO site_texts (section_key, title, subtitle, description, button_text, enabled)
VALUES 
  -- Our Story Page
  ('our_story_hero', 'Our Story & Customer Love', NULL, 'Built by sisters, for sisters. We set out to solve a simple problem: beautifully organizing what matters to us—without the clutter.', NULL, true),
  ('our_story_beginning', 'The Beginning', NULL, 'It started with a simple frustration. We had beautiful bangles—gifts from family, pieces we''d collected over the years, jewelry that told our stories. But we had nowhere to properly store them.', NULL, true),
  ('our_story_solution', 'The Solution', NULL, 'From kitchen tables to studios, we designed, tested, and refined each detail so it fits our culture and our homes. This is more than storage—it''s a way to keep our stories visible, cared for, and ready for every day.', NULL, true),
  ('our_story_testimonials', 'What Our Sisters Are Saying', NULL, 'Don''t just take our word for it—hear from our community of organized enthusiasts', NULL, true),
  ('our_story_cta', 'Join Our Story', NULL, 'Become part of our community of sisters who organize with love, intention, and cultural pride.', 'Shop Our Collection', true),
  
  -- Contact Page
  ('contact_hero', 'Contact Our Sister Team', NULL, 'We''re here to help with any questions about our products, orders, or organization tips. Reach out to our sisterhood of support specialists.', NULL, true),
  ('contact_phone', 'Phone Support', '1-800-SISTERS', 'Monday-Friday: 8AM-8PM EST\nSaturday: 9AM-6PM EST\nSunday: 10AM-4PM EST', NULL, true),
  ('contact_location', 'Sister Storage Headquarters', NULL, '123 Organization Avenue\nCulture District\nNew York, NY 10001', NULL, true),
  
  -- Gift Page
  ('gift_hero', 'Give the Gift of Organization', NULL, 'Share the beauty of organized living with thoughtfully curated gift sets that celebrate culture and style.', 'Shop Gift Sets', true),
  ('gift_collections', 'Curated Gift Collections', NULL, 'Each gift set is thoughtfully assembled to bring joy, organization, and cultural celebration to your loved ones.', NULL, true),
  ('gift_features_title', 'Why Choose Sister Storage Gifts?', NULL, NULL, NULL, true),
  ('gift_cta', 'Ready to Give the Perfect Gift?', NULL, 'Can''t decide? Our gift cards let your loved ones choose exactly what speaks to them.', 'Shop All Gifts', true),
  
  -- Open Box Page
  ('openbox_hero', 'Open Box Deals', NULL, 'Quality products at unbeatable prices. Limited quantities available - these deals won''t last long!', NULL, true)
  
ON CONFLICT (section_key) DO UPDATE 
SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  button_text = EXCLUDED.button_text,
  enabled = EXCLUDED.enabled;