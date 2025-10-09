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
    } else {
      // Create customer if not exists
      const customer = await stripe.customers.create({
        email: customerEmail,
        name: shippingAddress?.name,
        address: shippingAddress ? {
          line1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        } : undefined,
      });
      customerId = customer.id;
    }

    // Calculate total amount in cents
    let totalAmount = 0;
    
    // Add item prices
    items.forEach((item: any) => {
      totalAmount += Math.round(item.price * 100) * item.quantity;
    });
    
    // Add shipping
    if (shippingCost && shippingCost > 0) {
      totalAmount += Math.round(shippingCost * 100);
    }
    
    // Add tax
    if (taxAmount && taxAmount > 0) {
      totalAmount += Math.round(taxAmount * 100);
    }

    console.log('Creating Payment Intent with amount:', totalAmount);

    // Create a Payment Intent for embedded checkout
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'cad',
      customer: customerId,
      description: `Order from Sister Storage - ${items.length} item(s)`,
      metadata: {
        items: JSON.stringify(items.map((item: any) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }))),
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
        shippingMethod: shippingMethod || '',
        shippingCost: shippingCost?.toString() || '0',
        taxAmount: taxAmount?.toString() || '0',
        taxRate: taxRate?.toString() || '0',
        province: province || '',
      },
    });

    console.log('Payment Intent created:', paymentIntent.id);

    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    }), {
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
