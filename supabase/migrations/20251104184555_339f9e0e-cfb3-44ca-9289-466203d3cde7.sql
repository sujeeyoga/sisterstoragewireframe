-- Create QR codes table
CREATE TABLE public.qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code text UNIQUE NOT NULL,
  name text NOT NULL,
  destination_url text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  scan_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage QR codes"
  ON public.qr_codes
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read active QR codes"
  ON public.qr_codes
  FOR SELECT
  USING (is_active = true OR has_role(auth.uid(), 'admin'));

-- Create index for fast lookups
CREATE INDEX idx_qr_codes_short_code ON public.qr_codes(short_code);

-- Create scans tracking table for analytics
CREATE TABLE public.qr_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  scanned_at timestamp with time zone DEFAULT now(),
  user_agent text,
  referrer text,
  ip_hash text
);

ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view scans"
  ON public.qr_scans
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert scans"
  ON public.qr_scans
  FOR INSERT
  WITH CHECK (true);

-- Add trigger to update updated_at
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON public.qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();