-- Add explicit policy to deny all public access to woocommerce_customers
-- This ensures anonymous users cannot access sensitive customer email, billing, and shipping data

-- Drop any existing overly permissive policies (if any)
DROP POLICY IF EXISTS "Public can view customers" ON public.woocommerce_customers;

-- Create explicit deny policy for anonymous users
CREATE POLICY "Deny all public access to customers"
ON public.woocommerce_customers
FOR ALL
TO anon
USING (false);

-- Ensure authenticated users can only view their own customer data
-- (This policy already exists but we're making it more explicit)
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.woocommerce_customers;
CREATE POLICY "Authenticated users can view their own customer data"
ON public.woocommerce_customers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Ensure authenticated users can only update their own customer data
-- (This policy already exists but we're making it more explicit)
DROP POLICY IF EXISTS "Users can update their own customer data" ON public.woocommerce_customers;
CREATE POLICY "Authenticated users can update their own customer data"
ON public.woocommerce_customers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add policy for authenticated users to create their own customer record
CREATE POLICY "Authenticated users can create their own customer data"
ON public.woocommerce_customers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add admin access policies using the has_role function
CREATE POLICY "Admins can view all customers"
ON public.woocommerce_customers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all customers"
ON public.woocommerce_customers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));