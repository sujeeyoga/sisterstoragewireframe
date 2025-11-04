-- Add Canada country rule to Toronto/GTA zone to prevent cross-border city name collisions
-- This ensures only Canadian Richmond Hill matches, not Richmond Hill, NY

INSERT INTO shipping_zone_rules (zone_id, rule_type, rule_value)
VALUES ('aa000000-0000-0000-0000-000000000001', 'country', 'CA')
ON CONFLICT DO NOTHING;