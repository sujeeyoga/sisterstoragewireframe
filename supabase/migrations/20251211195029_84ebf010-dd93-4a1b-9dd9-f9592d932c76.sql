-- Add L* postal patterns to the main Toronto & GTA zone for complete GTA coverage
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'postal_code_pattern', 'L3*'),
  ('11111111-1111-1111-1111-111111111111', 'postal_code_pattern', 'L4*'),
  ('11111111-1111-1111-1111-111111111111', 'postal_code_pattern', 'L5*'),
  ('11111111-1111-1111-1111-111111111111', 'postal_code_pattern', 'L6*'),
  ('11111111-1111-1111-1111-111111111111', 'postal_code_pattern', 'L7*'),
  ('11111111-1111-1111-1111-111111111111', 'postal_code_pattern', 'L9*');

-- Delete the duplicate Toronto/GTA zone's rates first (foreign key constraint)
DELETE FROM shipping_zone_rates WHERE zone_id = 'aa000000-0000-0000-0000-000000000001';

-- Delete the duplicate Toronto/GTA zone's rules
DELETE FROM shipping_zone_rules WHERE zone_id = 'aa000000-0000-0000-0000-000000000001';

-- Delete the duplicate Toronto/GTA zone itself
DELETE FROM shipping_zones WHERE id = 'aa000000-0000-0000-0000-000000000001';