import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { orderId, amount, reason, notes } = await req.json();

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    console.log('Processing refund for order:', orderId);

    // Fetch order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    if (!order.stripe_payment_intent_id) {
      throw new Error('Order does not have a Stripe payment intent ID. Please process refund manually in Stripe Dashboard.');
    }

    if (order.status === 'refunded') {
      throw new Error('Order has already been refunded');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2025-08-27.basil',
    });

    // Determine refund amount
    const refundAmount = amount || order.total;
    
    // Calculate total refunded so far
    const previouslyRefunded = order.refund_amount || 0;
    const remainingRefundable = order.total - previouslyRefunded;

    if (refundAmount > remainingRefundable) {
      throw new Error(`Refund amount ($${refundAmount.toFixed(2)}) exceeds remaining refundable amount ($${remainingRefundable.toFixed(2)}). Already refunded: $${previouslyRefunded.toFixed(2)}`);
    }
    
    if (refundAmount <= 0) {
      throw new Error('Refund amount must be greater than 0');
    }

    console.log('Creating Stripe refund:', {
      payment_intent: order.stripe_payment_intent_id,
      amount: Math.round(refundAmount * 100),
      previouslyRefunded,
      remainingRefundable,
    });

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: reason || 'requested_by_customer',
    });

    console.log('Stripe refund created:', refund.id);

    // Calculate new total refunded amount
    const newTotalRefunded = (order.refund_amount || 0) + refundAmount;
    
    // Determine if this is a full or partial refund
    const isFullRefund = newTotalRefunded >= order.total;
    const newStatus = isFullRefund ? 'refunded' : order.status;

    console.log('Updating order:', {
      newStatus,
      newTotalRefunded,
      isFullRefund,
    });

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
      console.error('Failed to update order:', updateError);
      throw new Error('Failed to update order status');
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
      console.error('Failed to record refund:', refundError);
    }

    console.log('✅ Refund processed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        refund_id: refund.id,
        amount: refundAmount,
        message: 'Refund processed successfully',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing refund:', error);
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
