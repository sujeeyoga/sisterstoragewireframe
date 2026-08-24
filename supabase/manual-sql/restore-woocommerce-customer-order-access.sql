-- Run this against the database that contains public.woocommerce_orders.
-- It lets authenticated guest-checkout customers read orders matching their
-- verified auth email while preserving user_id ownership and admin access.

GRANT SELECT ON public.woocommerce_orders TO authenticated;
GRANT ALL ON public.woocommerce_orders TO service_role;

DROP POLICY IF EXISTS "Authenticated users can view their own orders" ON public.woocommerce_orders;
CREATE POLICY "Authenticated users can view their own orders"
ON public.woocommerce_orders
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR lower(coalesce(billing ->> 'email', '')) = lower(coalesce(
    (SELECT email FROM auth.users WHERE id = auth.uid()),
    ''
  ))
);