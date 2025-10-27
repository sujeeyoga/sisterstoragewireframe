-- Fix woocommerce_customers RLS policy complexity
-- Replace multiple overlapping policies with clean, non-overlapping policies

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage all customers" ON public.woocommerce_customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON public.woocommerce_customers;
DROP POLICY IF EXISTS "Authenticated users can create their own customer data" ON public.woocommerce_customers;
DROP POLICY IF EXISTS "Authenticated users can update their own customer data" ON public.woocommerce_customers;
DROP POLICY IF EXISTS "Authenticated users can view their own customer data" ON public.woocommerce_customers;
DROP POLICY IF EXISTS "Deny all public access to customers" ON public.woocommerce_customers;

-- Create simplified, non-overlapping policies

-- 1. Admin full access (single policy for all operations)
CREATE POLICY "Admins have full access"
ON public.woocommerce_customers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. Users can manage their own data (combined read/write)
CREATE POLICY "Users can manage their own customer data"
ON public.woocommerce_customers
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Single clear deny-all for public (unauthenticated) access
CREATE POLICY "Deny all public access"
ON public.woocommerce_customers
FOR ALL
TO anon
USING (false)
WITH CHECK (false);