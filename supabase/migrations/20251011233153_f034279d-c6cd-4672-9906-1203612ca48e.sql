-- Add fulfillment_status to woocommerce_orders table
ALTER TABLE woocommerce_orders 
ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled';

-- Add refund_amount to orders table (Stripe orders)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0;

-- Add refund_amount to woocommerce_orders table
ALTER TABLE woocommerce_orders 
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0;

-- Add shipping tracking fields to woocommerce_orders
ALTER TABLE woocommerce_orders 
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipping_label_url TEXT,
ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipping_notification_sent_at TIMESTAMP WITH TIME ZONE;

-- Insert default currency setting if it doesn't exist
INSERT INTO store_settings (setting_key, setting_value, enabled)
VALUES ('default_currency', '{"currency": "CAD", "symbol": "$"}'::jsonb, true)
ON CONFLICT (setting_key) DO NOTHING;