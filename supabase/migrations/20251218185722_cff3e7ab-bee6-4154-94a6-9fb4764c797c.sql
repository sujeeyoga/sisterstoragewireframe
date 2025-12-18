-- Add L1* postal code pattern for Ajax, Pickering, etc. to GTA zone
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT id, 'postal_code_pattern', 'L1*'
FROM shipping_zones 
WHERE name = 'Toronto & GTA';

-- Also add L2* (Burlington area) and L8* (Hamilton) which are also GTA-adjacent
INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT id, 'postal_code_pattern', 'L2*'
FROM shipping_zones 
WHERE name = 'Toronto & GTA';

INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT id, 'postal_code_pattern', 'L8*'
FROM shipping_zones 
WHERE name = 'Toronto & GTA';