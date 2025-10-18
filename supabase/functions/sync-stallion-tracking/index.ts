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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Stallion tracking sync...');

    if (!STALLION_API_TOKEN) {
      throw new Error('Stallion Express API token not configured');
    }

    // Create Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch all orders with Stallion shipment IDs that aren't delivered yet
    const { data: stripeOrders, error: stripeError } = await supabaseAdmin
      .from('orders')
      .select('id, stallion_shipment_id, tracking_number, status')
      .not('stallion_shipment_id', 'is', null)
      .neq('status', 'delivered');

    const { data: wooOrders, error: wooError } = await supabaseAdmin
      .from('woocommerce_orders')
      .select('id, stallion_shipment_id, tracking_number, status')
      .not('stallion_shipment_id', 'is', null)
      .neq('status', 'delivered');

    if (stripeError) console.error('Error fetching Stripe orders:', stripeError);
    if (wooError) console.error('Error fetching WooCommerce orders:', wooError);

    const allOrders = [
      ...(stripeOrders || []).map(o => ({ ...o, source: 'stripe' as const })),
      ...(wooOrders || []).map(o => ({ ...o, source: 'woocommerce' as const }))
    ];

    console.log(`Found ${allOrders.length} orders to sync`);

    let updatedCount = 0;
    let errorCount = 0;
    const errorDetails: Array<{ orderId: string | number; error: string }> = [];

    for (const order of allOrders) {
      try {
        // Fetch tracking info from Stallion
        const response = await fetch(
          `${STALLION_BASE_URL}/shipments/${order.stallion_shipment_id}/tracking`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${STALLION_API_TOKEN}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          const errorMsg = `Failed to get tracking for shipment ${order.stallion_shipment_id}: ${response.status}`;
          console.error(errorMsg);
          errorDetails.push({ orderId: order.id, error: errorMsg });
          errorCount++;
          continue;
        }

        const trackingData = await response.json();
        console.log(`Tracking data for order ${order.id}:`, trackingData);

        // Determine new status based on tracking data
        let newStatus = order.status;
        if (trackingData.status === 'Delivered' || trackingData.delivered) {
          newStatus = 'delivered';
        } else if (trackingData.status === 'In Transit' || trackingData.in_transit) {
          newStatus = order.source === 'stripe' ? 'processing' : 'on-hold';
        }

        // Update order if status changed
        if (newStatus !== order.status) {
          const tableName = order.source === 'stripe' ? 'orders' : 'woocommerce_orders';
          const { error: updateError } = await supabaseAdmin
            .from(tableName)
            .update({ status: newStatus })
            .eq('id', order.id);

          if (updateError) {
            const errorMsg = `Failed to update order ${order.id}: ${updateError.message}`;
            console.error(errorMsg);
            errorDetails.push({ orderId: order.id, error: errorMsg });
            errorCount++;
          } else {
            console.log(`Updated order ${order.id} to status: ${newStatus}`);
            updatedCount++;
          }
        }
      } catch (error) {
        const errorMsg = `Error processing order ${order.id}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMsg);
        errorDetails.push({ orderId: order.id, error: errorMsg });
        errorCount++;
      }
    }

    console.log(`Sync complete. Updated: ${updatedCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({
        success: true,
        updated: updatedCount,
        errors: errorCount,
        total: allOrders.length,
        errorDetails: errorDetails.slice(0, 10), // Include first 10 errors
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
