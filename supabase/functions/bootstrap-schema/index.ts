// One-time bootstrap: create content tables in Lovable Cloud and copy rows from the
// legacy project. Temporary — delete after successful run.
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const LEGACY_URL = "https://attczdhexkpxpyqyasgz.supabase.co";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DDL = `
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  image_url TEXT,
  video_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (page_slug, section_key)
);
CREATE TABLE IF NOT EXISTS public.shop_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  category_filter TEXT,
  product_ids JSONB,
  layout_columns INTEGER NOT NULL DEFAULT 3,
  display_order INTEGER NOT NULL DEFAULT 0,
  background_color TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.shipping_zone_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  rate_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_threshold NUMERIC(10,2),
  rate_type TEXT NOT NULL DEFAULT 'flat_rate',
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_content TO anon;
GRANT SELECT ON public.page_content TO authenticated;
GRANT ALL ON public.page_content TO service_role;
GRANT SELECT ON public.shop_sections TO anon;
GRANT SELECT ON public.shop_sections TO authenticated;
GRANT ALL ON public.shop_sections TO service_role;
GRANT SELECT ON public.shipping_zones TO anon;
GRANT SELECT ON public.shipping_zones TO authenticated;
GRANT ALL ON public.shipping_zones TO service_role;
GRANT SELECT ON public.shipping_zone_rates TO anon;
GRANT SELECT ON public.shipping_zone_rates TO authenticated;
GRANT ALL ON public.shipping_zone_rates TO service_role;
GRANT SELECT ON public.store_settings TO anon;
GRANT SELECT ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zone_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='page_content' AND policyname='Anyone can read page content') THEN
    CREATE POLICY "Anyone can read page content" ON public.page_content FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shop_sections' AND policyname='Anyone can read shop sections') THEN
    CREATE POLICY "Anyone can read shop sections" ON public.shop_sections FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shipping_zones' AND policyname='Anyone can read shipping zones') THEN
    CREATE POLICY "Anyone can read shipping zones" ON public.shipping_zones FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shipping_zone_rates' AND policyname='Anyone can read shipping zone rates') THEN
    CREATE POLICY "Anyone can read shipping zone rates" ON public.shipping_zone_rates FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='store_settings' AND policyname='Anyone can read store settings') THEN
    CREATE POLICY "Anyone can read store settings" ON public.store_settings FOR SELECT USING (true);
  END IF;
END $$;
`;

const JSONB_COLUMNS: Record<string, string[]> = {
  shop_sections: ["product_ids"],
  store_settings: ["setting_value"],
};

const TABLES = ["shipping_zones", "shipping_zone_rates", "page_content", "shop_sections", "store_settings"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const legacyKey = Deno.env.get("LEGACY_SUPABASE_SERVICE_ROLE_KEY");
  const dbUrl = Deno.env.get("SUPABASE_DB_URL");
  if (!legacyKey || !dbUrl) {
    return new Response(JSON.stringify({ ok: false, error: "missing env" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const client = new Client(dbUrl);
  const report: Record<string, unknown> = {};
  try {
    await client.connect();
    await client.queryArray(DDL);
    report.ddl = "ok";

    for (const table of TABLES) {
      const res = await fetch(`${LEGACY_URL}/rest/v1/${table}?select=*`, {
        headers: { apikey: legacyKey, Authorization: `Bearer ${legacyKey}` },
      });
      if (!res.ok) { report[table] = `fetch failed ${res.status}`; continue; }
      const rows = await res.json();
      let inserted = 0;
      for (const row of rows) {
        const cols = Object.keys(row);
        const jsonbCols = JSONB_COLUMNS[table] || [];
        const vals = cols.map((c) => {
          const v = row[c];
          if (jsonbCols.includes(c) && v !== null && typeof v === "object") return JSON.stringify(v);
          return v;
        });
        const placeholders = cols.map((c, i) => jsonbCols.includes(c) ? `$${i + 1}::jsonb` : `$${i + 1}`);
        await client.queryArray(
          `INSERT INTO public.${table} (${cols.join(",")}) VALUES (${placeholders.join(",")}) ON CONFLICT DO NOTHING`,
          vals,
        );
        inserted++;
      }
      report[table] = { fetched: rows.length, attempted: inserted };
    }
    report.ok = true;
  } catch (e) {
    report.ok = false;
    report.error = String(e);
  } finally {
    try { await client.end(); } catch { /* ignore */ }
  }

  return new Response(JSON.stringify(report), {
    status: report.ok ? 200 : 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
