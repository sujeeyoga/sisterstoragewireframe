-- Drop the insecure policy that allows anyone to create abandoned carts
DROP POLICY IF EXISTS "Anyone can create abandoned cart records" ON public.abandoned_carts;

-- Create a new policy that only allows service role to insert abandoned carts
-- This forces all cart creation to go through edge functions with proper validation
CREATE POLICY "Service role can create abandoned carts"
ON public.abandoned_carts
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also allow authenticated users to create their own abandoned carts
CREATE POLICY "Authenticated users can create abandoned carts"
ON public.abandoned_carts
FOR INSERT
TO authenticated
WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Add comment explaining the security model
COMMENT ON TABLE public.abandoned_carts IS 
'Abandoned cart records should only be created by authenticated users or through edge functions using service role. 
This prevents email harvesting and ensures proper validation and rate limiting.';