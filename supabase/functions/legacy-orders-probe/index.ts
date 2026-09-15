import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const LEGACY_URL = 'https://attczdhexkpxpyqyasgz.supabase.co';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const key = Deno.env.get('LEGACY_SUPABASE_SERVICE_ROLE_KEY');
  if (!key) {
    return new Response(JSON.stringify({ error: 'missing legacy key' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const db = createClient(LEGACY_URL, key, { auth: { persistSession: false } });
  const url = new URL(req.url);
  const table = url.searchParams.get('table') ?? 'orders';
  const limit = Number(url.searchParams.get('limit') ?? '5');
  const status = url.searchParams.get('status');

  let q = db.from(table).select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(limit);
  if (status) q = q.eq('status', status);
  const { data, count, error } = await q;

  return new Response(JSON.stringify({ table, count, error: error?.message ?? null, sample: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
