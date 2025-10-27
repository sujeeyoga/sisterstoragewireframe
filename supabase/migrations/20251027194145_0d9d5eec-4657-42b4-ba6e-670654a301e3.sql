-- Fix abandoned_carts security: Add session validation for insertions
-- This prevents spam/fake cart insertions by requiring a valid visitor session

-- Drop the overly permissive "Anyone can create abandoned carts" policy
DROP POLICY IF EXISTS "Anyone can create abandoned carts" ON public.abandoned_carts;

-- Create new policy: Only allow inserts with valid session_id from visitor_analytics
CREATE POLICY "Authenticated sessions can create abandoned carts"
ON public.abandoned_carts
FOR INSERT
WITH CHECK (
  -- Must have a session_id
  session_id IS NOT NULL
  AND
  -- Session must exist in visitor_analytics (created within last 24 hours)
  EXISTS (
    SELECT 1 FROM public.visitor_analytics
    WHERE visitor_analytics.session_id = abandoned_carts.session_id
    AND visitor_analytics.created_at > NOW() - INTERVAL '24 hours'
  )
);

-- Add index to improve session validation performance
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_session_id_created 
ON public.visitor_analytics(session_id, created_at);

-- Add index for abandoned_carts session lookups
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_session_id 
ON public.abandoned_carts(session_id);

-- Ensure session_id is NOT NULL going forward
ALTER TABLE public.abandoned_carts 
ALTER COLUMN session_id SET NOT NULL;