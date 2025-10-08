-- Add explicit policy to deny all public access to woocommerce_orders
-- This ensures anonymous users cannot access sensitive billing/shipping data

-- Drop any existing overly permissive policies (if any)
DROP POLICY IF EXISTS "Public can view orders" ON public.woocommerce_orders;

-- Create explicit deny policy for anonymous users
CREATE POLICY "Deny all public access to orders"
ON public.woocommerce_orders
FOR ALL
TO anon
USING (false);

-- Ensure authenticated users can only view their own orders
-- (This policy already exists but we're making it more explicit)
DROP POLICY IF EXISTS "Users can view their own orders" ON public.woocommerce_orders;
CREATE POLICY "Authenticated users can view their own orders"
ON public.woocommerce_orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Ensure authenticated users can only create their own orders
-- (This policy already exists but we're making it more explicit)
DROP POLICY IF EXISTS "Users can create their own orders" ON public.woocommerce_orders;
CREATE POLICY "Authenticated users can create their own orders"
ON public.woocommerce_orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add policy for authenticated users to update their own orders
-- (This was missing - users should be able to update their orders)
CREATE POLICY "Authenticated users can update their own orders"
ON public.woocommerce_orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add admin access policies using the has_role function
CREATE POLICY "Admins can view all orders"
ON public.woocommerce_orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all orders"
ON public.woocommerce_orders
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));