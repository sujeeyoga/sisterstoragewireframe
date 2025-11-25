UPDATE store_settings 
SET setting_value = jsonb_set(setting_value, '{name}', '"Bangle Box Sale"'),
    updated_at = now() 
WHERE setting_key = 'store_wide_discount';