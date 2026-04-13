
INSERT INTO public.shop_sections (name, title, subtitle, display_order, visible, background_color, layout_columns, category_filter)
VALUES 
  ('hero', 'CULTURE / WITHOUT CLUTTER.', 'BROUGHT TO YOU BY SISTERS WHO GET IT.', -1, true, 'bg-[#E80065]', 1, NULL)
ON CONFLICT DO NOTHING;
