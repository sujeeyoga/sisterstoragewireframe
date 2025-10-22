-- Create shipping zones table
CREATE TABLE public.shipping_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  priority INTEGER NOT NULL DEFAULT 100,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipping zone rules table
CREATE TABLE public.shipping_zone_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('country', 'province', 'postal_code_pattern', 'city')),
  rule_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipping zone rates table
CREATE TABLE public.shipping_zone_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  method_name TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('flat_rate', 'free_threshold')),
  rate_amount NUMERIC NOT NULL DEFAULT 0,
  free_threshold NUMERIC,
  enabled BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipping fallback settings table
CREATE TABLE public.shipping_fallback_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fallback_rate NUMERIC NOT NULL,
  fallback_method_name TEXT NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zone_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zone_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_fallback_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipping_zones
CREATE POLICY "Anyone can view enabled zones"
  ON public.shipping_zones FOR SELECT
  USING (enabled = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage zones"
  ON public.shipping_zones FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for shipping_zone_rules
CREATE POLICY "Anyone can view rules for enabled zones"
  ON public.shipping_zone_rules FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.shipping_zones
    WHERE id = zone_id AND (enabled = true OR has_role(auth.uid(), 'admin'::app_role))
  ));

CREATE POLICY "Admins can manage zone rules"
  ON public.shipping_zone_rules FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for shipping_zone_rates
CREATE POLICY "Anyone can view rates for enabled zones"
  ON public.shipping_zone_rates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.shipping_zones
    WHERE id = zone_id AND (enabled = true OR has_role(auth.uid(), 'admin'::app_role))
  ));

CREATE POLICY "Admins can manage zone rates"
  ON public.shipping_zone_rates FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for shipping_fallback_settings
CREATE POLICY "Anyone can view fallback settings"
  ON public.shipping_fallback_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage fallback settings"
  ON public.shipping_fallback_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_shipping_zones_enabled ON public.shipping_zones(enabled);
CREATE INDEX idx_shipping_zone_rules_zone_id ON public.shipping_zone_rules(zone_id);
CREATE INDEX idx_shipping_zone_rates_zone_id ON public.shipping_zone_rates(zone_id);
CREATE INDEX idx_shipping_zone_rates_enabled ON public.shipping_zone_rates(enabled);

-- Create trigger for updated_at
CREATE TRIGGER update_shipping_zones_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_zone_rates_updated_at
  BEFORE UPDATE ON public.shipping_zone_rates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_fallback_settings_updated_at
  BEFORE UPDATE ON public.shipping_fallback_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing Toronto flat rate zone
INSERT INTO public.shipping_zones (name, description, priority, enabled)
VALUES ('Toronto', 'Toronto city flat rate shipping', 300, true);

INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT id, 'city', 'Toronto'
FROM public.shipping_zones WHERE name = 'Toronto';

INSERT INTO public.shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, display_order)
SELECT id, 'Standard Shipping', 'flat_rate', 3.99, 1
FROM public.shipping_zones WHERE name = 'Toronto';

-- Migrate existing GTA free shipping zone
INSERT INTO public.shipping_zones (name, description, priority, enabled)
VALUES ('Greater Toronto Area', 'GTA region with free shipping over threshold', 200, true);

INSERT INTO public.shipping_zone_rules (zone_id, rule_type, rule_value)
SELECT id, 'postal_code_pattern', pattern
FROM public.shipping_zones, 
     (VALUES ('M*'), ('L1*'), ('L2*'), ('L3*'), ('L4*'), ('L5*'), ('L6*'), ('L7*'), ('L8*'), ('L9*')) AS patterns(pattern)
WHERE name = 'Greater Toronto Area';

INSERT INTO public.shipping_zone_rates (zone_id, method_name, rate_type, rate_amount, free_threshold, display_order)
SELECT id, 'Standard Shipping', 'free_threshold', 9.99, 50, 1
FROM public.shipping_zones WHERE name = 'Greater Toronto Area';

-- Create default fallback settings
INSERT INTO public.shipping_fallback_settings (fallback_rate, fallback_method_name, enabled)
VALUES (9.99, 'Standard Shipping', true);

-- Add feature flag to store_settings
INSERT INTO public.store_settings (setting_key, setting_value, enabled)
VALUES ('use_zone_based_shipping', '{"enabled": true}'::jsonb, true)
ON CONFLICT (setting_key) DO UPDATE SET setting_value = '{"enabled": true}'::jsonb, enabled = true;