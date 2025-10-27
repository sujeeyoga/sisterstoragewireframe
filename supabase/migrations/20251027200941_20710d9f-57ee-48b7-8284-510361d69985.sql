-- Fix function search path security issue
CREATE OR REPLACE FUNCTION sync_order_fulfillment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- When order status is set to 'completed', ensure fulfillment_status is 'fulfilled'
  IF NEW.status = 'completed' AND NEW.fulfillment_status != 'fulfilled' THEN
    NEW.fulfillment_status := 'fulfilled';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;