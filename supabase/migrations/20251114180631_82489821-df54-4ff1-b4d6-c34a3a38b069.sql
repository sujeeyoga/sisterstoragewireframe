-- Fix abandoned_carts table security
-- Restrict SELECT access to admins only to prevent email harvesting

-- Drop any existing SELECT policies to start fresh
DROP POLICY IF EXISTS "Admins can view all abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Anyone can view abandoned carts" ON public.abandoned_carts;
DROP POLICY IF EXISTS "Public can view abandoned carts" ON public.abandoned_carts;

-- Create strict admin-only SELECT policy
CREATE POLICY "Only admins can view abandoned carts"
ON public.abandoned_carts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Ensure other policies remain secure
-- UPDATE: already restricted to admins
-- DELETE: already restricted to admins
-- INSERT: keep session-based validation for cart creation (needed for functionality)