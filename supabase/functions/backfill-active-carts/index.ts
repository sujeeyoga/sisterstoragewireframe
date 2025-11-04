import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Insert test visitor analytics first
    const { error: visitorError } = await supabaseClient
      .from('visitor_analytics')
      .upsert([
        {
          session_id: 'session_test_001',
          visitor_id: 'visitor_001',
          country: 'CA',
          city: 'Toronto',
          page_path: '/shop',
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          visited_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          session_start: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          session_id: 'session_test_002',
          visitor_id: 'visitor_002',
          country: 'US',
          city: 'New York',
          page_path: '/shop',
          created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          visited_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
          session_start: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        },
        {
          session_id: 'session_test_003',
          visitor_id: 'visitor_003',
          country: 'CA',
          city: 'Vancouver',
          page_path: '/shop',
          created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          visited_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          session_start: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        },
      ], { onConflict: 'session_id' });

    if (visitorError) {
      console.error('Error inserting visitor analytics:', visitorError);
    }

    // Insert test active carts
    const { data, error } = await supabaseClient
      .from('active_carts')
      .upsert([
        {
          session_id: 'session_test_001',
          visitor_id: 'visitor_001',
          email: 'sarah.jones@example.com',
          cart_items: [
            {
              id: '1',
              name: 'Open Box - 4 Rod Bangle Stand',
              price: 29.99,
              quantity: 2,
              image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/open-box-bangle-4rod.jpg',
            },
          ],
          subtotal: 59.98,
          last_updated: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          session_id: 'session_test_002',
          visitor_id: 'visitor_002',
          email: 'emily.smith@gmail.com',
          cart_items: [
            {
              id: '2',
              name: 'Multipurpose Box',
              price: 24.99,
              quantity: 1,
              image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/multipurpose-box.jpg',
            },
            {
              id: '3',
              name: '2-Rod Bangle Box',
              price: 19.99,
              quantity: 3,
              image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/bangle-2rod.jpg',
            },
          ],
          subtotal: 84.96,
          last_updated: new Date(Date.now() - 30 * 1000).toISOString(),
          created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        },
        {
          session_id: 'session_test_003',
          visitor_id: 'visitor_003',
          email: null,
          cart_items: [
            {
              id: '1',
              name: 'Open Box - 4 Rod Bangle Stand',
              price: 29.99,
              quantity: 1,
              image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/products/open-box-bangle-4rod.jpg',
            },
          ],
          subtotal: 29.99,
          last_updated: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        },
      ], { onConflict: 'session_id' });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Backfilled 3 test active carts',
        data,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
