-- Add refund_type enum to distinguish between Stripe and manual refunds
CREATE TYPE refund_type AS ENUM ('stripe', 'manual');

-- Add refund_type column to refunds table
ALTER TABLE refunds 
ADD COLUMN refund_type refund_type DEFAULT 'stripe' NOT NULL;

-- Update existing records to be marked as stripe refunds
UPDATE refunds 
SET refund_type = 'stripe' 
WHERE stripe_refund_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN refunds.refund_type IS 'Indicates whether refund was processed through Stripe API or recorded manually';