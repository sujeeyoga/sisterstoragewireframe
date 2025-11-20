-- Create email campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  sent_at timestamp with time zone,
  created_by uuid,
  campaign_name text NOT NULL,
  email_type text NOT NULL,
  subject text NOT NULL,
  preview_text text,
  template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  recipient_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed', 'cancelled'))
);

-- Add campaign_id to email_logs
ALTER TABLE public.email_logs 
ADD COLUMN IF NOT EXISTS campaign_id uuid REFERENCES public.email_campaigns(id);

-- Create customer list view for aggregated customer data
CREATE OR REPLACE VIEW public.customer_list AS
SELECT 
  customer_email,
  MAX(customer_name) as customer_name,
  COUNT(*) as order_count,
  SUM(total) as total_spent,
  MAX(created_at) as last_order_date,
  MIN(created_at) as first_order_date
FROM public.orders
WHERE customer_email IS NOT NULL 
  AND customer_email != ''
GROUP BY customer_email;

-- Enable RLS on email_campaigns
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_campaigns
CREATE POLICY "Admins can manage email campaigns"
  ON public.email_campaigns
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_by ON public.email_campaigns(created_by);
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON public.email_logs(campaign_id);