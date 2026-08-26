import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { getTrackingUrl } from '../_shared/tracking-url.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const CHITCHATS_API_TOKEN = Deno.env.get('CHITCHATS_API_TOKEN');
    const CHITCHATS_CLIENT_ID = Deno.env.get('CHITCHATS_CLIENT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!CHITCHATS_API_TOKEN || !CHITCHATS_CLIENT_ID) {
      console.error('Missing ChitChats API credentials');
      return new Response(JSON.stringify({ error: 'ChitChats API not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch orders with chitchats_shipment_id that haven't sent shipping notification
    const { data: stripeOrders, error: stripeError } = await supabase
      .from('orders')
      .select('id, order_number, customer_email, customer_name, chitchats_shipment_id, tracking_number, shipping_notification_sent_at, items, shipping_address')
      .not('chitchats_shipment_id', 'is', null)
      .is('shipping_notification_sent_at', null)
      .eq('fulfillment_status', 'fulfilled');

    const { data: wooOrders, error: wooError } = await supabase
      .from('woocommerce_orders')
      .select('id, billing, shipping, chitchats_shipment_id, tracking_number, shipping_notification_sent_at, line_items')
      .not('chitchats_shipment_id', 'is', null)
      .is('shipping_notification_sent_at', null)
      .eq('fulfillment_status', 'fulfilled');

    if (stripeError) console.error('Error fetching Stripe orders:', stripeError);
    if (wooError) console.error('Error fetching WooCommerce orders:', wooError);

    const allOrders = [
      ...(stripeOrders || []).map(o => ({ ...o, source: 'stripe' as const })),
      ...(wooOrders || []).map(o => ({ ...o, source: 'woocommerce' as const })),
    ];

    console.log(`Found ${allOrders.length} orders with ChitChats shipments pending notification`);

    const results: any[] = [];

    for (const order of allOrders) {
      try {
        // Get shipment details from ChitChats
        const shipmentResponse = await fetch(
          `https://chitchats.com/api/v1/clients/${CHITCHATS_CLIENT_ID}/shipments/${order.chitchats_shipment_id}`,
          {
            headers: {
              'Authorization': CHITCHATS_API_TOKEN,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!shipmentResponse.ok) {
          console.error(`Failed to fetch shipment ${order.chitchats_shipment_id}:`, shipmentResponse.status);
          results.push({ orderId: order.id, status: 'error', message: 'Failed to fetch shipment' });
          continue;
        }

        const shipmentData = await shipmentResponse.json();
        const shipment = shipmentData.shipment;

        console.log(`ChitChats shipment ${order.chitchats_shipment_id} status: ${shipment.status}`);

        // Check if shipment is in transit or delivered
        const inTransitStatuses = ['in_transit', 'inducted', 'received', 'released', 'delivered'];
        const shouldNotify = inTransitStatuses.includes(shipment.status?.toLowerCase());

        if (!shouldNotify) {
          console.log(`Shipment ${order.chitchats_shipment_id} not yet in transit (status: ${shipment.status})`);
          results.push({ orderId: order.id, status: 'pending', message: `Status: ${shipment.status}` });
          continue;
        }

        // Update tracking number if available from ChitChats
        const trackingNumber = shipment.tracking_number || shipment.carrier_tracking_code || order.tracking_number;
        const tableName = order.source === 'stripe' ? 'orders' : 'woocommerce_orders';

        // Update tracking number if it changed
        if (trackingNumber && trackingNumber !== order.tracking_number) {
          await supabase
            .from(tableName)
            .update({ tracking_number: trackingNumber })
            .eq('id', order.id);
          console.log(`Updated tracking number for order ${order.id}: ${trackingNumber}`);
        }

        // For Stripe orders → push fulfillment to Shopify (Shopify emails customer)
        // For WooCommerce orders → keep our own shipping email
        let notificationError: any = null;
        let notificationChannel = '';

        if (order.source === 'stripe') {
          const { error: shopErr } = await supabase.functions.invoke('shopify-fulfill-order', {
            body: {
              orderNumber: order.order_number,
              trackingNumber: trackingNumber,
              trackingCompany: 'Chit Chats',
              trackingUrl: getTrackingUrl('Chit Chats', trackingNumber),
              notifyCustomer: true,
            },
          });
          notificationError = shopErr;
          if (!shopErr) notificationChannel = 'shopify';
        }

        if (order.source === 'woocommerce' || notificationError) {
          if (notificationError) {
            console.warn(`Shopify notification failed for order ${order.id}; using direct email fallback`, notificationError);
          }
          const billing = order.billing || {};
          const emailData = {
            orderId: order.id,
            orderNumber: order.source === 'stripe' ? String(order.order_number || order.id) : String(order.id),
            customerEmail: order.source === 'stripe' ? order.customer_email : billing.email,
            customerName: order.source === 'stripe'
              ? (order.customer_name || 'Valued Customer')
              : (`${billing.first_name || ''} ${billing.last_name || ''}`.trim() || 'Valued Customer'),
            trackingNumber: trackingNumber,
            carrier: 'ChitChats',
            items: order.source === 'stripe' ? (order.items || []) : (order.line_items || []),
            source: order.source,
          };
          const { error: emailError } = await supabase.functions.invoke('send-shipping-notification', {
            body: emailData,
          });
          notificationError = emailError;
          if (emailError) {
            console.error(`All notification paths failed for order ${order.id}:`, emailError);
            results.push({ orderId: order.id, status: 'notification_failed', message: emailError.message });
            continue;
          }
          notificationChannel = 'direct_email';
        }

        // Mark notification as sent
        await supabase
          .from(tableName)
          .update({ shipping_notification_sent_at: new Date().toISOString() })
          .eq('id', order.id);

        console.log(`Successfully sent shipping notification for order ${order.id} via ${notificationChannel}`);
        results.push({ orderId: order.id, status: 'success', trackingNumber, channel: notificationChannel });

      } catch (error) {
        console.error(`Error processing order ${order.id}:`, error);
        results.push({ orderId: order.id, status: 'error', message: String(error) });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      processed: allOrders.length,
      results,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('ChitChats tracking sync error:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
