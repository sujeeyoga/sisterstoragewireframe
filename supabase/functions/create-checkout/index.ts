import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      items, 
      customerEmail, 
      customerPhone,
      shippingAddress, 
      shippingCost, 
      shippingMethod, 
      taxAmount, 
      taxRate, 
      province,
      subtotal,
      giftWrapping,
      subscribeNewsletter
    } = await req.json();
    
    console.log('Checkout request:', { 
      items, 
      customerEmail, 
      customerPhone,
      shippingAddress, 
      shippingCost, 
      shippingMethod, 
      taxAmount, 
      taxRate, 
      province,
      subtotal,
      giftWrapping,
      subscribeNewsletter
    });
    
    if (!items || items.length === 0) {
      throw new Error("Cart items are required");
    }

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Initialize Supabase client to check for store discounts
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Fetch store-wide discount
    const { data: discountData } = await supabaseClient
      .from('store_settings')
      .select('*')
      .eq('setting_key', 'store_wide_discount')
      .eq('enabled', true)
      .single();

    console.log('Store discount:', discountData);

    // Check if customer exists
    let customerId;
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Calculate discounted prices if store discount is active
    let discountPercentage = 0;
    if (discountData?.setting_value?.percentage) {
      discountPercentage = discountData.setting_value.percentage;
      console.log('Store discount active:', discountPercentage, '%');
    }

    // Build line items for Stripe from cart items with discount already applied
    const lineItems = items.map((item: any) => {
      // Apply discount to item price if discount exists
      const discountedPrice = discountPercentage > 0 
        ? item.price * (1 - discountPercentage / 100)
        : item.price;
      
      const itemData: any = {
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(discountedPrice * 100),
        },
        quantity: item.quantity,
      };

      // Add image if available and is a valid URL
      if (item.image && item.image.startsWith('http')) {
        itemData.price_data.product_data.images = [item.image];
      }

      // Add description with product details
      if (item.description) {
        itemData.price_data.product_data.description = item.description;
      }

      return itemData;
    });

    // Add gift wrapping as line item if enabled
    if (giftWrapping?.enabled && giftWrapping.fee > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Gift Wrapping',
            description: giftWrapping.message ? `Message: ${giftWrapping.message}` : undefined,
          },
          unit_amount: Math.round(giftWrapping.fee * 100),
        },
        quantity: 1,
      });
    }

    // Validate free shipping eligibility before adding shipping cost
    // GTA free shipping threshold is $50 for Toronto, Etobicoke, Scarborough, North York, Markham, Whitby, etc.
    const FREE_SHIPPING_THRESHOLD = 50;
    const gtaCities = ['toronto', 'etobicoke', 'scarborough', 'north york', 'markham', 'whitby', 'vaughan', 'richmond hill', 'pickering', 'ajax', 'oshawa', 'mississauga', 'brampton'];
    
    const customerCity = shippingAddress?.city?.toLowerCase().trim() || '';
    const customerProvince = shippingAddress?.state?.toUpperCase() || shippingAddress?.province?.toUpperCase() || '';
    const isGTA = gtaCities.some(city => customerCity.includes(city)) || customerProvince === 'ON';
    
    // Calculate product subtotal (excluding gift wrapping)
    const productSubtotal = items.reduce((sum: number, item: any) => {
      const discountedPrice = discountPercentage > 0 
        ? item.price * (1 - discountPercentage / 100)
        : item.price;
      return sum + (discountedPrice * item.quantity);
    }, 0);
    
    const qualifiesForFreeShipping = isGTA && productSubtotal >= FREE_SHIPPING_THRESHOLD;
    
    console.log('Free shipping check:', {
      isGTA,
      productSubtotal,
      threshold: FREE_SHIPPING_THRESHOLD,
      qualifiesForFreeShipping,
      originalShippingCost: shippingCost,
      city: customerCity,
      province: customerProvince
    });
    
    // Override shipping cost to 0 if qualifies for free shipping
    const finalShippingCost = qualifiesForFreeShipping ? 0 : shippingCost;
    
    // Add shipping as a line item only if there's a cost
    if (finalShippingCost && finalShippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: shippingMethod || 'Shipping',
          },
          unit_amount: Math.round(finalShippingCost * 100),
        },
        quantity: 1,
      });
    } else if (qualifiesForFreeShipping) {
      console.log('✅ FREE SHIPPING APPLIED - Order qualifies!');
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

    // Prepare session parameters
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
        shippingMethod: shippingMethod || '',
        customerPhone: customerPhone || '',
        giftWrapping: giftWrapping?.enabled ? 'Yes' : 'No',
        giftMessage: giftWrapping?.message || '',
        subscribeNewsletter: subscribeNewsletter ? 'Yes' : 'No',
        discountApplied: discountPercentage > 0 ? `${discountPercentage}%` : 'None',
      },
    };

    // Note: Discount is already applied to line item prices above, no need for Stripe coupons
    // This prevents double discount application

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('Checkout session created:', session.id);

    return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
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
