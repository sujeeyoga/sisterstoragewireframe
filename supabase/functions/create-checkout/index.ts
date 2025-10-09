import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, customerEmail, shippingAddress, shippingCost, shippingMethod, taxAmount, taxRate, province } = await req.json();
    
    console.log('Checkout request:', { items, customerEmail, shippingAddress, shippingCost, shippingMethod, taxAmount, taxRate, province });
    
    if (!items || items.length === 0) {
      throw new Error("Cart items are required");
    }

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer exists
    let customerId;
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Build line items for Stripe from cart items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    if (shippingCost && shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: shippingMethod || 'Shipping',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (taxAmount && taxAmount > 0) {
      const taxLabel = province ? `Tax (${province} - ${(taxRate * 100).toFixed(2)}%)` : 'Tax';
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: taxLabel,
          },
          unit_amount: Math.round(taxAmount * 100),
        },
        quantity: 1,
      });
    }

    console.log('Creating Stripe checkout session');

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
        shippingMethod: shippingMethod || '',
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
