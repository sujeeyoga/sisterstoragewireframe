-- First, clear existing shipping zones to start fresh
DELETE FROM shipping_zone_rates;
DELETE FROM shipping_zone_rules;
DELETE FROM shipping_zones;

-- Create Toronto/GTA shipping zone (Priority 1 - most specific)
INSERT INTO shipping_zones (id, name, description, priority, enabled) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Toronto & GTA', 'Toronto and Greater Toronto Area', 1, true);

-- Add Toronto postal code rules (M prefix)
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'postal_code_pattern', 'M*');

-- Add shipping rate for Toronto/GTA: $4.99 flat rate, FREE over $50
INSERT INTO shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, free_threshold, enabled, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Toronto/GTA Delivery', 'flat_rate', 4.99, 50.00, true, 0);

-- Create Canada-wide shipping zone (Priority 2 - broader)
INSERT INTO shipping_zones (id, name, description, priority, enabled) 
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Canada Wide', 'All Canadian provinces and territories', 2, true);

-- Add all Canadian province/territory rules
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'province', 'ON'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'QC'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'BC'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'AB'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'MB'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'SK'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'NS'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'NB'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'NL'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'PE'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'NT'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'YT'),
  ('22222222-2222-2222-2222-222222222222', 'province', 'NU');

-- Add Canada-wide shipping rate: $15 flat
INSERT INTO shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, enabled, display_order)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'Canada Wide Shipping', 'flat_rate', 15.00, true, 0);

-- Update fallback settings
INSERT INTO shipping_fallback_settings (id, fallback_method_name, fallback_rate, enabled)
VALUES ('99999999-9999-9999-9999-999999999999', 'Standard Shipping', 15.00, true)
ON CONFLICT (id) DO UPDATE SET
  fallback_method_name = 'Standard Shipping',
  fallback_rate = 15.00,
  enabled = true,
  updated_at = now();

-- Add archived_at column to orders tables for archiving functionality
ALTER TABLE orders ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE woocommerce_orders ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;