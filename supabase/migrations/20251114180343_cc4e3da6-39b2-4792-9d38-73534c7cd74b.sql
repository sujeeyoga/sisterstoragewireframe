-- Phase 1: Make user_id non-nullable and add index
-- Note: This assumes no existing NULL records, or they'll need admin review
ALTER TABLE public.woocommerce_customers
ALTER COLUMN user_id SET NOT NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_woocommerce_customers_user_id
ON public.woocommerce_customers(user_id);

-- Phase 2: Create trigger for automatic customer record creation on signup
CREATE OR REPLACE FUNCTION public.create_woocommerce_customer_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.woocommerce_customers (
    id, 
    user_id, 
    email, 
    first_name, 
    last_name,
    billing,
    shipping
  )
  VALUES (
    (EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000)::bigint, -- Generate WooCommerce-style ID
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    '{}'::jsonb,
    '{}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created_woocommerce ON auth.users;
CREATE TRIGGER on_auth_user_created_woocommerce
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_woocommerce_customer_on_signup();