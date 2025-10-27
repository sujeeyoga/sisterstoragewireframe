-- Add stripe_payment_intent_id to orders table for refund processing
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id 
ON orders(stripe_payment_intent_id);

-- Create refunds tracking table
CREATE TABLE IF NOT EXISTS refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  stripe_refund_id text NOT NULL,
  amount numeric NOT NULL,
  reason text,
  notes text,
  processed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on refunds table
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- Admins can manage refunds
CREATE POLICY "Admins can manage refunds"
ON refunds
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Create index on order_id for refunds
CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);

-- Add trigger to update updated_at on refunds
CREATE TRIGGER update_refunds_updated_at
BEFORE UPDATE ON refunds
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();