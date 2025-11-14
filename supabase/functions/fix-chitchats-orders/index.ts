import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fix order 1: SS-04557846-K25P
    const { error: error1 } = await supabase
      .from('orders')
      .update({
        items: [{"name": "Open Box Bangle Boxes", "price": 16, "quantity": 2}],
        subtotal: 32,
        shipping: 11.61
      })
      .eq('order_number', 'SS-04557846-K25P');

    if (error1) throw error1;
    console.log('✅ Fixed SS-04557846-K25P');

    // Fix order 2: SS-02335015-KZML
    const { error: error2 } = await supabase
      .from('orders')
      .update({
        items: [
          {"name": "The Complete Family Set", "price": 174, "quantity": 2},
          {"name": "Jewelry Bag Organizer", "price": 20, "quantity": 4},
          {"name": "Multipurpose Box - 1 Large box", "price": 12, "quantity": 1}
        ],
        subtotal: 440,
        shipping: 11.61
      })
      .eq('order_number', 'SS-02335015-KZML');

    if (error2) throw error2;
    console.log('✅ Fixed SS-02335015-KZML');

    // Fix order 3: SS-89890742-1SPF
    const { error: error3 } = await supabase
      .from('orders')
      .update({
        items: [
          {"name": "Jewelry Bag Organizer", "price": 20, "quantity": 1},
          {"name": "Medium Bangle Box", "price": 25, "quantity": 1}
        ],
        subtotal: 45,
        shipping: 11.61
      })
      .eq('order_number', 'SS-89890742-1SPF');

    if (error3) throw error3;
    console.log('✅ Fixed SS-89890742-1SPF');

    // Fix order 4: SS-86540219-7O1U
    const { error: error4 } = await supabase
      .from('orders')
      .update({
        items: [
          {"name": "Jewelry Bag Organizer", "price": 20, "quantity": 1},
          {"name": "The Complete Family Set", "price": 174, "quantity": 1}
        ],
        subtotal: 194,
        shipping: 44.09
      })
      .eq('order_number', 'SS-86540219-7O1U');

    if (error4) throw error4;
    console.log('✅ Fixed SS-86540219-7O1U');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Fixed 4 orders with ChitChats shipping',
        orders: [
          'SS-04557846-K25P',
          'SS-02335015-KZML',
          'SS-89890742-1SPF',
          'SS-86540219-7O1U'
        ]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error fixing orders:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
