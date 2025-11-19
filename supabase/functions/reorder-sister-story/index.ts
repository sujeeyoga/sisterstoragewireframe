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

    // Move Shawtycin video to last position (display_order 7)
    const { error } = await supabaseClient
      .from('sister_stories')
      .update({ display_order: 7 })
      .eq('id', '2e1c378d-07a9-4746-9562-b6c818a7a81a')

    if (error) {
      console.error('Error updating sister story:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Shawtycin video moved to last position' }),
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
