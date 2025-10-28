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

// Helper function to identify line item types
function identifyLineItemType(itemName: string): 'product' | 'shipping' | 'tax' | 'gift_wrapping' {
  const lowerName = itemName.toLowerCase();
  
  // Check for shipping variations
  if (
    lowerName.includes('shipping') || 
    lowerName.includes('delivery') ||
    lowerName.includes('toronto') ||
    lowerName.includes('gta') ||
    lowerName.includes('canada wide')
  ) {
    return 'shipping';
  }
  
  // Check for tax
  if (lowerName.includes('tax')) {
    return 'tax';
  }
  
  // Check for gift wrapping
  if (lowerName.includes('gift wrap')) {
    return 'gift_wrapping';
  }
  
  return 'product';
}

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

      // Log all line items for debugging
      console.log('Line items:', lineItems.data.map(item => ({
        description: item.description,
        amount: (item.amount_total || 0) / 100,
        type: identifyLineItemType(item.description || '')
      })));

      // Categorize line items
      const productItems = lineItems.data.filter(item => 
        identifyLineItemType(item.description || '') === 'product'
      );
      const shippingItems = lineItems.data.filter(item => 
        identifyLineItemType(item.description || '') === 'shipping'
      );
      const taxItems = lineItems.data.filter(item => 
        identifyLineItemType(item.description || '') === 'tax'
      );
      const giftWrappingItems = lineItems.data.filter(item => 
        identifyLineItemType(item.description || '') === 'gift_wrapping'
      );

      // Map product items for storage (only products, not shipping/tax/gift wrapping)
      const items = productItems.map(item => ({
        name: item.description || 'Product',
        quantity: item.quantity || 1,
        price: (item.price?.unit_amount || 0) / 100,
      }));

      // Calculate totals from categorized items
      const subtotal = productItems.reduce((sum, item) => 
        sum + ((item.amount_total || 0) / 100), 0
      );
      const shipping = shippingItems.reduce((sum, item) => 
        sum + ((item.amount_total || 0) / 100), 0
      );
      const tax = taxItems.reduce((sum, item) => 
        sum + ((item.amount_total || 0) / 100), 0
      );
      const total = (session.amount_total || 0) / 100;

      console.log(`Order breakdown - Products: $${subtotal}, Shipping: $${shipping}, Tax: $${tax}, Total: $${total}`);

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

      // Extract payment intent ID safely
      let paymentIntentId: string | null = null;
      if (session.payment_intent) {
        // Handle both string ID and expanded PaymentIntent object
        paymentIntentId = typeof session.payment_intent === 'string' 
          ? session.payment_intent 
          : session.payment_intent.id;
      }

      console.log('Payment Intent extraction:', {
        type: typeof session.payment_intent,
        value: session.payment_intent,
        extractedId: paymentIntentId
      });

      // Store order in database for admin tracking
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          customer_email: customerEmail,
          customer_name: emailData.customerName,
          order_number: emailData.orderNumber,
          items: emailData.items,
          subtotal: emailData.subtotal,
          shipping: emailData.shipping,
          tax: emailData.tax,
          total: emailData.total,
          shipping_address: emailData.shippingAddress,
          status: 'pending',
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
