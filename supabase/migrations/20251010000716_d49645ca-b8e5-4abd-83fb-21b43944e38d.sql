-- Create abandoned carts table
CREATE TABLE public.abandoned_carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  cart_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  recovered_at TIMESTAMP WITH TIME ZONE,
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

-- Allow public insert for tracking abandoned carts
CREATE POLICY "Anyone can create abandoned cart records"
ON public.abandoned_carts
FOR INSERT
WITH CHECK (true);

-- Allow users to view their own abandoned carts
CREATE POLICY "Users can view their own abandoned carts"
ON public.abandoned_carts
FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow admins to view all abandoned carts
CREATE POLICY "Admins can view all abandoned carts"
ON public.abandoned_carts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role to update (for marking as recovered or reminder sent)
CREATE POLICY "Service role can update abandoned carts"
ON public.abandoned_carts
FOR UPDATE
USING (true);

-- Create index for email lookups
CREATE INDEX idx_abandoned_carts_email ON public.abandoned_carts(email);
CREATE INDEX idx_abandoned_carts_created_at ON public.abandoned_carts(created_at);
CREATE INDEX idx_abandoned_carts_reminder_sent ON public.abandoned_carts(reminder_sent_at);