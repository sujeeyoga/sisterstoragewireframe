-- Fix RLS policies for orders table to allow admins to view all orders
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Recreate admin policy for all operations
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Recreate user policy for viewing their own orders
-- Use a simpler approach that doesn't require joining auth.users
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  customer_email IN (
    SELECT email::text FROM auth.users WHERE id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);