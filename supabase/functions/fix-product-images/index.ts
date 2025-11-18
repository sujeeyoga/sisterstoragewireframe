import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fix Bundle : 4 (4 Large Bangle Boxes) - broken 2025/04 URL
    const { error: error1 } = await supabaseClient
      .from('woocommerce_products')
      .update({
        images: [{ 
          src: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/The-Complete-Family-Set-4-Large-2-Medium-2-Travel/1759980920453-ezsfq.jpg' 
        }]
      })
      .eq('id', 25814503)

    if (error1) {
      console.error('Error updating Bundle : 4:', error1)
    }

    // Fix products with broken 2025/03 URLs
    const brokenProducts = [25814406, 25814401, 25814394]
    
    for (const productId of brokenProducts) {
      const { error } = await supabaseClient
        .from('woocommerce_products')
        .update({
          images: [{ 
            src: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/travel%20size/1759979156639-wffbli.jpg' 
          }]
        })
        .eq('id', productId)

      if (error) {
        console.error(`Error updating product ${productId}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Product images fixed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
