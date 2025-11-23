-- Add show_sale_pricing setting to store_settings
INSERT INTO public.store_settings (setting_key, enabled, setting_value)
VALUES ('show_sale_pricing', true, '{}')
ON CONFLICT (setting_key) DO NOTHING;