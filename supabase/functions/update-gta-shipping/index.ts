import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find GTA shipping zones
    const { data: zones, error: zonesError } = await supabase
      .from('shipping_zones')
      .select('id, name')
      .or('name.ilike.%GTA%,name.ilike.%Toronto%')

    if (zonesError) throw zonesError

    const zoneIds = zones?.map(z => z.id) || []

    // Update all rates for these zones
    const { data: updatedRates, error: updateError } = await supabase
      .from('shipping_zone_rates')
      .update({
        rate_amount: 4.99,
        free_threshold: 60
      })
      .in('zone_id', zoneIds)
      .select()

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({
        success: true,
        message: 'GTA shipping rates updated successfully',
        updated: updatedRates
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error updating GTA shipping:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
