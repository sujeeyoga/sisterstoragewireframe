UPDATE store_settings 
SET enabled = true, updated_at = now() 
WHERE setting_key = 'store_wide_discount';