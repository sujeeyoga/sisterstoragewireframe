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
    const requestBody = await req.json();
    console.log('Raw checkout request body:', JSON.stringify(requestBody, null, 2));

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
    } = requestBody;
    
    console.log('Parsed checkout request:', { 
      items: items?.length, 
      customerEmail, 
      customerPhone,
      hasShippingAddress: !!shippingAddress,
      shippingCost, 
      shippingMethod, 
      taxAmount, 
      taxRate, 
      province,
      subtotal,
      hasGiftWrapping: !!giftWrapping,
      subscribeNewsletter
    });
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items:', items);
      throw new Error("Cart items are required and must be a non-empty array");
    }

    if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.trim()) {
      console.error('Invalid customerEmail:', customerEmail);
      throw new Error("Customer email is required and must be a valid string");
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      console.error('Invalid shippingAddress:', shippingAddress);
      throw new Error("Shipping address is required and must be an object");
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
      // Handle free gift items - always $0, no discount applied
      if (item.isFreeGift || item.price === 0) {
        const freeItemData: any = {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `${item.name} (FREE GIFT 🎁)`,
              description: item.description || 'Complimentary gift with your order',
            },
            unit_amount: 0, // Always $0 for free gifts
          },
          quantity: item.quantity,
        };

        // Add image if available
        if (item.image && (item.image.startsWith('http') || item.image.startsWith('/'))) {
          const fullImageUrl = item.image.startsWith('http') 
            ? item.image 
            : `${req.headers.get("origin")}${item.image}`;
          freeItemData.price_data.product_data.images = [fullImageUrl];
        }

        return freeItemData;
      }

      // Apply discount to regular item price if discount exists
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

    console.log('Line items created:', lineItems.length, 'items');
    console.log('Has free gift:', items.some((item: any) => item.isFreeGift));

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

    // Calculate product subtotal (excluding gift wrapping)
    const productSubtotal = items.reduce((sum: number, item: any) => {
      // Skip free gift items from subtotal calculation
      if (item.isFreeGift || item.price === 0) {
        return sum;
      }
      const discountedPrice = discountPercentage > 0 
        ? item.price * (1 - discountPercentage / 100)
        : item.price;
      return sum + (discountedPrice * item.quantity);
    }, 0);

    // Call calculate-shipping-zones to get accurate shipping rate with GTA free shipping logic
    let finalShippingCost = shippingCost;
    
    if (shippingAddress?.city && shippingAddress?.country) {
      try {
        console.log('Calculating shipping via calculate-shipping-zones:', {
          city: shippingAddress.city,
          province: shippingAddress.state || shippingAddress.province,
          country: shippingAddress.country,
          subtotal: productSubtotal
        });

        const { data: shippingData, error: shippingError } = await supabaseClient.functions.invoke(
          'calculate-shipping-zones',
          {
            body: {
              address: {
                city: shippingAddress.city,
                province: shippingAddress.state || shippingAddress.province,
                country: shippingAddress.country,
                postalCode: shippingAddress.postal_code || shippingAddress.zip
              },
              subtotal: productSubtotal
            }
          }
        );

        if (shippingError) {
          console.error('Shipping calculation error:', shippingError);
        } else if (shippingData?.appliedRate?.rate_amount !== undefined) {
          finalShippingCost = shippingData.appliedRate.rate_amount;
          console.log('✅ Shipping calculated:', {
            rate: finalShippingCost,
            source: shippingData.rate_source,
            zone: shippingData.zone?.name,
            gtaFreeShipping: shippingData.appliedRate.gta_free_shipping_applied
          });
          
          if (shippingData.appliedRate.gta_free_shipping_applied) {
            console.log('🎉 GTA FREE SHIPPING APPLIED!');
          }
        }
      } catch (error) {
        console.error('Failed to calculate shipping:', error);
        // Fall back to provided shipping cost
      }
    }
    
    console.log('Final shipping cost for Stripe:', finalShippingCost);
    
    // Add shipping as a line item only if there's a cost
    if (finalShippingCost && finalShippingCost > 0) {
      // Extract carrier from shipping method name
      const methodName = shippingMethod || 'Shipping';
      const isChitChats = methodName.toLowerCase().includes('chit chats');
      const isStallion = methodName.toLowerCase().includes('stallion');
      
      let carrier = 'standard';
      let service = 'Standard shipping';
      
      if (isChitChats) {
        carrier = 'chitchats';
        service = methodName;
      } else if (isStallion) {
        carrier = 'stallion';
        service = methodName;
      } else {
        service = methodName;
      }
      
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: methodName,
            description: service,
            metadata: {
              isShipping: 'true',
              carrier: carrier,
              service: service,
            },
          },
          unit_amount: Math.round(finalShippingCost * 100),
        },
        quantity: 1,
      });
    } else if (finalShippingCost === 0) {
      console.log('✅ FREE SHIPPING - No shipping charge added to Stripe checkout');
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
  } catch (error: any) {
    console.error("Checkout error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to create checkout',
        errorType: error.name
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.message?.includes('required') || error.message?.includes('must be') ? 400 : 500,
      }
    );
  }
});
