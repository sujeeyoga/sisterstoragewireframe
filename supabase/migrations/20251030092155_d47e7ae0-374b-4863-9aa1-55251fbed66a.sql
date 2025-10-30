-- Fix orders with incorrect subtotals
-- Recalculate subtotal based on actual line items

UPDATE orders
SET subtotal = (
  SELECT SUM((item->>'quantity')::numeric * (item->>'price')::numeric)
  FROM jsonb_array_elements(items) as item
)
WHERE subtotal != (
  SELECT SUM((item->>'quantity')::numeric * (item->>'price')::numeric)
  FROM jsonb_array_elements(items) as item
)
AND items IS NOT NULL
AND jsonb_array_length(items) > 0;

-- Log the fixes
DO $$
DECLARE
  fixed_count integer;
BEGIN
  SELECT COUNT(*) INTO fixed_count
  FROM orders
  WHERE subtotal = (
    SELECT SUM((item->>'quantity')::numeric * (item->>'price')::numeric)
    FROM jsonb_array_elements(items) as item
  );
  
  RAISE NOTICE 'Fixed subtotal for % orders', fixed_count;
END $$;