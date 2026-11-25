import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { productKey, resolveCatalogItem, discountedCatalogPrice, validateGiftItems } from "../_shared/catalog-pricing.ts";

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
      return "https://sisterstorage.com";
    };

    const origin = getOrigin();
    console.log('Using origin for checkout URLs:', origin);

    const requestBody = await req.json();


    const { 
      items: submittedItems,
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
    
    let items = submittedItems;

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

    // Two clients on purpose:
    // - `supabaseClient` runs in this project and is used to invoke sibling edge
    //   functions (the live, current shipping calculator).
    // - `storeDb` points at the store's data project, where products, discounts
    //   and flash sales actually live.
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const STORE_DB_URL = "https://attczdhexkpxpyqyasgz.supabase.co";
    const storeServiceKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
    const storeDb = storeServiceKey
      ? createClient(STORE_DB_URL, storeServiceKey, { auth: { persistSession: false } })
      : supabaseClient;


    // Fail closed: every item, including gift requests, must resolve to the live catalog.
    const keys = items.map((item: any) => productKey(item));
    const numericIds = keys.filter((key: string) => /^\d+$/.test(key));
    const slugs = keys.filter((key: string) => !/^\d+$/.test(key));
    const filters = [
      numericIds.length ? `id.in.(${numericIds.join(',')})` : '',
      slugs.length ? `slug.in.(${slugs.join(',')})` : '',
    ].filter(Boolean).join(',');
    const { data: products, error: productError } = await storeDb
      .from('woocommerce_products')
      .select('id, slug, name, visible, in_stock, price, regular_price, sale_price')
      .or(filters);
    if (productError || !products) {
      throw new Error('Unable to confirm current product prices. Please try again.');
    }
    items = items.map((item: any) => resolveCatalogItem(item, products));

    // A browser-supplied gift flag never overrides the configured promotion.
    if (items.some((item: any) => item.isFreeGift)) {
      const { data: promotion, error: giftError } = await storeDb
        .from('store_settings').select('enabled, setting_value')
        .eq('setting_key', 'us_free_gift_promotion').maybeSingle();
      if (giftError) throw new Error('Unable to confirm gift eligibility. Please try again.');
      const qualifyingSubtotal = items.reduce((sum: number, item: any) =>
        sum + (item.isFreeGift ? 0 : item.price * item.quantity), 0);
      validateGiftItems(items, promotion, shippingAddress.country, qualifyingSubtotal);
    }

    // Fetch store-wide discount
    const { data: discountData } = await storeDb
      .from('store_settings')
      .select('*')
      .eq('setting_key', 'store_wide_discount')
      .eq('enabled', true)
      .single();

    console.log('Store discount:', discountData);

    // Fetch active flash sales
    const now = new Date().toISOString();
    const { data: flashSales } = await storeDb
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

    // Build line items for Stripe from cart items with discount already applied
    const lineItems = items.map((item: any) => {
      // Handle free gift items - always $0, no discount applied
      if (item.isFreeGift) {
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
      const discountedPrice = discountedCatalogPrice(item, flashSale, discountPercentage);
      const appliedDiscount = flashSale ? `flash-${flashSale.id}`
        : item.salePrice !== undefined ? 'sale'
        : discountPercentage > 0 ? 'store-wide' : 'none';

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
      if (item.isFreeGift) {
        return sum;
      }

      // Check for flash sale
      const flashSale = getFlashSaleForProduct(item.id);
      const discountedPrice = discountedCatalogPrice(item, flashSale, discountPercentage);

      return sum + (discountedPrice * item.quantity);
    }, 0);

    // Call calculate-shipping-zones to get the authoritative shipping rate.
    // The client-supplied shippingCost is never trusted when it is LOWER than
    // the recalculated rate — that is how $0 shipping slipped through before.
    let finalShippingCost = Number(shippingCost) || 0;
    const shippingPostalCode = shippingAddress?.postal_code || shippingAddress?.postalCode || shippingAddress?.zip;

    if (shippingAddress?.country && (shippingAddress?.city || shippingPostalCode)) {
      try {
        console.log('Calculating shipping via calculate-shipping-zones:', {
          city: shippingAddress.city,
          province: shippingAddress.state || shippingAddress.province,
          country: shippingAddress.country,
          postalCode: shippingPostalCode,
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
                postalCode: shippingPostalCode
              },
              subtotal: productSubtotal
            }
          }
        );

        if (shippingError) {
          console.error('Shipping calculation error:', shippingError);
          throw new Error('Shipping calculation failed');
        } else if (shippingData?.appliedRate?.rate_amount !== undefined) {
          const authoritativeRate = Number(shippingData.appliedRate.rate_amount) || 0;
          if (authoritativeRate > finalShippingCost) {
            console.warn('⚠️ Client shipping cost was too low - correcting', {
              clientCost: finalShippingCost,
              authoritativeRate,
              zone: shippingData.zone?.name,
            });
          }
          // Always charge at least the recalculated rate for this address
          finalShippingCost = Math.max(finalShippingCost, authoritativeRate);
          console.log('✅ Shipping calculated:', {
            rate: finalShippingCost,
            source: shippingData.rate_source,
            zone: shippingData.zone?.name,
          });
        } else {
          throw new Error('Shipping calculation returned no rate');
        }
      } catch (error) {
        console.error('Failed to calculate shipping:', error);
        // Do not silently ship for free: fail the checkout so it can be retried
        if (!finalShippingCost || finalShippingCost <= 0) {
          throw new Error('Unable to confirm shipping cost for this address. Please try again.');
        }
      }
    } else if (!finalShippingCost || finalShippingCost <= 0) {
      throw new Error('A complete shipping address is required to calculate shipping.');
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

    // Do not carry an old-cart tax amount into the corrected checkout.
    const validTaxRate = Number(taxRate);
    if (!Number.isFinite(validTaxRate) || validTaxRate < 0 || validTaxRate > 1) {
      throw new Error("A valid tax rate is required. Please try again.");
    }
    const finalTaxAmount = Math.round((productSubtotal +
      (giftWrapping?.enabled ? Number(giftWrapping.fee) || 0 : 0)) * validTaxRate * 100) / 100;
    // Add tax as a line item
    if (finalTaxAmount > 0) {
      const taxLabel = province ? `Tax (${province} - ${(taxRate * 100).toFixed(2)}%)` : 'Tax';
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: taxLabel,
          },
          unit_amount: Math.round(finalTaxAmount * 100),
        },
        quantity: 1,
      });
    }

    console.log('Creating Stripe checkout session');

    // Stripe rejects any metadata value longer than 500 characters and fails the
    // whole session. The shipping payload carries a verbose `debug` block, so we
    // strip it and hard-truncate every value before sending.
    const compactShippingMetadata = shippingMetadata
      ? (() => {
          const { debug: _debug, ...rest } = shippingMetadata as Record<string, unknown>;
          return rest;
        })()
      : null;

    const safeMetadata = (obj: Record<string, unknown>) => {
      const out: Record<string, string> = {};
      for (const [key, raw] of Object.entries(obj)) {
        const value = raw === undefined || raw === null ? '' : String(raw);
        if (value.length > 500) {
          console.warn(`Metadata "${key}" truncated from ${value.length} characters`);
        }
        out[key] = value.slice(0, 500);
      }
      return out;
    };

    // Prepare session parameters
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: safeMetadata({
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : '',
        shippingMethod: shippingMethod || '',
        shippingMetadata: compactShippingMetadata ? JSON.stringify(compactShippingMetadata) : '',
        customerPhone: customerPhone || '',
        giftWrapping: giftWrapping?.enabled ? 'Yes' : 'No',
        giftMessage: giftWrapping?.message || '',
        subscribeNewsletter: subscribeNewsletter ? 'Yes' : 'No',
        discountApplied: discountPercentage > 0 ? `${discountPercentage}%` : 'None',
      }),
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
