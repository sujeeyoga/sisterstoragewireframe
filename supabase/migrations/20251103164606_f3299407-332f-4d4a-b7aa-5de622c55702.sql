-- Create tariff_rates table to store country-specific tariff information
CREATE TABLE IF NOT EXISTS public.tariff_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  tariff_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  customs_fee DECIMAL(10,2) DEFAULT 0,
  broker_fee DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  effective_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster lookups
CREATE INDEX idx_tariff_rates_country_code ON public.tariff_rates(country_code);

-- Enable RLS
ALTER TABLE public.tariff_rates ENABLE ROW LEVEL SECURITY;

-- Allow admins to read tariff rates
CREATE POLICY "Authenticated users can view tariff rates"
ON public.tariff_rates
FOR SELECT
TO authenticated
USING (true);

-- Allow admins to manage tariff rates
CREATE POLICY "Authenticated users can manage tariff rates"
ON public.tariff_rates
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_tariff_rates_updated_at
BEFORE UPDATE ON public.tariff_rates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default tariff rates for key countries
INSERT INTO public.tariff_rates (country_code, country_name, tariff_percentage, customs_fee, broker_fee, notes)
VALUES 
  ('US', 'United States', 25.00, 15.00, 10.00, 'Cross-border tariffs and customs duties due to ongoing trade situation'),
  ('CA', 'Canada', 0.00, 0.00, 0.00, 'Domestic shipping - no tariffs'),
  ('GB', 'United Kingdom', 20.00, 25.00, 15.00, 'UK VAT and customs fees'),
  ('AU', 'Australia', 10.00, 20.00, 12.00, 'GST and customs fees'),
  ('DE', 'Germany', 19.00, 20.00, 15.00, 'EU VAT and customs'),
  ('FR', 'France', 20.00, 20.00, 15.00, 'EU VAT and customs'),
  ('MX', 'Mexico', 16.00, 10.00, 8.00, 'IVA and customs'),
  ('JP', 'Japan', 10.00, 15.00, 12.00, 'Consumption tax and customs')
ON CONFLICT (country_code) DO NOTHING;