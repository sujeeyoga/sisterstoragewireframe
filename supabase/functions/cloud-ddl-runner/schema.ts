export default `
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public."abandoned_carts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text,
  "cart_items" jsonb,
  "subtotal" numeric,
  "created_at" timestamptz DEFAULT now(),
  "reminder_sent_at" timestamptz,
  "recovered_at" timestamptz,
  "session_id" text,
  "closed_at" timestamptz
);

CREATE TABLE public."active_carts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" text,
  "visitor_id" text,
  "email" text,
  "cart_items" jsonb,
  "subtotal" numeric,
  "last_updated" timestamptz,
  "created_at" timestamptz DEFAULT now(),
  "converted_at" timestamptz
);

CREATE TABLE public."customer_profiles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "phone" text,
  "email" text,
  "first_name" text,
  "last_name" text,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."email_campaigns" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" timestamptz DEFAULT now(),
  "sent_at" timestamptz,
  "created_by" uuid,
  "campaign_name" text,
  "email_type" text,
  "subject" text,
  "preview_text" text,
  "template_data" jsonb,
  "recipient_count" integer,
  "sent_count" integer,
  "failed_count" integer,
  "status" text
);

CREATE TABLE public."email_logs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "created_at" timestamptz DEFAULT now(),
  "order_id" uuid,
  "recipient_email" text,
  "email_type" text,
  "subject" text,
  "sent_successfully" boolean,
  "error_message" text,
  "email_data" jsonb,
  "sent_by" uuid,
  "campaign_id" uuid
);

CREATE TABLE public."flash_sales" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text,
  "description" text,
  "discount_type" text,
  "discount_value" numeric,
  "applies_to" text,
  "product_ids" bigint[],
  "category_slugs" text[],
  "starts_at" timestamptz,
  "ends_at" timestamptz,
  "enabled" boolean,
  "priority" integer,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "created_by" uuid
);

CREATE TABLE public."hero_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "image_url" text,
  "position" text,
  "display_order" integer,
  "is_active" boolean,
  "alt_text" text,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."keyword_rankings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "keyword" text,
  "page_path" text,
  "position" integer,
  "search_volume" integer,
  "difficulty" integer,
  "tracked_at" timestamptz,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE public."launch_cards" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "collection_name" text,
  "tagline" text,
  "description" text,
  "launch_date" date,
  "status" text,
  "waitlist_link" text,
  "preview_link" text,
  "cta_label" text,
  "gradient_c1" text,
  "gradient_c2" text,
  "gradient_c3" text,
  "shimmer_speed" numeric,
  "blur_level" numeric,
  "priority" integer,
  "enabled" boolean,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."orders" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "stripe_session_id" text,
  "customer_email" text,
  "customer_name" text,
  "order_number" text,
  "items" jsonb,
  "subtotal" numeric,
  "shipping" numeric,
  "tax" numeric,
  "total" numeric,
  "shipping_address" jsonb,
  "status" text,
  "payment_status" text,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "tracking_number" text,
  "stallion_shipment_id" text,
  "fulfillment_status" text,
  "fulfilled_at" timestamptz,
  "shipping_label_url" text,
  "shipping_notification_sent_at" timestamptz,
  "refund_amount" numeric,
  "archived_at" timestamptz,
  "stripe_payment_intent_id" text,
  "stallion_cost" numeric,
  "carrier_name" text,
  "carrier_cost_currency" text,
  "shipping_metadata" jsonb,
  "customer_phone" text,
  "chitchats_shipment_id" text
);

CREATE TABLE public."page_content" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "page_slug" text,
  "section_key" text,
  "title" text,
  "subtitle" text,
  "description" text,
  "button_text" text,
  "video_url" text,
  "image_url" text,
  "display_order" integer,
  "enabled" boolean,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."page_performance" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "page_path" text,
  "load_time_ms" integer,
  "first_contentful_paint_ms" integer,
  "largest_contentful_paint_ms" integer,
  "cumulative_layout_shift" numeric,
  "time_to_interactive_ms" integer,
  "seo_score" integer,
  "accessibility_score" integer,
  "performance_score" integer,
  "recorded_at" timestamptz,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE public."product_reviews" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "product_id" integer,
  "order_id" uuid,
  "customer_email" text,
  "customer_name" text,
  "rating" integer,
  "review_title" text,
  "review_text" text,
  "status" text,
  "approved_by" uuid,
  "approved_at" timestamptz,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "helpful_count" integer,
  "verified_purchase" boolean
);

CREATE TABLE public."qr_codes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "short_code" text,
  "name" text,
  "destination_url" text,
  "created_by" uuid,
  "scan_count" integer,
  "is_active" boolean,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."qr_scans" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "qr_code_id" uuid,
  "scanned_at" timestamptz,
  "user_agent" text,
  "referrer" text,
  "ip_hash" text
);

CREATE TABLE public."refunds" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "order_id" uuid,
  "stripe_refund_id" text,
  "amount" numeric,
  "reason" text,
  "notes" text,
  "processed_by" uuid,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "refund_type" text
);

CREATE TABLE public."seo_analytics" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "page_path" text,
  "page_title" text,
  "meta_description" text,
  "keywords" text[],
  "impressions" integer,
  "clicks" integer,
  "ctr" numeric,
  "avg_position" numeric,
  "traffic_source" text,
  "device_type" text,
  "country" text,
  "recorded_at" timestamptz,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."shipping_fallback_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "fallback_rate" numeric,
  "fallback_method_name" text,
  "enabled" boolean,
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."shipping_zone_rates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "zone_id" uuid,
  "method_name" text,
  "rate_type" text,
  "rate_amount" numeric,
  "free_threshold" numeric,
  "enabled" boolean,
  "display_order" integer,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."shipping_zone_rules" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "zone_id" uuid,
  "rule_type" text,
  "rule_value" text,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE public."shipping_zones" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text,
  "description" text,
  "priority" integer,
  "enabled" boolean,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."shop_sections" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text,
  "title" text,
  "subtitle" text,
  "background_color" text,
  "display_order" integer,
  "visible" boolean,
  "layout_columns" integer,
  "category_filter" text,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "product_ids" integer[]
);

CREATE TABLE public."sister_stories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text,
  "author" text,
  "description" text,
  "video_url" text,
  "video_path" text,
  "thumbnail_url" text,
  "display_order" integer,
  "is_active" boolean,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."site_texts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "section_key" text,
  "title" text,
  "subtitle" text,
  "description" text,
  "button_text" text,
  "enabled" boolean,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."store_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "setting_key" text,
  "setting_value" jsonb,
  "enabled" boolean,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."tariff_rates" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "country_code" text,
  "country_name" text,
  "tariff_percentage" numeric,
  "customs_fee" numeric,
  "broker_fee" numeric,
  "notes" text,
  "effective_date" timestamptz,
  "updated_at" timestamptz DEFAULT now(),
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE public."uploaded_images" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "file_name" text,
  "file_path" text,
  "file_size" integer,
  "original_size" integer,
  "mime_type" text,
  "width" integer,
  "height" integer,
  "uploaded_by" uuid,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "folder_path" text
);

CREATE TABLE public."uploaded_videos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "file_name" text,
  "file_path" text,
  "file_size" integer,
  "mime_type" text,
  "duration" numeric,
  "width" integer,
  "height" integer,
  "folder_path" text,
  "uploaded_by" uuid,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."user_roles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid,
  "role" public.app_role,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE public."visitor_analytics" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "session_id" text,
  "visitor_id" text,
  "ip_hash" text,
  "country" text,
  "country_name" text,
  "region" text,
  "city" text,
  "page_path" text,
  "referrer" text,
  "user_agent" text,
  "visited_at" timestamptz,
  "session_start" timestamptz,
  "session_end" timestamptz,
  "duration_seconds" integer,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."waitlist_signups" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text,
  "name" text,
  "collection_name" text,
  "created_at" timestamptz DEFAULT now()
);

CREATE TABLE public."woocommerce_customers" (
  "id" bigint PRIMARY KEY,
  "user_id" uuid,
  "email" text,
  "first_name" text,
  "last_name" text,
  "billing" jsonb,
  "shipping" jsonb,
  "orders_count" integer,
  "total_spent" numeric,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);

CREATE TABLE public."woocommerce_orders" (
  "id" bigint PRIMARY KEY,
  "user_id" uuid,
  "status" text,
  "total" numeric,
  "currency" text,
  "billing" jsonb,
  "shipping" jsonb,
  "line_items" jsonb,
  "meta_data" jsonb,
  "date_created" timestamptz,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "fulfillment_status" text,
  "refund_amount" numeric,
  "tracking_number" text,
  "shipping_label_url" text,
  "fulfilled_at" timestamptz,
  "shipping_notification_sent_at" timestamptz,
  "stallion_shipment_id" text,
  "archived_at" timestamptz,
  "stallion_cost" numeric,
  "carrier_name" text,
  "carrier_cost_currency" text,
  "shipping_metadata" jsonb,
  "chitchats_shipment_id" text
);

CREATE TABLE public."woocommerce_products" (
  "id" bigint PRIMARY KEY,
  "name" text,
  "slug" text,
  "description" text,
  "short_description" text,
  "price" numeric,
  "regular_price" numeric,
  "sale_price" numeric,
  "stock_quantity" integer,
  "manage_stock" boolean,
  "in_stock" boolean,
  "images" jsonb,
  "categories" jsonb,
  "attributes" jsonb,
  "meta_data" jsonb,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now(),
  "synced_at" timestamptz,
  "visible" boolean,
  "weight" numeric,
  "length" numeric,
  "width" numeric,
  "height" numeric,
  "package_value" numeric
);

CREATE TABLE public."woocommerce_sync_log" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "sync_type" text,
  "status" text,
  "message" text,
  "records_processed" integer,
  "created_at" timestamptz DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public."abandoned_carts" TO authenticated;

GRANT ALL ON public."abandoned_carts" TO service_role;

GRANT SELECT, INSERT, UPDATE ON public."abandoned_carts" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."active_carts" TO authenticated;

GRANT ALL ON public."active_carts" TO service_role;

GRANT SELECT, INSERT, UPDATE ON public."active_carts" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."customer_profiles" TO authenticated;

GRANT ALL ON public."customer_profiles" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."email_campaigns" TO authenticated;

GRANT ALL ON public."email_campaigns" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."email_logs" TO authenticated;

GRANT ALL ON public."email_logs" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."flash_sales" TO authenticated;

GRANT ALL ON public."flash_sales" TO service_role;

GRANT SELECT ON public."flash_sales" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."hero_images" TO authenticated;

GRANT ALL ON public."hero_images" TO service_role;

GRANT SELECT ON public."hero_images" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."keyword_rankings" TO authenticated;

GRANT ALL ON public."keyword_rankings" TO service_role;

GRANT INSERT ON public."keyword_rankings" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."launch_cards" TO authenticated;

GRANT ALL ON public."launch_cards" TO service_role;

GRANT SELECT ON public."launch_cards" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."orders" TO authenticated;

GRANT ALL ON public."orders" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."page_content" TO authenticated;

GRANT ALL ON public."page_content" TO service_role;

GRANT SELECT ON public."page_content" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."page_performance" TO authenticated;

GRANT ALL ON public."page_performance" TO service_role;

GRANT INSERT ON public."page_performance" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."product_reviews" TO authenticated;

GRANT ALL ON public."product_reviews" TO service_role;

GRANT SELECT ON public."product_reviews" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."qr_codes" TO authenticated;

GRANT ALL ON public."qr_codes" TO service_role;

GRANT SELECT ON public."qr_codes" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."qr_scans" TO authenticated;

GRANT ALL ON public."qr_scans" TO service_role;

GRANT INSERT ON public."qr_scans" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."refunds" TO authenticated;

GRANT ALL ON public."refunds" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."seo_analytics" TO authenticated;

GRANT ALL ON public."seo_analytics" TO service_role;

GRANT INSERT ON public."seo_analytics" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."shipping_fallback_settings" TO authenticated;

GRANT ALL ON public."shipping_fallback_settings" TO service_role;

GRANT SELECT ON public."shipping_fallback_settings" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."shipping_zone_rates" TO authenticated;

GRANT ALL ON public."shipping_zone_rates" TO service_role;

GRANT SELECT ON public."shipping_zone_rates" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."shipping_zone_rules" TO authenticated;

GRANT ALL ON public."shipping_zone_rules" TO service_role;

GRANT SELECT ON public."shipping_zone_rules" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."shipping_zones" TO authenticated;

GRANT ALL ON public."shipping_zones" TO service_role;

GRANT SELECT ON public."shipping_zones" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."shop_sections" TO authenticated;

GRANT ALL ON public."shop_sections" TO service_role;

GRANT SELECT ON public."shop_sections" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."sister_stories" TO authenticated;

GRANT ALL ON public."sister_stories" TO service_role;

GRANT SELECT ON public."sister_stories" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."site_texts" TO authenticated;

GRANT ALL ON public."site_texts" TO service_role;

GRANT SELECT ON public."site_texts" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."store_settings" TO authenticated;

GRANT ALL ON public."store_settings" TO service_role;

GRANT SELECT ON public."store_settings" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."tariff_rates" TO authenticated;

GRANT ALL ON public."tariff_rates" TO service_role;

GRANT SELECT ON public."tariff_rates" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."uploaded_images" TO authenticated;

GRANT ALL ON public."uploaded_images" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."uploaded_videos" TO authenticated;

GRANT ALL ON public."uploaded_videos" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."user_roles" TO authenticated;

GRANT ALL ON public."user_roles" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."visitor_analytics" TO authenticated;

GRANT ALL ON public."visitor_analytics" TO service_role;

GRANT SELECT, INSERT, UPDATE ON public."visitor_analytics" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."waitlist_signups" TO authenticated;

GRANT ALL ON public."waitlist_signups" TO service_role;

GRANT INSERT ON public."waitlist_signups" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."woocommerce_customers" TO authenticated;

GRANT ALL ON public."woocommerce_customers" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."woocommerce_orders" TO authenticated;

GRANT ALL ON public."woocommerce_orders" TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."woocommerce_products" TO authenticated;

GRANT ALL ON public."woocommerce_products" TO service_role;

GRANT SELECT ON public."woocommerce_products" TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public."woocommerce_sync_log" TO authenticated;

GRANT ALL ON public."woocommerce_sync_log" TO service_role;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

ALTER TABLE public."abandoned_carts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."abandoned_carts" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can track" ON public."abandoned_carts" FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public."active_carts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."active_carts" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can track" ON public."active_carts" FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public."customer_profiles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."customer_profiles" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."email_campaigns" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."email_campaigns" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."email_logs" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."email_logs" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."flash_sales" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."flash_sales" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."flash_sales" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."hero_images" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."hero_images" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."hero_images" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."keyword_rankings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."keyword_rankings" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit" ON public."keyword_rankings" FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE public."launch_cards" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."launch_cards" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."launch_cards" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."orders" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."orders" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."page_content" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."page_content" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."page_content" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."page_performance" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."page_performance" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit" ON public."page_performance" FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE public."product_reviews" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."product_reviews" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."product_reviews" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."qr_codes" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."qr_codes" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."qr_codes" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."qr_scans" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."qr_scans" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit" ON public."qr_scans" FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE public."refunds" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."refunds" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."seo_analytics" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."seo_analytics" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit" ON public."seo_analytics" FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE public."shipping_fallback_settings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."shipping_fallback_settings" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."shipping_fallback_settings" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."shipping_zone_rates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."shipping_zone_rates" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."shipping_zone_rates" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."shipping_zone_rules" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."shipping_zone_rules" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."shipping_zone_rules" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."shipping_zones" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."shipping_zones" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."shipping_zones" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."shop_sections" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."shop_sections" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."shop_sections" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."sister_stories" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."sister_stories" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."sister_stories" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."site_texts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."site_texts" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."site_texts" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."store_settings" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."store_settings" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."store_settings" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."tariff_rates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."tariff_rates" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."tariff_rates" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."uploaded_images" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."uploaded_images" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."uploaded_videos" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."uploaded_videos" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."user_roles" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."user_roles" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."visitor_analytics" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."visitor_analytics" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can track" ON public."visitor_analytics" FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

ALTER TABLE public."waitlist_signups" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."waitlist_signups" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit" ON public."waitlist_signups" FOR INSERT TO anon, authenticated WITH CHECK (true);

ALTER TABLE public."woocommerce_customers" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."woocommerce_customers" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."woocommerce_orders" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."woocommerce_orders" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public."woocommerce_products" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."woocommerce_products" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read access" ON public."woocommerce_products" FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public."woocommerce_sync_log" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access" ON public."woocommerce_sync_log" FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_customer_profiles_updated_at BEFORE UPDATE ON public."customer_profiles" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flash_sales_updated_at BEFORE UPDATE ON public."flash_sales" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON public."hero_images" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_launch_cards_updated_at BEFORE UPDATE ON public."launch_cards" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public."orders" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at BEFORE UPDATE ON public."page_content" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON public."product_reviews" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON public."qr_codes" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON public."refunds" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seo_analytics_updated_at BEFORE UPDATE ON public."seo_analytics" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_fallback_settings_updated_at BEFORE UPDATE ON public."shipping_fallback_settings" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_zone_rates_updated_at BEFORE UPDATE ON public."shipping_zone_rates" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_zones_updated_at BEFORE UPDATE ON public."shipping_zones" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shop_sections_updated_at BEFORE UPDATE ON public."shop_sections" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sister_stories_updated_at BEFORE UPDATE ON public."sister_stories" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_texts_updated_at BEFORE UPDATE ON public."site_texts" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at BEFORE UPDATE ON public."store_settings" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tariff_rates_updated_at BEFORE UPDATE ON public."tariff_rates" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_uploaded_images_updated_at BEFORE UPDATE ON public."uploaded_images" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_uploaded_videos_updated_at BEFORE UPDATE ON public."uploaded_videos" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visitor_analytics_updated_at BEFORE UPDATE ON public."visitor_analytics" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_woocommerce_customers_updated_at BEFORE UPDATE ON public."woocommerce_customers" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_woocommerce_orders_updated_at BEFORE UPDATE ON public."woocommerce_orders" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_woocommerce_products_updated_at BEFORE UPDATE ON public."woocommerce_products" FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE VIEW public.customer_list WITH (security_invoker = true) AS
SELECT customer_email,
       max(customer_name) AS customer_name,
       count(*)::bigint AS order_count,
       sum(total) AS total_spent,
       max(created_at) AS last_order_date,
       min(created_at) AS first_order_date
FROM public.orders
GROUP BY customer_email;
GRANT SELECT ON public.customer_list TO authenticated;
GRANT ALL ON public.customer_list TO service_role;
`;
