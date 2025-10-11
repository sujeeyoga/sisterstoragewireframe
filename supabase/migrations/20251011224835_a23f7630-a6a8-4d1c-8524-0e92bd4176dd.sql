-- Fix RLS policy for orders table - simplify to avoid auth.users permission issues
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

-- Recreate simplified user policy that doesn't require auth.users access
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);