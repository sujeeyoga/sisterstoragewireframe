-- Add default fulfillment address setting if it doesn't exist
INSERT INTO public.store_settings (setting_key, setting_value, enabled)
VALUES (
  'fulfillment_address',
  '{
    "name": "",
    "address": "",
    "city": "",
    "province": "",
    "postal_code": "",
    "country": "CA",
    "phone": ""
  }'::jsonb,
  false
)
ON CONFLICT (setting_key) DO NOTHING;