-- Shipping rate tables + seed data (idempotent, safe to re-run).
--
-- WHY THIS FILE EXISTS
-- The Lovable Cloud migration runner is currently failing with a platform-level
-- credential error ("password authentication failed for user postgres"), so this
-- schema could not be applied automatically. Until it can be, the checkout uses the
-- in-code fallback rules inside supabase/functions/calculate-shipping-zones/index.ts.
--
-- HOW TO APPLY LATER
-- Re-run the shipping migration (or paste this whole file into the SQL editor).
-- Nothing else needs to change: calculate-shipping-zones queries these tables on
-- every request and automatically switches back to database rates the moment they
-- exist. If the tables ever disappear again, it silently reverts to the code rules.
--
-- The seeded values below intentionally mirror the in-code fallback exactly:
--   Toronto & GTA .......... $11.50, free at $60+
--   Ontario (non-GTA) ...... $15.00
--   Canada-wide ............ $15.00
--   United States .......... $30.00
--   No match (fallback) .... $15.00

-- ---------------------------------------------------------------- schema
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipping_zone_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL,
  rule_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipping_zone_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  rate_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  free_threshold NUMERIC(10,2),
  enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipping_fallback_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT true,
  fallback_rate NUMERIC(10,2) NOT NULL DEFAULT 15.00,
  fallback_method_name TEXT NOT NULL DEFAULT 'Standard Shipping',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shipping_zone_rules_zone_id_idx ON public.shipping_zone_rules(zone_id);
CREATE INDEX IF NOT EXISTS shipping_zone_rates_zone_id_idx ON public.shipping_zone_rates(zone_id);
CREATE UNIQUE INDEX IF NOT EXISTS shipping_zones_name_key ON public.shipping_zones(name);
CREATE UNIQUE INDEX IF NOT EXISTS shipping_zone_rules_unique ON public.shipping_zone_rules(zone_id, rule_type, rule_value);
CREATE UNIQUE INDEX IF NOT EXISTS shipping_zone_rates_unique ON public.shipping_zone_rates(zone_id, method_name);

-- ---------------------------------------------------------------- grants
GRANT SELECT ON public.shipping_zones TO anon, authenticated;
GRANT SELECT ON public.shipping_zone_rules TO anon, authenticated;
GRANT SELECT ON public.shipping_zone_rates TO anon, authenticated;
GRANT SELECT ON public.shipping_fallback_settings TO anon, authenticated;
GRANT ALL ON public.shipping_zones TO service_role;
GRANT ALL ON public.shipping_zone_rules TO service_role;
GRANT ALL ON public.shipping_zone_rates TO service_role;
GRANT ALL ON public.shipping_fallback_settings TO service_role;

-- ---------------------------------------------------------------- RLS
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zone_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zone_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_fallback_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shipping_zones' AND policyname='Shipping zones are publicly readable') THEN
    CREATE POLICY "Shipping zones are publicly readable" ON public.shipping_zones FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shipping_zone_rules' AND policyname='Shipping zone rules are publicly readable') THEN
    CREATE POLICY "Shipping zone rules are publicly readable" ON public.shipping_zone_rules FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shipping_zone_rates' AND policyname='Shipping zone rates are publicly readable') THEN
    CREATE POLICY "Shipping zone rates are publicly readable" ON public.shipping_zone_rates FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='shipping_fallback_settings' AND policyname='Shipping fallback settings are publicly readable') THEN
    CREATE POLICY "Shipping fallback settings are publicly readable" ON public.shipping_fallback_settings FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

-- ---------------------------------------------------------------- seed
INSERT INTO public.shipping_zones (name, description, enabled, priority) VALUES
  ('Toronto & GTA', 'Toronto and Greater Toronto Area delivery zone', true, 300),
  ('Ontario', 'Ontario addresses outside the GTA local delivery area', true, 200),
  ('Canada-Wide', 'Standard shipping across Canada', true, 100),
  ('United States', 'Flat-rate shipping to the United States', true, 100)
ON CONFLICT (name) DO NOTHING;

-- GTA postal (FSA) rules — identical to GTA_FSA_PREFIXES in the edge function,
-- plus M* for Toronto proper.
INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT z.id, 'postal_code_pattern', p || '*'
FROM public.shipping_zones z
CROSS JOIN (VALUES
  ('M'),
  ('L1B'),('L1C'),('L1E'),('L1G'),('L1H'),('L1J'),('L1K'),('L1L'),('L1M'),('L1N'),('L1P'),
  ('L1R'),('L1S'),('L1T'),('L1V'),('L1W'),('L1X'),('L1Y'),('L1Z'),
  ('L3P'),('L3R'),('L3S'),('L3T'),('L3X'),('L3Y'),('L3Z'),
  ('L4A'),('L4B'),('L4C'),('L4E'),('L4G'),('L4H'),('L4J'),('L4K'),('L4L'),('L4S'),
  ('L6A'),('L6B'),('L6C'),('L6E'),('L6G'),
  ('L4T'),('L4V'),('L4W'),('L4X'),('L4Y'),('L4Z'),
  ('L5A'),('L5B'),('L5C'),('L5E'),('L5G'),('L5H'),('L5J'),('L5K'),('L5L'),('L5M'),
  ('L5N'),('L5P'),('L5R'),('L5S'),('L5T'),('L5V'),('L5W'),
  ('L6P'),('L6R'),('L6S'),('L6T'),('L6V'),('L6W'),('L6X'),('L6Y'),('L6Z'),('L7A'),('L7C'),
  ('L6H'),('L6J'),('L6K'),('L6L'),('L6M'),('L7G'),('L7L'),('L7M'),('L7N'),('L7P'),
  ('L7R'),('L7S'),('L7T'),('L9T'),
  ('L7B'),('L7E'),('L0J')
) AS fsa(p)
WHERE z.name = 'Toronto & GTA'
ON CONFLICT DO NOTHING;

INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT z.id, 'country', 'CA' FROM public.shipping_zones z WHERE z.name = 'Toronto & GTA'
ON CONFLICT DO NOTHING;

INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT z.id, v.rule_type, v.rule_value
FROM public.shipping_zones z
CROSS JOIN (VALUES ('province','ON'), ('country','CA')) AS v(rule_type, rule_value)
WHERE z.name = 'Ontario'
ON CONFLICT DO NOTHING;

INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT z.id, 'country', 'CA' FROM public.shipping_zones z WHERE z.name = 'Canada-Wide'
ON CONFLICT DO NOTHING;

INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT z.id, 'country', 'US' FROM public.shipping_zones z WHERE z.name = 'United States'
ON CONFLICT DO NOTHING;

INSERT INTO public.shipping_zone_rates (zone_id, method_name, rate_amount, free_threshold, enabled, display_order)
SELECT z.id, r.method_name, r.rate_amount, r.free_threshold, true, 1
FROM public.shipping_zones z
JOIN (VALUES
  ('Toronto & GTA', 'GTA Local Delivery',        11.50, 60.00),
  ('Ontario',       'Canada Standard Shipping',  15.00, NULL::numeric),
  ('Canada-Wide',   'Canada Standard Shipping',  15.00, NULL::numeric),
  ('United States', 'US Standard Shipping',      30.00, NULL::numeric)
) AS r(zone_name, method_name, rate_amount, free_threshold)
  ON r.zone_name = z.name
ON CONFLICT DO NOTHING;

INSERT INTO public.shipping_fallback_settings (enabled, fallback_rate, fallback_method_name)
SELECT true, 15.00, 'Standard Shipping'
WHERE NOT EXISTS (SELECT 1 FROM public.shipping_fallback_settings);
