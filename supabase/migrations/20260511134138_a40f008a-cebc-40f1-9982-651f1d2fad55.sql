
-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.refund_type AS ENUM ('stripe', 'manual', 'store_credit');

-- ============================================
-- UTILITY FUNCTION (timestamps)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ============================================
-- USER ROLES (must come before has_role)
-- ============================================
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete admin roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- ADMIN MANAGEMENT FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.add_admin_by_email(user_email text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_user_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can add admin users'; END IF;
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email LIMIT 1;
  IF target_user_id IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'User not found with email: ' || user_email); END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'User is already an admin');
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, 'admin');
  RETURN jsonb_build_object('success', true, 'message', 'Admin role added successfully', 'user_id', target_user_id);
END; $$;

CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE(id uuid, user_id uuid, role app_role, email text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can view admin users'; END IF;
  RETURN QUERY
  SELECT ur.id, ur.user_id, ur.role, au.email::text, ur.created_at
  FROM public.user_roles ur INNER JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin' ORDER BY ur.created_at DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.remove_admin_role(target_user_id uuid, delete_user boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target_role_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Only admins can remove admin users'; END IF;
  IF target_user_id = auth.uid() THEN RAISE EXCEPTION 'Cannot remove your own admin role'; END IF;
  SELECT id INTO target_role_id FROM public.user_roles WHERE user_id = target_user_id AND role = 'admin' LIMIT 1;
  IF target_role_id IS NULL THEN RETURN jsonb_build_object('success', false, 'error', 'User is not an admin'); END IF;
  DELETE FROM public.user_roles WHERE id = target_role_id;
  RETURN jsonb_build_object('success', true, 'message', 'Admin role removed successfully', 'user_id', target_user_id);
END; $$;

-- ============================================
-- WOOCOMMERCE TABLES
-- ============================================
CREATE TABLE public.woocommerce_products (
  id bigint PRIMARY KEY,
  name text NOT NULL, slug text NOT NULL,
  description text, short_description text,
  price numeric, regular_price numeric, sale_price numeric,
  stock_quantity integer, manage_stock boolean DEFAULT false, in_stock boolean DEFAULT true,
  images jsonb DEFAULT '[]'::jsonb, categories jsonb DEFAULT '[]'::jsonb,
  attributes jsonb DEFAULT '[]'::jsonb, meta_data jsonb DEFAULT '{}'::jsonb,
  weight numeric, length numeric, width numeric, height numeric, package_value numeric,
  visible boolean NOT NULL DEFAULT true,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.woocommerce_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view visible products" ON public.woocommerce_products FOR SELECT USING (visible = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage products" ON public.woocommerce_products FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.woocommerce_customers (
  id bigint PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL, first_name text, last_name text,
  billing jsonb DEFAULT '{}'::jsonb, shipping jsonb DEFAULT '{}'::jsonb,
  orders_count integer DEFAULT 0, total_spent numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.woocommerce_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins have full access" ON public.woocommerce_customers FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view their own customer data" ON public.woocommerce_customers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own customer data" ON public.woocommerce_customers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own customer data" ON public.woocommerce_customers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own customer data" ON public.woocommerce_customers FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.woocommerce_orders (
  id bigint PRIMARY KEY,
  user_id uuid,
  status text NOT NULL, currency text DEFAULT 'USD', total numeric,
  billing jsonb DEFAULT '{}'::jsonb, shipping jsonb DEFAULT '{}'::jsonb,
  line_items jsonb DEFAULT '[]'::jsonb, meta_data jsonb DEFAULT '{}'::jsonb,
  date_created timestamptz,
  fulfillment_status text NOT NULL DEFAULT 'unfulfilled', fulfilled_at timestamptz,
  tracking_number text, shipping_label_url text, shipping_notification_sent_at timestamptz,
  stallion_shipment_id text, stallion_cost numeric, carrier_name text, carrier_cost_currency text DEFAULT 'CAD',
  shipping_metadata jsonb DEFAULT '{}'::jsonb, chitchats_shipment_id text,
  refund_amount numeric DEFAULT 0, archived_at timestamptz,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.woocommerce_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all public access to orders" ON public.woocommerce_orders FOR ALL TO anon USING (false);
CREATE POLICY "Admins can view all orders" ON public.woocommerce_orders FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all orders" ON public.woocommerce_orders FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can view their own orders" ON public.woocommerce_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can create their own orders" ON public.woocommerce_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authenticated users can update their own orders" ON public.woocommerce_orders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STRIPE ORDERS
-- ============================================
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL,
  stripe_session_id text NOT NULL, stripe_payment_intent_id text,
  customer_email text NOT NULL, customer_name text, customer_phone text,
  status text NOT NULL DEFAULT 'pending', payment_status text NOT NULL DEFAULT 'pending',
  fulfillment_status text NOT NULL DEFAULT 'unfulfilled', fulfilled_at timestamptz,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL, tax numeric DEFAULT 0, shipping numeric DEFAULT 0, total numeric NOT NULL,
  shipping_address jsonb,
  tracking_number text, shipping_label_url text, shipping_notification_sent_at timestamptz,
  stallion_shipment_id text, stallion_cost numeric, carrier_name text, carrier_cost_currency text DEFAULT 'CAD',
  shipping_metadata jsonb DEFAULT '{}'::jsonb, chitchats_shipment_id text,
  refund_amount numeric DEFAULT 0, archived_at timestamptz,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny public read access to orders" ON public.orders FOR SELECT TO anon USING (false);
CREATE POLICY "Admin full access to orders" ON public.orders FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Customers can view their own orders by phone" ON public.orders FOR SELECT TO authenticated
USING (customer_phone = ((auth.jwt() -> 'user_metadata') ->> 'phone') OR customer_email = auth.email());

-- order triggers
CREATE OR REPLACE FUNCTION public.sync_order_fulfillment_status()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.fulfillment_status != 'fulfilled' THEN NEW.fulfillment_status := 'fulfilled'; END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.auto_set_fulfilled_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.fulfillment_status = 'fulfilled' AND OLD.fulfillment_status != 'fulfilled' THEN NEW.fulfilled_at := NOW(); END IF;
  IF NEW.fulfillment_status != 'fulfilled' AND OLD.fulfillment_status = 'fulfilled' THEN NEW.fulfilled_at := NULL; END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.validate_order_status_transition()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF OLD.status IN ('completed', 'cancelled') AND NEW.status = 'pending' THEN
    RAISE EXCEPTION 'Cannot change order status from % to pending', OLD.status; END IF;
  IF OLD.status = 'completed' AND NEW.status = 'processing' THEN
    RAISE EXCEPTION 'Cannot change completed order back to processing'; END IF;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.get_duplicate_order_numbers()
RETURNS TABLE(order_number text, count bigint) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY SELECT o.order_number, COUNT(*)::bigint FROM public.orders o GROUP BY o.order_number HAVING COUNT(*) > 1 ORDER BY 2 DESC;
END; $$;

CREATE TRIGGER orders_sync_fulfillment BEFORE INSERT OR UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.sync_order_fulfillment_status();
CREATE TRIGGER orders_auto_fulfilled_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.auto_set_fulfilled_at();
CREATE TRIGGER orders_validate_status BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.validate_order_status_transition();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER woo_orders_auto_fulfilled_at BEFORE UPDATE ON public.woocommerce_orders FOR EACH ROW EXECUTE FUNCTION public.auto_set_fulfilled_at();

-- ============================================
-- CUSTOMER PROFILES
-- ============================================
CREATE TABLE public.customer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL, email text, first_name text, last_name text,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own profile" ON public.customer_profiles FOR SELECT TO authenticated
USING (phone = (SELECT (raw_user_meta_data ->> 'phone') FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "Customers can insert own profile" ON public.customer_profiles FOR INSERT TO authenticated
WITH CHECK (phone = (SELECT (raw_user_meta_data ->> 'phone') FROM auth.users WHERE id = auth.uid()));
CREATE POLICY "Customers can update own profile" ON public.customer_profiles FOR UPDATE TO authenticated
USING (phone = (SELECT (raw_user_meta_data ->> 'phone') FROM auth.users WHERE id = auth.uid()));

-- ============================================
-- CONTENT TABLES
-- ============================================
CREATE TABLE public.shop_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, subtitle text, name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0, layout_columns integer DEFAULT 3,
  background_color text DEFAULT 'bg-background',
  category_filter text, product_ids text[],
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.shop_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view visible sections" ON public.shop_sections FOR SELECT USING (visible = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage sections" ON public.shop_sections FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.hero_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL, alt_text text, position text NOT NULL,
  display_order integer NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active hero images" ON public.hero_images FOR SELECT USING (is_active = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage hero images" ON public.hero_images FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.launch_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_name text NOT NULL, tagline text, description text,
  launch_date date, status text DEFAULT 'upcoming',
  cta_label text DEFAULT 'Join the Waitlist',
  preview_link text, waitlist_link text,
  gradient_c1 text DEFAULT '#FFB7C5', gradient_c2 text DEFAULT '#FFD6E0', gradient_c3 text DEFAULT '#FFF5F8',
  blur_level numeric DEFAULT 55, shimmer_speed numeric DEFAULT 18,
  enabled boolean DEFAULT true, priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.launch_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view enabled upcoming cards" ON public.launch_cards FOR SELECT USING ((enabled = true AND status = 'upcoming') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage launch cards" ON public.launch_cards FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.sister_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, author text NOT NULL, description text,
  video_url text NOT NULL, video_path text NOT NULL, thumbnail_url text,
  display_order integer DEFAULT 0, is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.sister_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sister stories are publicly viewable" ON public.sister_stories FOR SELECT USING (is_active = true OR (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')));
CREATE POLICY "Only admins can insert sister stories" ON public.sister_stories FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update sister stories" ON public.sister_stories FOR UPDATE USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete sister stories" ON public.sister_stories FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL, title text, subtitle text, description text, button_text text,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site texts are publicly viewable" ON public.site_texts FOR SELECT USING (enabled = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can insert site texts" ON public.site_texts FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update site texts" ON public.site_texts FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete site texts" ON public.site_texts FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text NOT NULL, section_key text NOT NULL,
  title text, subtitle text, description text, button_text text,
  video_url text, image_url text,
  display_order integer NOT NULL DEFAULT 0, enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view enabled page content" ON public.page_content FOR SELECT USING (enabled = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage page content" ON public.page_content FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Store settings are readable by everyone" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage store settings" ON public.store_settings FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============================================
-- PROMOTIONS
-- ============================================
CREATE TABLE public.flash_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, description text,
  discount_type text NOT NULL, discount_value numeric NOT NULL,
  applies_to text NOT NULL DEFAULT 'all',
  product_ids text[], category_slugs text[],
  starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL,
  enabled boolean DEFAULT true, priority integer DEFAULT 0,
  created_by uuid,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.flash_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active flash sales" ON public.flash_sales FOR SELECT USING ((enabled = true AND starts_at <= now() AND ends_at >= now()) OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage flash sales" ON public.flash_sales FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- SHIPPING
-- ============================================
CREATE TABLE public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, description text,
  enabled boolean NOT NULL DEFAULT true, priority integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view enabled zones" ON public.shipping_zones FOR SELECT USING (enabled = true OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage zones" ON public.shipping_zones FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.shipping_zone_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  method_name text NOT NULL, rate_type text NOT NULL,
  rate_amount numeric NOT NULL DEFAULT 0, free_threshold numeric,
  enabled boolean NOT NULL DEFAULT true, display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shipping_zone_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rates for enabled zones" ON public.shipping_zone_rates FOR SELECT
USING (EXISTS (SELECT 1 FROM shipping_zones WHERE id = shipping_zone_rates.zone_id AND (enabled = true OR has_role(auth.uid(), 'admin'))));
CREATE POLICY "Admins can manage zone rates" ON public.shipping_zone_rates FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.shipping_zone_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid NOT NULL REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  rule_type text NOT NULL, rule_value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shipping_zone_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view rules for enabled zones" ON public.shipping_zone_rules FOR SELECT
USING (EXISTS (SELECT 1 FROM shipping_zones WHERE id = shipping_zone_rules.zone_id AND (enabled = true OR has_role(auth.uid(), 'admin'))));
CREATE POLICY "Admins can manage zone rules" ON public.shipping_zone_rules FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.shipping_fallback_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fallback_method_name text NOT NULL, fallback_rate numeric NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shipping_fallback_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view fallback settings" ON public.shipping_fallback_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage fallback settings" ON public.shipping_fallback_settings FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.tariff_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code text NOT NULL, country_name text NOT NULL,
  tariff_percentage numeric NOT NULL DEFAULT 0,
  customs_fee numeric DEFAULT 0, broker_fee numeric DEFAULT 0,
  effective_date timestamptz NOT NULL DEFAULT now(), notes text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tariff_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view tariff rates" ON public.tariff_rates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage tariff rates" ON public.tariff_rates FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE public.product_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id integer NOT NULL, order_id uuid,
  customer_email text NOT NULL, customer_name text NOT NULL,
  rating integer NOT NULL, review_title text, review_text text NOT NULL,
  verified_purchase boolean DEFAULT false, helpful_count integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  approved_at timestamptz, approved_by uuid,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved reviews are publicly visible" ON public.product_reviews FOR SELECT USING (status = 'approved' OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can submit reviews" ON public.product_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update reviews" ON public.product_reviews FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.product_reviews FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_product_reviews_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER product_reviews_updated_at BEFORE UPDATE ON public.product_reviews FOR EACH ROW EXECUTE FUNCTION public.update_product_reviews_updated_at();

-- ============================================
-- EMAIL
-- ============================================
CREATE TABLE public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name text NOT NULL, email_type text NOT NULL,
  subject text NOT NULL, preview_text text, template_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text DEFAULT 'draft',
  recipient_count integer DEFAULT 0, sent_count integer DEFAULT 0, failed_count integer DEFAULT 0,
  sent_at timestamptz, created_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage email campaigns" ON public.email_campaigns FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid, order_id uuid,
  email_type text NOT NULL, recipient_email text NOT NULL, subject text,
  email_data jsonb DEFAULT '{}'::jsonb,
  sent_successfully boolean DEFAULT true, error_message text,
  sent_by uuid,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view email logs" ON public.email_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Service role can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (true);

-- ============================================
-- ANALYTICS / CARTS
-- ============================================
CREATE TABLE public.visitor_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL, session_id text NOT NULL,
  ip_hash text, country text, country_name text, region text, city text,
  page_path text NOT NULL, referrer text, user_agent text,
  visited_at timestamptz NOT NULL DEFAULT now(),
  session_start timestamptz NOT NULL DEFAULT now(), session_end timestamptz,
  duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all visitor analytics" ON public.visitor_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert visitor analytics" ON public.visitor_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update visitor analytics" ON public.visitor_analytics FOR UPDATE USING (true);

CREATE OR REPLACE FUNCTION public.delete_old_visitor_analytics()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN DELETE FROM public.visitor_analytics WHERE visited_at < NOW() - INTERVAL '90 days'; END;
$$;

CREATE TABLE public.active_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL, visitor_id text, email text,
  cart_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  last_updated timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.active_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage active carts by session" ON public.active_carts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admins can view all active carts" ON public.active_carts FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.cleanup_old_active_carts()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN DELETE FROM public.active_carts WHERE last_updated < NOW() - INTERVAL '24 hours' AND converted_at IS NULL; END;
$$;

CREATE TABLE public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL, email text NOT NULL,
  cart_items jsonb NOT NULL DEFAULT '[]'::jsonb, subtotal numeric NOT NULL,
  reminder_sent_at timestamptz, recovered_at timestamptz, closed_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can view abandoned carts" ON public.abandoned_carts FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update abandoned carts" ON public.abandoned_carts FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete abandoned carts" ON public.abandoned_carts FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Valid sessions can create abandoned carts" ON public.abandoned_carts FOR INSERT
WITH CHECK (session_id IS NOT NULL AND email IS NOT NULL AND EXISTS (SELECT 1 FROM visitor_analytics WHERE session_id = abandoned_carts.session_id AND created_at > now() - interval '1 hour'));

-- ============================================
-- SEO
-- ============================================
CREATE TABLE public.seo_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL, page_title text, meta_description text,
  keywords text[],
  clicks integer DEFAULT 0, ctr numeric DEFAULT 0, avg_position numeric DEFAULT 0, impressions integer DEFAULT 0,
  traffic_source text, device_type text, country text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.seo_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all SEO analytics" ON public.seo_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert SEO analytics" ON public.seo_analytics FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update SEO analytics" ON public.seo_analytics FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete SEO analytics" ON public.seo_analytics FOR DELETE USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.keyword_rankings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL, page_path text NOT NULL, position integer NOT NULL,
  search_volume integer DEFAULT 0, difficulty integer DEFAULT 0,
  tracked_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.keyword_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage keyword rankings" ON public.keyword_rankings FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TABLE public.page_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  load_time_ms integer, first_contentful_paint_ms integer, largest_contentful_paint_ms integer,
  cumulative_layout_shift numeric, time_to_interactive_ms integer,
  seo_score integer, accessibility_score integer, performance_score integer,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.page_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage page performance" ON public.page_performance FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============================================
-- QR
-- ============================================
CREATE TABLE public.qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_code text NOT NULL UNIQUE, name text NOT NULL,
  destination_url text NOT NULL, scan_count integer DEFAULT 0,
  is_active boolean DEFAULT true, created_by uuid,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active QR codes" ON public.qr_codes FOR SELECT USING (is_active = true OR (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin')));
CREATE POLICY "Admins can manage QR codes" ON public.qr_codes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.qr_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  qr_code_id uuid REFERENCES public.qr_codes(id) ON DELETE CASCADE,
  ip_hash text, user_agent text, referrer text,
  scanned_at timestamptz DEFAULT now()
);
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view scans" ON public.qr_scans FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Service role can insert scans" ON public.qr_scans FOR INSERT WITH CHECK (true);

-- ============================================
-- REFUNDS
-- ============================================
CREATE TABLE public.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL, stripe_refund_id text NOT NULL,
  amount numeric NOT NULL, reason text, notes text,
  refund_type refund_type NOT NULL DEFAULT 'stripe',
  processed_by uuid,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage refunds" ON public.refunds FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============================================
-- UPLOADS
-- ============================================
CREATE TABLE public.uploaded_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL, file_path text NOT NULL, mime_type text NOT NULL,
  file_size integer NOT NULL, original_size integer NOT NULL,
  width integer, height integer, folder_path text, uploaded_by uuid,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Images metadata is publicly viewable" ON public.uploaded_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Only admins can insert uploaded images metadata" ON public.uploaded_images FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update uploaded images metadata" ON public.uploaded_images FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete uploaded images metadata" ON public.uploaded_images FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TABLE public.uploaded_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL, file_path text NOT NULL, mime_type text NOT NULL,
  file_size integer NOT NULL, duration numeric,
  width integer, height integer, folder_path text, uploaded_by uuid,
  created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.uploaded_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Videos metadata is publicly viewable" ON public.uploaded_videos FOR SELECT USING (true);
CREATE POLICY "Only admins can insert uploaded videos metadata" ON public.uploaded_videos FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update uploaded videos metadata" ON public.uploaded_videos FOR UPDATE USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete uploaded videos metadata" ON public.uploaded_videos FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- WAITLIST
-- ============================================
CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_name text NOT NULL, name text NOT NULL, email text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can sign up for waitlist" ON public.waitlist_signups FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all waitlist signups" ON public.waitlist_signups FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete waitlist signups" ON public.waitlist_signups FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- ============================================
-- WOOCOMMERCE SYNC LOG
-- ============================================
CREATE TABLE public.woocommerce_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type text NOT NULL, status text NOT NULL,
  records_processed integer DEFAULT 0,
  message text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.woocommerce_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage sync log" ON public.woocommerce_sync_log FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- ============================================
-- NEW USER -> WOOCOMMERCE CUSTOMER TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.create_woocommerce_customer_on_signup()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.woocommerce_customers (id, user_id, email, first_name, last_name, billing, shipping)
  VALUES (
    (EXTRACT(EPOCH FROM NOW() AT TIME ZONE 'UTC') * 1000)::bigint,
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    '{}'::jsonb, '{}'::jsonb
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created_create_wc_customer
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_woocommerce_customer_on_signup();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('sister', 'sister', true), ('images', 'images', true), ('videos', 'videos', true);

CREATE POLICY "Public read sister" ON storage.objects FOR SELECT USING (bucket_id = 'sister');
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public read videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Admins manage sister" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'sister' AND has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'sister' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage images" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'images' AND has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage videos" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'videos' AND has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'videos' AND has_role(auth.uid(), 'admin'));
