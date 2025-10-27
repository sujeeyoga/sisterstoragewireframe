import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisitorData {
  session_id: string;
  visitor_id: string;
  page_path: string;
  referrer?: string;
  user_agent?: string;
}

interface GeoLocation {
  country?: string;
  country_name?: string;
  region?: string;
  city?: string;
}

async function getGeoLocation(ip: string): Promise<GeoLocation> {
  try {
    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      console.error('Geolocation API error:', response.status);
      return {};
    }
    const data = await response.json();
    return {
      country: data.country_code,
      country_name: data.country_name,
      region: data.region,
      city: data.city,
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return {};
  }
}

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'salt_key_for_privacy');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const visitorData: VisitorData = await req.json();
    const { session_id, visitor_id, page_path, referrer, user_agent } = visitorData;

    // Get IP address from request
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';

    console.log('Tracking visitor:', { session_id, visitor_id, page_path, ip });

    // Get geolocation data
    const geoLocation = await getGeoLocation(ip);
    
    // Hash IP for privacy
    const ip_hash = ip !== 'unknown' ? await hashIP(ip) : null;

    // Check if session already exists
    const { data: existingSession } = await supabase
      .from('visitor_analytics')
      .select('*')
      .eq('session_id', session_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingSession) {
      // Update existing session
      const duration_seconds = Math.floor(
        (new Date().getTime() - new Date(existingSession.session_start).getTime()) / 1000
      );

      const { error: updateError } = await supabase
        .from('visitor_analytics')
        .update({
          page_path,
          session_end: new Date().toISOString(),
          duration_seconds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSession.id);

      if (updateError) {
        console.error('Error updating session:', updateError);
        throw updateError;
      }

      console.log('Session updated:', session_id, `${duration_seconds}s`);
    } else {
      // Insert new session
      const { error: insertError } = await supabase
        .from('visitor_analytics')
        .insert({
          session_id,
          visitor_id,
          ip_hash,
          country: geoLocation.country || 'Unknown',
          country_name: geoLocation.country_name || 'Unknown',
          region: geoLocation.region,
          city: geoLocation.city,
          page_path,
          referrer: referrer || 'Direct',
          user_agent,
          visited_at: new Date().toISOString(),
          session_start: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error inserting session:', insertError);
        throw insertError;
      }

      console.log('New session created:', session_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        country: geoLocation.country || 'Unknown',
        session_id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
