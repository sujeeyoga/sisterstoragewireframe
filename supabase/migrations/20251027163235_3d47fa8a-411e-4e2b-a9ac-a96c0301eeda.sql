-- Fix RLS policies for abandoned_carts to allow admin access
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Users can view their own abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Authenticated users can create abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Service role can create abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Service role can update abandoned carts" ON abandoned_carts;

-- Create new simplified policies
-- Admins can view all abandoned carts
CREATE POLICY "Admins can view all abandoned carts"
ON abandoned_carts
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role can manage abandoned carts"
ON abandoned_carts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Public users can insert their own carts (for the abandoned cart tracking)
CREATE POLICY "Anyone can create abandoned carts"
ON abandoned_carts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow service role to update (for marking as recovered, etc.)
CREATE POLICY "Service role can update abandoned carts"
ON abandoned_carts
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
