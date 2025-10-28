-- Fix RLS policies on abandoned_carts table to protect customer emails

-- Remove the overly permissive service role policy
DROP POLICY IF EXISTS "Service role can manage abandoned carts" ON public.abandoned_carts;

-- Remove the duplicate update policy for admins
DROP POLICY IF EXISTS "Service role can update abandoned carts" ON public.abandoned_carts;

-- Keep admin SELECT policy (already exists, but recreate for clarity)
DROP POLICY IF EXISTS "Admins can view all abandoned carts" ON public.abandoned_carts;

CREATE POLICY "Admins can view all abandoned carts"
ON public.abandoned_carts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update abandoned carts (for managing reminders, etc.)
CREATE POLICY "Admins can update abandoned carts"
ON public.abandoned_carts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete abandoned carts
CREATE POLICY "Admins can delete abandoned carts"
ON public.abandoned_carts
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Improve INSERT policy to be more restrictive
-- Only allow inserts if the session is recent (within last hour) and valid
DROP POLICY IF EXISTS "Authenticated sessions can create abandoned carts" ON public.abandoned_carts;

CREATE POLICY "Valid sessions can create abandoned carts"
ON public.abandoned_carts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL 
  AND email IS NOT NULL 
  AND EXISTS (
    SELECT 1
    FROM visitor_analytics
    WHERE visitor_analytics.session_id = abandoned_carts.session_id
    AND visitor_analytics.created_at > (now() - interval '1 hour')
  )
);