import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BulkRefundRequest {
  orderId: string;
  amount: number;
  reason?: string;
  notes?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify user is admin
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      throw new Error('User is not an admin');
    }

    const { refunds } = await req.json() as { refunds: BulkRefundRequest[] };

    if (!refunds || !Array.isArray(refunds) || refunds.length === 0) {
      throw new Error('Refunds array is required');
    }

    console.log(`Processing ${refunds.length} refunds...`);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2025-08-27.basil',
    });

    const results = [];
    
    for (const refundRequest of refunds) {
      try {
        const { orderId, amount, reason, notes } = refundRequest;

        // Fetch order details
        const { data: order, error: orderError } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError || !order) {
          results.push({
            orderId,
            success: false,
            error: 'Order not found'
          });
          continue;
        }

        if (!order.stripe_payment_intent_id) {
          results.push({
            orderId,
            success: false,
            error: 'Order does not have a Stripe payment intent ID'
          });
          continue;
        }

        if (order.status === 'refunded') {
          results.push({
            orderId,
            success: false,
            error: 'Order has already been refunded'
          });
          continue;
        }

        // Calculate refund amount
        const refundAmount = amount || order.total;
        const previouslyRefunded = order.refund_amount || 0;
        const remainingRefundable = order.total - previouslyRefunded;

        if (refundAmount > remainingRefundable) {
          results.push({
            orderId,
            success: false,
            error: `Refund amount ($${refundAmount.toFixed(2)}) exceeds remaining refundable amount ($${remainingRefundable.toFixed(2)})`
          });
          continue;
        }

        if (refundAmount <= 0) {
          results.push({
            orderId,
            success: false,
            error: 'Refund amount must be greater than 0'
          });
          continue;
        }

        console.log(`Processing refund for order ${orderId}:`, {
          payment_intent: order.stripe_payment_intent_id,
          amount: Math.round(refundAmount * 100),
        });

        // Create refund in Stripe
        const refund = await stripe.refunds.create({
          payment_intent: order.stripe_payment_intent_id,
          amount: Math.round(refundAmount * 100),
          reason: reason || 'requested_by_customer',
        });

        console.log(`Stripe refund created for ${orderId}:`, refund.id);

        // Calculate new total refunded amount
        const newTotalRefunded = (order.refund_amount || 0) + refundAmount;
        const isFullRefund = newTotalRefunded >= order.total;
        const newStatus = isFullRefund ? 'refunded' : order.status;

        // Update order status
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({
            status: newStatus,
            refund_amount: newTotalRefunded,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (updateError) {
          console.error(`Failed to update order ${orderId}:`, updateError);
          results.push({
            orderId,
            success: false,
            error: 'Failed to update order status',
            refund_id: refund.id
          });
          continue;
        }

        // Record refund in refunds table
        const { error: refundError } = await supabaseAdmin
          .from('refunds')
          .insert({
            order_id: orderId,
            stripe_refund_id: refund.id,
            amount: refundAmount,
            reason: reason || 'requested_by_customer',
            notes: notes || null,
            processed_by: user.id,
          });

        if (refundError) {
          console.error(`Failed to record refund for ${orderId}:`, refundError);
        }

        results.push({
          orderId,
          order_number: order.order_number,
          success: true,
          refund_id: refund.id,
          amount: refundAmount
        });

      } catch (error) {
        console.error(`Error processing refund for ${refundRequest.orderId}:`, error);
        results.push({
          orderId: refundRequest.orderId,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    console.log(`✅ Bulk refund complete: ${successCount} successful, ${failCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        total: results.length,
        successful: successCount,
        failed: failCount,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing bulk refund:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
