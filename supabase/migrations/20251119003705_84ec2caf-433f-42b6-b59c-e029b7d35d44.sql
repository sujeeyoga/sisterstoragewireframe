-- Update fallback shipping rate from $15 to $35
UPDATE shipping_fallback_settings
SET fallback_rate = 35.00,
    updated_at = now()
WHERE id = '99999999-9999-9999-9999-999999999999';