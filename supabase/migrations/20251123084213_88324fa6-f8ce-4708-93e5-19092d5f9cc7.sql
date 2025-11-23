-- Disable store-wide discount
UPDATE store_settings 
SET enabled = false 
WHERE setting_key = 'store_wide_discount';