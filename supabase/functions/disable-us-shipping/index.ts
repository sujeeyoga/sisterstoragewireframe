import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Disable both US shipping zones
    const usZoneIds = [
      '33333333-3333-3333-3333-333333333333', // United States - Standard
      '44444444-4444-4444-4444-444444444444'  // US West Coast
    ];

    const { data, error } = await supabase
      .from('shipping_zones')
      .update({ enabled: false, updated_at: new Date().toISOString() })
      .in('id', usZoneIds)
      .select();

    if (error) {
      console.error('Error disabling US zones:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'US shipping zones disabled successfully',
        zones: data
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in disable-us-shipping function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
