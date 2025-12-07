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
    // Get origin with fallbacks for mobile browsers that may not send Origin header
    const getOrigin = (): string => {
      const origin = req.headers.get("origin");
      if (origin && origin !== 'null') return origin;
      
      const referer = req.headers.get("referer");
      if (referer) {
        try {
          return new URL(referer).origin;
        } catch {
          // Invalid referer URL, continue to fallback
        }
      }
      
      // Production fallback
      return "https://sisterstorage.ca";
    };

    const origin = getOrigin();
    console.log('Using origin for checkout URLs:', origin);

    const requestBody = await req.json();
    console.log('Raw checkout request body:', JSON.stringify(requestBody, null, 2));

    const { 
      items, 
      customerEmail, 
      customerPhone,
      shippingAddress, 
      shippingCost, 
      shippingMethod,
      shippingMetadata,
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

    // Validate all cart items are still visible and in stock
    const itemIds = items
      .filter((item: any) => !item.isFreeGift)
      .map((item: any) => {
        // Handle both numeric IDs and string slugs
        const id = item.productId || item.id;
        return typeof id === 'number' ? id : parseInt(id, 10);
      })
      .filter((id: number) => !isNaN(id));
    
    if (itemIds.length > 0) {
      const { data: availableProducts, error: productError } = await supabaseClient
        .from('woocommerce_products')
        .select('id, slug, name, visible, in_stock')
        .in('id', itemIds);

      if (productError) {
        console.error('Error checking product availability:', productError);
      } else if (availableProducts) {
        const availableIdSet = new Set(
          availableProducts
            .filter((p: any) => p.visible && p.in_stock)
            .map((p: any) => p.id)
        );

        for (const item of items) {
          if (item.isFreeGift) continue;
          
          const itemId = item.productId || item.id;
          const numericId = typeof itemId === 'number' ? itemId : parseInt(itemId, 10);
          
          if (!isNaN(numericId) && !availableIdSet.has(numericId)) {
            const product = availableProducts.find((p: any) => p.id === numericId);
            const reason = product 
              ? (!product.visible ? 'no longer available' : 'out of stock')
              : 'not found';
            console.error(`Product unavailable: ${item.name} (${numericId}) - ${reason}`);
            throw new Error(`"${item.name}" is ${reason}. Please remove it from your cart and try again.`);
          }
        }
        console.log('✅ All cart items validated as available');
      }
    }

    // Fetch store-wide discount
    const { data: discountData } = await supabaseClient
      .from('store_settings')
      .select('*')
      .eq('setting_key', 'store_wide_discount')
      .eq('enabled', true)
      .single();

    console.log('Store discount:', discountData);

    // Fetch active flash sales
    const now = new Date().toISOString();
    const { data: flashSales } = await supabaseClient
      .from('flash_sales')
      .select('*')
      .eq('enabled', true)
      .lte('starts_at', now)
      .gte('ends_at', now)
      .order('priority', { ascending: false });

    console.log('Active flash sales:', flashSales?.length || 0);

    // Check if customer exists
    let customerId;
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Calculate discounted prices - flash sales take priority over store-wide discount
    let discountPercentage = 0;
    if (discountData?.setting_value?.percentage) {
      discountPercentage = discountData.setting_value.percentage;
      console.log('Store discount active:', discountPercentage, '%');
    }

    // Helper function to find applicable flash sale for a product
    const getFlashSaleForProduct = (productId: number) => {
      if (!flashSales || flashSales.length === 0) return null;
      
      for (const sale of flashSales) {
        if (sale.applies_to === 'all') {
          return sale;
        } else if (sale.applies_to === 'products' && sale.product_ids?.includes(productId)) {
          return sale;
        }
        // Category-based flash sales would need category info from items
      }
      return null;
    };

    // Helper function to calculate flash sale discount
    const calculateFlashDiscount = (price: number, sale: any) => {
      if (sale.discount_type === 'percentage') {
        return price * (sale.discount_value / 100);
      } else if (sale.discount_type === 'fixed_amount') {
        return Math.min(sale.discount_value, price);
      }
      return 0; // BOGO handled elsewhere
    };

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

      // Check for flash sale on this product (takes priority)
      const flashSale = getFlashSaleForProduct(item.id);
      let discountedPrice = item.price;
      let appliedDiscount = 'none';

      // Determine if item is already on sale
      const hasExistingSale = item.salePrice && item.regularPrice && item.salePrice < item.regularPrice;

      if (flashSale) {
        const flashDiscount = calculateFlashDiscount(item.price, flashSale);
        discountedPrice = item.price - flashDiscount;
        appliedDiscount = `flash-${flashSale.id}`;
        console.log(`Flash sale applied to ${item.name}:`, flashSale.name, discountedPrice);
      } else if (discountPercentage > 0 && !hasExistingSale) {
        // Only apply store-wide discount if item is NOT already on sale
        // This prevents double discounting
        discountedPrice = item.price * (1 - discountPercentage / 100);
        appliedDiscount = 'store-wide';
        console.log(`Store-wide discount applied to ${item.name}: ${item.price} → ${discountedPrice}`);
      } else if (hasExistingSale) {
        // Item already has sale price, don't apply additional discounts
        console.log(`Item ${item.name} already on sale - skipping store-wide discount`);
      }
      
      const itemData: any = {
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name,
            metadata: {
              appliedDiscount,
            },
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

      // Check for flash sale
      const flashSale = getFlashSaleForProduct(item.id);
      let discountedPrice = item.price;
      
      // Determine if item is already on sale
      const hasExistingSale = item.salePrice && item.regularPrice && item.salePrice < item.regularPrice;

      if (flashSale) {
        const flashDiscount = calculateFlashDiscount(item.price, flashSale);
        discountedPrice = item.price - flashDiscount;
      } else if (discountPercentage > 0 && !hasExistingSale) {
        // Only apply store-wide discount if item is NOT already on sale
        discountedPrice = item.price * (1 - discountPercentage / 100);
      }

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
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
        shippingMethod: shippingMethod || '',
        shippingMetadata: shippingMetadata ? JSON.stringify(shippingMetadata) : '',
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
