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
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Initialize Supabase with service role (admin access)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify admin authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Admin authenticated, starting backfill process');

    // Fetch all orders missing payment intent IDs
    const { data: orders, error: fetchError } = await supabase
      .from('orders')
      .select('id, stripe_session_id, order_number')
      .is('stripe_payment_intent_id', null)
      .not('stripe_session_id', 'is', null);

    if (fetchError) {
      throw new Error(`Failed to fetch orders: ${fetchError.message}`);
    }

    console.log(`Found ${orders?.length || 0} orders to backfill`);

    const results = {
      total: orders?.length || 0,
      updated: 0,
      failed: 0,
      errors: [] as any[],
    };

    // Process each order
    for (const order of orders || []) {
      try {
        console.log(`Processing order ${order.order_number} (${order.id})`);

        // Retrieve the checkout session from Stripe with expanded payment_intent
        const session = await stripe.checkout.sessions.retrieve(
          order.stripe_session_id,
          { expand: ['payment_intent'] }
        );

        // Extract payment intent ID
        let paymentIntentId: string | null = null;
        if (session.payment_intent) {
          paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : (session.payment_intent as any).id;
        }

        if (!paymentIntentId) {
          console.warn(`No payment intent found for order ${order.order_number}`);
          results.failed++;
          results.errors.push({
            orderId: order.id,
            orderNumber: order.order_number,
            error: 'No payment intent ID found in session',
          });
          continue;
        }

        console.log(`Found payment intent ${paymentIntentId} for order ${order.order_number}`);

        // Update the order in database
        const { error: updateError } = await supabase
          .from('orders')
          .update({ stripe_payment_intent_id: paymentIntentId })
          .eq('id', order.id);

        if (updateError) {
          throw updateError;
        }

        results.updated++;
        console.log(`✅ Updated order ${order.order_number} with payment intent ${paymentIntentId}`);

      } catch (error) {
        console.error(`Failed to process order ${order.order_number}:`, error);
        results.failed++;
        results.errors.push({
          orderId: order.id,
          orderNumber: order.order_number,
          error: error.message,
        });
      }
    }

    console.log('Backfill complete:', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Backfill error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
