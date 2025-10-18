-- Add stallion_shipment_id column to woocommerce_orders table
ALTER TABLE woocommerce_orders
ADD COLUMN IF NOT EXISTS stallion_shipment_id TEXT;