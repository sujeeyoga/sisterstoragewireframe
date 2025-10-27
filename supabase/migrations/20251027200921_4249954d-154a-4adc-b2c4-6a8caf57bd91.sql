-- Fix status inconsistency: Update all completed orders to have fulfilled status
UPDATE orders 
SET fulfillment_status = 'fulfilled', 
    updated_at = now()
WHERE status = 'completed' 
  AND fulfillment_status != 'fulfilled';

-- Add a database function to automatically sync fulfillment_status when order is completed
CREATE OR REPLACE FUNCTION sync_order_fulfillment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When order status is set to 'completed', ensure fulfillment_status is 'fulfilled'
  IF NEW.status = 'completed' AND NEW.fulfillment_status != 'fulfilled' THEN
    NEW.fulfillment_status := 'fulfilled';
  END IF;
  
  -- When order status is set to 'refunded', we don't change fulfillment_status
  -- as the order may have been fulfilled before being refunded
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically sync statuses
DROP TRIGGER IF EXISTS sync_fulfillment_on_completion ON orders;
CREATE TRIGGER sync_fulfillment_on_completion
  BEFORE UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND NEW.fulfillment_status != 'fulfilled')
  EXECUTE FUNCTION sync_order_fulfillment_status();