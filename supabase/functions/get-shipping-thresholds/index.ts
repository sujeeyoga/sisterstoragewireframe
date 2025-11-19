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

    // Fetch all enabled shipping zones with their rules and rates
    const { data: zones, error: zonesError } = await supabase
      .from('shipping_zones')
      .select(`
        *,
        shipping_zone_rules(*),
        shipping_zone_rates(*)
      `)
      .eq('enabled', true)
      .order('priority', { ascending: true })

    if (zonesError) throw zonesError

    // Fetch fallback settings
    const { data: fallback, error: fallbackError } = await supabase
      .from('shipping_fallback_settings')
      .select('*')
      .single()

    if (fallbackError && fallbackError.code !== 'PGRST116') throw fallbackError

    // Process zones to extract threshold information
    const thresholds = zones?.map(zone => {
      const freeShippingRates = zone.shipping_zone_rates
        ?.filter((rate: any) => rate.enabled && rate.free_threshold && rate.free_threshold > 0)
        .map((rate: any) => ({
          method: rate.method_name,
          threshold: rate.free_threshold,
          rate: rate.rate_amount
        })) || []

      return {
        zone_name: zone.name,
        description: zone.description,
        priority: zone.priority,
        rules: zone.shipping_zone_rules?.map((rule: any) => ({
          type: rule.rule_type,
          value: rule.rule_value
        })) || [],
        free_shipping_thresholds: freeShippingRates,
        has_free_shipping: freeShippingRates.length > 0
      }
    }).filter(z => z.has_free_shipping) || []

    return new Response(
      JSON.stringify({
        thresholds,
        fallback: fallback ? {
          rate: fallback.fallback_rate,
          method: fallback.fallback_method_name,
          enabled: fallback.enabled
        } : null
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error fetching shipping thresholds:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
