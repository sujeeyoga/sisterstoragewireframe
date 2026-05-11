
-- Convert product_ids from text[] to bigint[]
ALTER TABLE public.shop_sections ALTER COLUMN product_ids TYPE bigint[] USING product_ids::bigint[];
ALTER TABLE public.flash_sales ALTER COLUMN product_ids TYPE bigint[] USING product_ids::bigint[];

-- Customer list view (admin only via security_invoker)
CREATE OR REPLACE VIEW public.customer_list
WITH (security_invoker = true) AS
SELECT
  customer_email,
  COALESCE(MAX(customer_name), '') AS customer_name,
  COALESCE(MAX(customer_phone), '') AS customer_phone,
  COUNT(*)::bigint AS order_count,
  COALESCE(SUM(total), 0)::numeric AS total_spent,
  MAX(created_at) AS last_order_date,
  MIN(created_at) AS first_order_date
FROM public.orders
WHERE has_role(auth.uid(), 'admin')
GROUP BY customer_email;

GRANT SELECT ON public.customer_list TO authenticated;
