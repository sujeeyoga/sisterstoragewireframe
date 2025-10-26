-- Move existing processing orders to pending status
UPDATE orders 
SET status = 'pending', updated_at = now()
WHERE status = 'processing' AND archived_at IS NULL;