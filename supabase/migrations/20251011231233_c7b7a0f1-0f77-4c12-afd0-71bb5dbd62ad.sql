-- Replace orders policy to use has_role() security definer function
DROP POLICY IF EXISTS "Admin full access to orders" ON public.orders;

CREATE POLICY "Admin full access to orders"
ON public.orders
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));