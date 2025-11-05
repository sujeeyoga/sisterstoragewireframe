import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting product dimensions update...');

    // Travel Size boxes (170g) - 15×10×5cm
    const { error: travelError } = await supabaseClient
      .from('woocommerce_products')
      .update({ length: 15, width: 10, height: 5 })
      .eq('weight', 170.1);

    if (travelError) throw travelError;
    console.log('Updated Travel Size boxes');

    // Medium Bangle Box (297g) - 18×15×8cm
    const { error: mediumError } = await supabaseClient
      .from('woocommerce_products')
      .update({ length: 18, width: 15, height: 8 })
      .eq('weight', 297.1);

    if (mediumError) throw mediumError;
    console.log('Updated Medium Bangle Boxes');

    // Large Bangle Box (581g) - 20×18×10cm
    const { error: largeError } = await supabaseClient
      .from('woocommerce_products')
      .update({ length: 20, width: 18, height: 10 })
      .eq('weight', 580.6);

    if (largeError) throw largeError;
    console.log('Updated Large Bangle Boxes');

    // Jewelry Bag Organizer (492g) - 25×20×2cm
    const { error: bagError } = await supabaseClient
      .from('woocommerce_products')
      .update({ length: 25, width: 20, height: 2 })
      .eq('weight', 492.1);

    if (bagError) throw bagError;
    console.log('Updated Jewelry Bag Organizers');

    // Open Box items (830g) - 22×16×12cm
    const { error: openBoxError } = await supabaseClient
      .from('woocommerce_products')
      .update({ length: 22, width: 16, height: 12 })
      .eq('weight', 830.1);

    if (openBoxError) throw openBoxError;
    console.log('Updated Open Box items');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Product dimensions updated successfully',
        updates: {
          travel: '15×10×5cm (170g)',
          medium: '18×15×8cm (297g)',
          large: '20×18×10cm (581g)',
          bag: '25×20×2cm (492g)',
          openBox: '22×16×12cm (830g)',
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error updating product dimensions:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
