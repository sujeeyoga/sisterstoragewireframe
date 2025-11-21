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

  // Common shipping provider and method keywords
  const providerKeywords = [
    'shipping', 'delivery', 'intelcom', 'canada post', 'canadapost', 'purolator',
    'ups', 'fedex', 'dhl', 'stallion', 'chit chats', 'chitchats'
  ];
  const methodKeywords = ['standard', 'express', 'expedited', 'priority'];

  // If it contains any clear shipping indicators, classify as shipping
  if (providerKeywords.some(k => lowerName.includes(k)) ||
      (methodKeywords.some(k => lowerName.includes(k)) && providerKeywords.some(k => lowerName.includes(k) || lowerName.includes('shipping')))) {
    return 'shipping';
  }

  // Check for tax
  if (lowerName.includes('tax')) {
    return 'tax';
  }

  // Check for gift wrapping
  if (lowerName.includes('gift wrap') || lowerName.includes('gift wrapping')) {
    return 'gift_wrapping';
  }

  return 'product';
}

serve(async (req) => {
  console.log("=== STRIPE WEBHOOK INVOKED ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  console.log("Signature present:", !!signature);
  console.log("Webhook secret configured:", !!webhookSecret);

  if (!signature) {
    console.error("ERROR: Missing Stripe signature header");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  if (!webhookSecret) {
    console.error("ERROR: STRIPE_WEBHOOK_SECRET not configured in edge function secrets");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const body = await req.text();
    console.log("Body length:", body.length);
    
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);

    console.log(`✅ Webhook verified successfully: ${event.type}`);

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("✅ Processing checkout session:", session.id);
      console.log("Payment status:", session.payment_status);
      console.log("Amount total:", session.amount_total);

      // Get customer details
      const customerEmail = session.customer_email || session.customer_details?.email;
      if (!customerEmail) {
        console.error("❌ ERROR: No customer email found in session");
        return new Response("No customer email", { status: 400 });
      }
      
      console.log("Customer email:", customerEmail);

      // Parse shipping address from metadata
      const shippingAddress = session.metadata?.shippingAddress 
        ? JSON.parse(session.metadata.shippingAddress)
        : session.shipping_details?.address;
      
      // Parse shipping metadata from session
      const shippingMetadata = session.metadata?.shippingMetadata 
        ? JSON.parse(session.metadata.shippingMetadata)
        : null;

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
      const items = productItems.map(item => {
        // Calculate unit price from amount_total / quantity (more reliable than unit_amount for price_data)
        const quantity = item.quantity || 1;
        const unitPrice = item.amount_total && quantity 
          ? (item.amount_total / quantity) / 100 
          : (item.price?.unit_amount || 0) / 100;
        
        return {
          name: item.description || 'Product',
          quantity: quantity,
          price: unitPrice,
        };
      });

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
      
      // VALIDATION: Calculate subtotal from items array to catch any discrepancies
      const calculatedSubtotal = items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      const subtotalDiscrepancy = Math.abs(subtotal - calculatedSubtotal);
      
      if (subtotalDiscrepancy > 0.01) {
        console.error(`⚠️ SUBTOTAL MISMATCH DETECTED!`, {
          fromStripeLineItems: subtotal,
          fromItemsArray: calculatedSubtotal,
          discrepancy: subtotalDiscrepancy,
          items: items,
          sessionId: session.id
        });
        // Use the calculated subtotal from items array as it's more reliable
        console.log(`Using calculated subtotal: $${calculatedSubtotal} instead of Stripe's: $${subtotal}`);
      }
      
      // Use the more reliable calculated subtotal
      const finalSubtotal = subtotalDiscrepancy > 0.01 ? calculatedSubtotal : subtotal;

      // Discrepancy detection: compare expected vs. charged
      const expectedTotal = Number((subtotal + shipping + tax).toFixed(2));
      const chargedTotal = Number(total.toFixed(2));
      const discrepancy = Number((expectedTotal - chargedTotal).toFixed(2));
      const needsReview = Math.abs(discrepancy) > 0.5; // allow small rounding differences
      if (needsReview) {
        console.warn('⚠️ Order total discrepancy detected', { expectedTotal, chargedTotal, discrepancy, sessionId: session.id });
      }
      
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
        subtotal: finalSubtotal,
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

      // Check if order already exists (webhook idempotency)
      console.log("🔍 Checking for duplicate orders with session:", session.id);
      const { data: existingOrder, error: checkError } = await supabase
        .from('orders')
        .select('id, order_number')
        .eq('stripe_session_id', session.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is expected for new orders
        console.error("❌ ERROR checking for existing order:", checkError);
      }

      if (existingOrder) {
        console.log(`⚠️ DUPLICATE: Order already exists for session ${session.id} (order: ${existingOrder.order_number})`);
        return new Response(JSON.stringify({ received: true, duplicate: true, order_number: existingOrder.order_number }), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        });
      }
      
      console.log("✅ No duplicate found, proceeding with order creation");

      // Store order in database for admin tracking
      console.log("📦 Creating order in database...");
      console.log("Order number:", emailData.orderNumber);
      console.log("Order total:", emailData.total);
      console.log("Needs review:", needsReview);
      
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_session_id: session.id,
          stripe_payment_intent_id: paymentIntentId,
          customer_email: customerEmail,
          customer_name: emailData.customerName,
          order_number: emailData.orderNumber,
          items: emailData.items,
          subtotal: finalSubtotal,
          shipping: emailData.shipping,
          shipping_metadata: shippingMetadata,
          tax: emailData.tax,
          total: emailData.total,
          shipping_address: emailData.shippingAddress,
          status: needsReview ? 'pending_review' : 'pending',
          payment_status: 'paid',
        })
        .select('id')
        .single();

      if (orderError) {
        console.error("❌ CRITICAL: Failed to store order in database:", orderError);
        console.error("Order data:", JSON.stringify({ 
          order_number: emailData.orderNumber, 
          customer_email: customerEmail,
          total: emailData.total 
        }));
        throw orderError; // Re-throw to trigger webhook retry
      } else {
        console.log("✅ SUCCESS: Order created in database");
        console.log("Order number:", emailData.orderNumber);
        console.log("Order ID:", newOrder.id);
        
        // Send order confirmation email AFTER order is created
        console.log("📧 Sending order confirmation email to:", customerEmail);
        supabase.functions.invoke(
          'send-email',
          {
            body: {
              type: 'order_confirmation',
              to: customerEmail,
              data: {
                ...emailData,
                orderId: newOrder.id, // Include order ID for logging
              },
            },
          }
        ).then(({ data: emailResult, error: emailError }) => {
          if (emailError) {
            console.error("❌ ERROR: Failed to send order confirmation email:", emailError);
          } else {
            console.log("✅ SUCCESS: Order confirmation email sent successfully");
            console.log("Email service response:", emailResult);
          }
        }).catch((error) => {
          console.error("❌ CRITICAL: Exception while invoking send-email function:", error);
        });
        
        // Mark any abandoned carts as recovered
        console.log("🛒 Checking for abandoned carts to mark as recovered...");
        const { data: abandonedCarts, error: cartFetchError } = await supabase
          .from('abandoned_carts')
          .select('id')
          .eq('email', customerEmail)
          .is('recovered_at', null);
        
        if (cartFetchError) {
          console.error("❌ Error fetching abandoned carts:", cartFetchError);
        } else if (abandonedCarts && abandonedCarts.length > 0) {
          console.log(`Found ${abandonedCarts.length} abandoned cart(s) to recover`);
          const cartIds = abandonedCarts.map(cart => cart.id);
          const { error: updateError } = await supabase
            .from('abandoned_carts')
            .update({ recovered_at: new Date().toISOString() })
            .in('id', cartIds);
          
          if (updateError) {
            console.error("❌ Error marking abandoned carts as recovered:", updateError);
          } else {
            console.log(`✅ Marked ${abandonedCarts.length} abandoned cart(s) as recovered`);
          }
        } else {
          console.log("No abandoned carts found for this customer");
        }
      }
    }

    console.log("=== WEBHOOK PROCESSED SUCCESSFULLY ===");
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("❌❌❌ WEBHOOK PROCESSING FAILED ❌❌❌");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Check for specific error types
    if (error.type === 'StripeSignatureVerificationError') {
      console.error("⚠️ SIGNATURE VERIFICATION FAILED");
      console.error("This usually means the webhook secret in Supabase doesn't match the one in Stripe");
      console.error("Check: https://dashboard.stripe.com/webhooks");
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        type: error.type || error.constructor.name 
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
