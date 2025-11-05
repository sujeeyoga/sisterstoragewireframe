const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const sitemapUrl = 'https://www.sisterstorage.com/sitemap.xml';
    
    console.log('Pinging search engines with sitemap:', sitemapUrl);

    // Ping Google
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const googleResponse = await fetch(googlePingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Sister Storage Sitemap Submitter'
      }
    });

    // Ping Bing
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const bingResponse = await fetch(bingPingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Sister Storage Sitemap Submitter'
      }
    });

    const results = {
      google: {
        status: googleResponse.status,
        success: googleResponse.ok,
        message: googleResponse.ok ? 'Successfully notified Google' : 'Failed to notify Google'
      },
      bing: {
        status: bingResponse.status,
        success: bingResponse.ok,
        message: bingResponse.ok ? 'Successfully notified Bing' : 'Failed to notify Bing'
      },
      timestamp: new Date().toISOString()
    };

    console.log('Ping results:', results);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Search engines notified about sitemap updates',
        results
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error pinging search engines:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});