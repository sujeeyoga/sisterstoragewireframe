-- Fix RLS policies on woocommerce_customers table
-- Remove the confusing "Deny all public access" policy
DROP POLICY IF EXISTS "Deny all public access" ON public.woocommerce_customers;

-- Drop and recreate the user policy to make it more explicit
DROP POLICY IF EXISTS "Users can manage their own customer data" ON public.woocommerce_customers;

-- Users can only SELECT their own customer data
CREATE POLICY "Users can view their own customer data"
ON public.woocommerce_customers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can only INSERT their own customer data
CREATE POLICY "Users can create their own customer data"
ON public.woocommerce_customers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own customer data
CREATE POLICY "Users can update their own customer data"
ON public.woocommerce_customers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only DELETE their own customer data
CREATE POLICY "Users can delete their own customer data"
ON public.woocommerce_customers
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Ensure the admin policy remains (recreate it for clarity)
DROP POLICY IF EXISTS "Admins have full access" ON public.woocommerce_customers;

CREATE POLICY "Admins have full access"
ON public.woocommerce_customers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));