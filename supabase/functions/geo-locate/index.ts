// Returns a coarse location (country / region / city) for the caller's connection.
// Used to show an estimated shipping rate in the cart before an address is typed.
// No IP address is stored or returned.

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GeoResult {
  country?: string;
  country_name?: string;
  region?: string;
  city?: string;
}

async function lookup(ip: string): Promise<GeoResult> {
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city`,
    );
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          country: data.countryCode,
          country_name: data.country,
          region: data.region || data.regionName,
          city: data.city,
        };
      }
    }
  } catch (_e) {
    console.log('Primary geolocation lookup failed');
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (res.ok) {
      const data = await res.json();
      if (!data.error) {
        return {
          country: data.country_code,
          country_name: data.country_name,
          region: data.region_code || data.region,
          city: data.city,
        };
      }
    }
  } catch (_e) {
    console.log('Fallback geolocation lookup failed');
  }

  return {};
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '';

  if (!ip) {
    return new Response(JSON.stringify({ success: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  const geo = await lookup(ip);

  return new Response(
    JSON.stringify({ success: Boolean(geo.country), ...geo }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  );
});
