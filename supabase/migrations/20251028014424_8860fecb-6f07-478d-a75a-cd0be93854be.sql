-- Create function to automatically set fulfilled_at timestamp
CREATE OR REPLACE FUNCTION public.auto_set_fulfilled_at()
RETURNS TRIGGER AS $$
BEGIN
  -- When fulfillment_status changes to 'fulfilled', automatically set fulfilled_at
  IF NEW.fulfillment_status = 'fulfilled' AND OLD.fulfillment_status != 'fulfilled' THEN
    NEW.fulfilled_at := NOW();
  END IF;
  
  -- When fulfillment_status changes from 'fulfilled' to something else, clear fulfilled_at
  IF NEW.fulfillment_status != 'fulfilled' AND OLD.fulfillment_status = 'fulfilled' THEN
    NEW.fulfilled_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for orders table
DROP TRIGGER IF EXISTS trigger_auto_set_fulfilled_at ON public.orders;
CREATE TRIGGER trigger_auto_set_fulfilled_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_set_fulfilled_at();

-- Create trigger for woocommerce_orders table (if it doesn't exist)
DROP TRIGGER IF EXISTS trigger_auto_set_fulfilled_at_woo ON public.woocommerce_orders;
CREATE TRIGGER trigger_auto_set_fulfilled_at_woo
  BEFORE UPDATE ON public.woocommerce_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_set_fulfilled_at();

-- Create function to validate order status transitions
CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent changing from completed/cancelled to pending
  IF OLD.status IN ('completed', 'cancelled') AND NEW.status = 'pending' THEN
    RAISE EXCEPTION 'Cannot change order status from % to pending', OLD.status;
  END IF;
  
  -- Prevent changing from completed to processing
  IF OLD.status = 'completed' AND NEW.status = 'processing' THEN
    RAISE EXCEPTION 'Cannot change completed order back to processing';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for order status validation
DROP TRIGGER IF EXISTS trigger_validate_order_status ON public.orders;
CREATE TRIGGER trigger_validate_order_status
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.validate_order_status_transition();

-- Create helper function to get duplicate order numbers (for integrity checks)
CREATE OR REPLACE FUNCTION public.get_duplicate_order_numbers()
RETURNS TABLE (
  order_number text,
  count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.order_number, COUNT(*)::bigint as count
  FROM public.orders o
  GROUP BY o.order_number
  HAVING COUNT(*) > 1
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;