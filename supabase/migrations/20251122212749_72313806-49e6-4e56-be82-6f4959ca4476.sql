-- Enable 20% store-wide discount and update messaging
UPDATE store_settings 
SET 
  enabled = true,
  setting_value = jsonb_set(
    setting_value,
    '{name}',
    '"Bangle Box Sale - 20% Off Everything!"'
  ),
  updated_at = NOW()
WHERE setting_key = 'store_wide_discount';

-- Verify the discount is now enabled
SELECT setting_key, enabled, setting_value 
FROM store_settings 
WHERE setting_key = 'store_wide_discount';