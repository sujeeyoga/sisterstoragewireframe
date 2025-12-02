import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const STALLION_API_TOKEN = Deno.env.get('STALLION_EXPRESS_API_TOKEN');
const STALLION_BASE_URL = 'https://ship.stallionexpress.ca/api/v4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Stallion tracking sync...');

    if (!STALLION_API_TOKEN) {
      throw new Error('Stallion Express API token not configured');
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch orders with Stallion shipment IDs that need tracking updates
    const { data: stripeOrders, error: stripeError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, stallion_shipment_id, tracking_number, status, fulfillment_status, customer_email, customer_name, items, shipping_address, carrier_name, shipping_notification_sent_at')
      .not('stallion_shipment_id', 'is', null)
      .neq('status', 'delivered')
      .is('shipping_notification_sent_at', null);

    const { data: wooOrders, error: wooError } = await supabaseAdmin
      .from('woocommerce_orders')
      .select('id, stallion_shipment_id, tracking_number, status, fulfillment_status, billing, line_items, shipping, carrier_name, shipping_notification_sent_at')
      .not('stallion_shipment_id', 'is', null)
      .neq('status', 'delivered')
      .is('shipping_notification_sent_at', null);

    if (stripeError) console.error('Error fetching Stripe orders:', stripeError);
    if (wooError) console.error('Error fetching WooCommerce orders:', wooError);

    const allOrders = [
      ...(stripeOrders || []).map(o => ({ ...o, source: 'stripe' as const })),
      ...(wooOrders || []).map(o => ({ ...o, source: 'woocommerce' as const }))
    ];

    console.log(`Found ${allOrders.length} orders to check for tracking updates`);

    let updatedCount = 0;
    let notifiedCount = 0;
    let errorCount = 0;

    for (const order of allOrders) {
      try {
        // Fetch shipment details from Stallion
        const shipmentResponse = await fetch(
          `${STALLION_BASE_URL}/shipments/${order.stallion_shipment_id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${STALLION_API_TOKEN}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        if (!shipmentResponse.ok) {
          console.error(`Failed to get shipment ${order.stallion_shipment_id}: ${shipmentResponse.status}`);
          errorCount++;
          continue;
        }

        const shipmentData = await shipmentResponse.json();
        console.log(`Shipment data for order ${order.id}:`, JSON.stringify(shipmentData).substring(0, 500));

        // Extract tracking number from Stallion response
        const stallionTrackingNumber = shipmentData.data?.tracking_number || 
                                       shipmentData.tracking_number ||
                                       shipmentData.data?.carrier_tracking_number;
        
        const shipmentStatus = shipmentData.data?.status || shipmentData.status;
        const isInTransit = shipmentStatus === 'In Transit' || 
                           shipmentStatus === 'in_transit' ||
                           shipmentStatus === 'shipped' ||
                           shipmentStatus === 'Shipped';

        // Update tracking number if we got one from Stallion and order doesn't have it
        const tableName = order.source === 'stripe' ? 'orders' : 'woocommerce_orders';
        const needsTrackingUpdate = stallionTrackingNumber && !order.tracking_number;
        
        if (needsTrackingUpdate) {
          const { error: updateError } = await supabaseAdmin
            .from(tableName)
            .update({ 
              tracking_number: stallionTrackingNumber,
              carrier_name: order.carrier_name || 'Stallion Express'
            })
            .eq('id', order.id);

          if (updateError) {
            console.error(`Failed to update tracking for order ${order.id}:`, updateError);
          } else {
            console.log(`Updated tracking number for order ${order.id}: ${stallionTrackingNumber}`);
            updatedCount++;
          }
        }

        // Send notification if in transit and has tracking number
        const trackingToUse = stallionTrackingNumber || order.tracking_number;
        
        if (isInTransit && trackingToUse && !order.shipping_notification_sent_at) {
          console.log(`Sending shipping notification for order ${order.id}`);
          
          // Prepare notification data based on order source
          let notificationData;
          
          if (order.source === 'stripe') {
            notificationData = {
              orderId: order.id,
              orderNumber: order.order_number,
              customerEmail: order.customer_email,
              customerName: order.customer_name,
              trackingNumber: trackingToUse,
              carrierName: order.carrier_name || 'Stallion Express',
              shippingAddress: order.shipping_address,
              items: order.items,
              source: 'stripe'
            };
          } else {
            const billing = order.billing as Record<string, string> | null;
            notificationData = {
              orderId: order.id,
              orderNumber: order.id.toString(),
              customerEmail: billing?.email,
              customerName: `${billing?.first_name || ''} ${billing?.last_name || ''}`.trim(),
              trackingNumber: trackingToUse,
              carrierName: order.carrier_name || 'Stallion Express',
              shippingAddress: order.shipping,
              items: order.line_items,
              source: 'woocommerce'
            };
          }

          // Invoke the send-shipping-notification function
          const { error: invokeError } = await supabaseAdmin.functions.invoke('send-shipping-notification', {
            body: notificationData
          });

          if (invokeError) {
            console.error(`Failed to send notification for order ${order.id}:`, invokeError);
          } else {
            console.log(`Shipping notification sent for order ${order.id}`);
            notifiedCount++;
            
            // Mark notification as sent
            await supabaseAdmin
              .from(tableName)
              .update({ shipping_notification_sent_at: new Date().toISOString() })
              .eq('id', order.id);
          }
        }
      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Sync complete. Updated: ${updatedCount}, Notified: ${notifiedCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        updated: updatedCount,
        notified: notifiedCount,
        errors: errorCount,
        total: allOrders.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in sync-stallion-tracking:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
