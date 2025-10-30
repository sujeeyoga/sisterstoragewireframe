-- Remove the overly broad L* postal pattern that's catching Hamilton addresses
DELETE FROM shipping_zone_rules 
WHERE zone_id = 'aa000000-0000-0000-0000-000000000001' 
  AND rule_type = 'postal_code_pattern' 
  AND rule_value = 'L*';

-- Add specific GTA postal code patterns (excluding L8* which is Hamilton)
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT 
  'aa000000-0000-0000-0000-000000000001',
  'postal_code_pattern',
  unnest(ARRAY[
    'L3*',  -- York Region (Richmond Hill, Markham, Vaughan)
    'L4*',  -- Northern York Region (Newmarket, Aurora)
    'L5*',  -- Mississauga, Brampton
    'L6*',  -- Brampton, Milton
    'L7*',  -- Burlington, Oakville, Milton (western GTA)
    'L9*'   -- Caledon and outer areas
  ])
WHERE NOT EXISTS (
  SELECT 1 FROM shipping_zone_rules 
  WHERE zone_id = 'aa000000-0000-0000-0000-000000000001' 
  AND rule_type = 'postal_code_pattern'
  AND rule_value IN ('L3*', 'L4*', 'L5*', 'L6*', 'L7*', 'L9*')
);