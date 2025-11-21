-- Phase 1: Create automatic tracking notification system

-- Create function to send tracking notifications via HTTP
CREATE OR REPLACE FUNCTION send_tracking_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  order_data jsonb;
  request_id bigint;
  shipping_addr jsonb;
  line_items jsonb;
BEGIN
  -- Only proceed if tracking was just added and order is fulfilled without notification sent
  IF OLD.tracking_number IS NULL 
     AND NEW.tracking_number IS NOT NULL 
     AND NEW.fulfillment_status = 'fulfilled'
     AND NEW.shipping_notification_sent_at IS NULL THEN
    
    -- Build order data based on table type
    IF TG_TABLE_NAME = 'orders' THEN
      shipping_addr := NEW.shipping_address;
      line_items := NEW.items;
      
      order_data := jsonb_build_object(
        'orderId', NEW.id,
        'orderNumber', NEW.order_number,
        'customerEmail', NEW.customer_email,
        'customerName', NEW.customer_name,
        'trackingNumber', NEW.tracking_number,
        'carrierName', COALESCE(NEW.carrier_name, 'Carrier'),
        'shippingAddress', shipping_addr,
        'items', line_items,
        'source', 'stripe'
      );
    ELSE -- woocommerce_orders
      shipping_addr := NEW.shipping;
      line_items := NEW.line_items;
      
      order_data := jsonb_build_object(
        'orderId', NEW.id,
        'orderNumber', NEW.id::text,
        'customerEmail', (NEW.billing->>'email'),
        'customerName', (NEW.billing->>'first_name') || ' ' || (NEW.billing->>'last_name'),
        'trackingNumber', NEW.tracking_number,
        'carrierName', COALESCE(NEW.carrier_name, 'Carrier'),
        'shippingAddress', shipping_addr,
        'items', line_items,
        'source', 'woocommerce'
      );
    END IF;

    -- Send HTTP request to edge function using pg_net
    SELECT INTO request_id net.http_post(
      url := 'https://attczdhexkpxpyqyasgz.supabase.co/functions/v1/send-shipping-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := order_data
    );

    -- Log the request (fire and forget, don't block on failure)
    RAISE NOTICE 'Tracking notification queued for order %, request_id: %', 
      COALESCE(NEW.order_number, NEW.id::text), request_id;
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the order update
    RAISE WARNING 'Failed to queue tracking notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for orders table
DROP TRIGGER IF EXISTS auto_send_tracking_notification_orders ON orders;
CREATE TRIGGER auto_send_tracking_notification_orders
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (
    OLD.tracking_number IS NULL 
    AND NEW.tracking_number IS NOT NULL
    AND NEW.fulfillment_status = 'fulfilled'
    AND NEW.shipping_notification_sent_at IS NULL
  )
  EXECUTE FUNCTION send_tracking_notification();

-- Create trigger for woocommerce_orders table
DROP TRIGGER IF EXISTS auto_send_tracking_notification_woocommerce ON woocommerce_orders;
CREATE TRIGGER auto_send_tracking_notification_woocommerce
  AFTER UPDATE ON woocommerce_orders
  FOR EACH ROW
  WHEN (
    OLD.tracking_number IS NULL 
    AND NEW.tracking_number IS NOT NULL
    AND NEW.fulfillment_status = 'fulfilled'
    AND NEW.shipping_notification_sent_at IS NULL
  )
  EXECUTE FUNCTION send_tracking_notification();

COMMENT ON FUNCTION send_tracking_notification() IS 'Automatically sends tracking notification emails when tracking number is added to fulfilled orders';
COMMENT ON TRIGGER auto_send_tracking_notification_orders ON orders IS 'Triggers automatic tracking email when tracking number is added';
COMMENT ON TRIGGER auto_send_tracking_notification_woocommerce ON woocommerce_orders IS 'Triggers automatic tracking email when tracking number is added';