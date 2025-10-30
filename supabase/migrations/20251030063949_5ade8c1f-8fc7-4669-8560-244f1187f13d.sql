-- Create Toronto/GTA shipping zone
INSERT INTO public.shipping_zones (id, name, description, priority, enabled)
VALUES (
  'aa000000-0000-0000-0000-000000000001'::uuid,
  'Toronto/GTA',
  'Greater Toronto Area - Free shipping on orders over $50',
  500,
  true
);

-- Create shipping zone rules for all GTA cities
INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value) VALUES
-- Core Toronto
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Toronto'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Etobicoke'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'North York'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Scarborough'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'East York'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'York'),
-- Mississauga & Brampton
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Mississauga'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Brampton'),
-- Markham, Vaughan, Richmond Hill
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Markham'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Vaughan'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Richmond Hill'),
-- West GTA
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Oakville'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Burlington'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Milton'),
-- East GTA (Durham Region)
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Pickering'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Ajax'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Whitby'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Oshawa'),
-- North GTA
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Newmarket'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Aurora'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'King'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Caledon'),
('aa000000-0000-0000-0000-000000000001'::uuid, 'city', 'Georgina');

-- Create shipping rate with $50 free threshold
INSERT INTO public.shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, free_threshold, enabled, display_order)
VALUES (
  'aa000000-0000-0000-0000-000000000001'::uuid,
  'Standard Shipping',
  'free_threshold',
  9.99,
  50.00,
  true,
  1
);