import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    console.log(`Webhook event received: ${event.type}`);

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("Processing checkout session:", session.id);

      // Get customer details
      const customerEmail = session.customer_email || session.customer_details?.email;
      if (!customerEmail) {
        console.error("No customer email found in session");
        return new Response("No customer email", { status: 400 });
      }

      // Parse shipping address from metadata
      const shippingAddress = session.metadata?.shippingAddress 
        ? JSON.parse(session.metadata.shippingAddress)
        : session.shipping_details?.address;

      // Get line items to build order details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ['data.price.product']
      });

      // Parse items (excluding shipping and tax)
      const items = lineItems.data
        .filter(item => {
          const name = item.description || '';
          return !name.toLowerCase().includes('shipping') && !name.toLowerCase().includes('tax');
        })
        .map(item => ({
          name: item.description || 'Product',
          quantity: item.quantity || 1,
          price: (item.amount_total || 0) / 100,
        }));

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Find shipping and tax line items
      const shippingItem = lineItems.data.find(item => 
        item.description?.toLowerCase().includes('shipping')
      );
      const taxItem = lineItems.data.find(item => 
        item.description?.toLowerCase().includes('tax')
      );

      const shipping = shippingItem ? (shippingItem.amount_total || 0) / 100 : 0;
      const tax = taxItem ? (taxItem.amount_total || 0) / 100 : 0;
      const total = (session.amount_total || 0) / 100;

      // Generate a proper order number
      const timestamp = Date.now().toString().slice(-8);
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const orderNumber = `SS-${timestamp}-${randomSuffix}`;

      // Prepare email data
      const emailData = {
        customerName: shippingAddress?.name || session.customer_details?.name || 'Customer',
        orderNumber,
        orderDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: shippingAddress ? {
          name: shippingAddress.name || session.customer_details?.name || '',
          address: shippingAddress.address || shippingAddress.line1 || '',
          city: shippingAddress.city || '',
          state: shippingAddress.province || shippingAddress.state || '',
          postal_code: shippingAddress.postal_code || shippingAddress.postalCode || '',
          country: shippingAddress.country || 'CA',
        } : null,
      };

      console.log("Sending order confirmation email to:", customerEmail);

      // Send order confirmation email asynchronously
      // Don't await this so webhook returns quickly
      supabase.functions.invoke(
        'send-email',
        {
          body: {
            type: 'order_confirmation',
            to: customerEmail,
            data: emailData,
          },
        }
      ).then(({ data: emailResult, error: emailError }) => {
        if (emailError) {
          console.error("Error sending email:", emailError);
        } else {
          console.log("Order confirmation email sent successfully:", emailResult);
        }
      }).catch((error) => {
        console.error("Failed to send order confirmation email:", error);
      });

      // Store order in database for admin tracking
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_session_id: session.id,
          customer_email: customerEmail,
          customer_name: emailData.customerName,
          order_number: emailData.orderNumber,
          items: emailData.items,
          subtotal: emailData.subtotal,
          shipping: emailData.shipping,
          tax: emailData.tax,
          total: emailData.total,
          shipping_address: emailData.shippingAddress,
          status: 'processing',
          payment_status: 'paid',
        });

      if (orderError) {
        console.error("Error storing order:", orderError);
      } else {
        console.log("Order stored successfully");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
