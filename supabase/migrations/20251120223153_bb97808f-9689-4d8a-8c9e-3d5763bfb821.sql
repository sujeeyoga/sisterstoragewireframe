-- Create email_logs table for tracking all sent emails
CREATE TABLE public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  email_type text NOT NULL,
  subject text,
  sent_successfully boolean DEFAULT true,
  error_message text,
  email_data jsonb DEFAULT '{}'::jsonb,
  sent_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Add indexes for faster queries
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX idx_email_logs_order_id ON public.email_logs(order_id);
CREATE INDEX idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX idx_email_logs_type ON public.email_logs(email_type);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only policy for viewing email logs
CREATE POLICY "Admins can view email logs"
  ON public.email_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin-only policy for inserting email logs
CREATE POLICY "Admins can insert email logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert (for edge functions)
CREATE POLICY "Service role can insert email logs"
  ON public.email_logs FOR INSERT
  WITH CHECK (true);