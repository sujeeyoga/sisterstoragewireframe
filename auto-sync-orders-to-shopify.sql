-- ============================================================
-- AUTO-SYNC NEW ORDERS TO SHOPIFY
-- Run this ONCE in your LEGACY Supabase SQL Editor
-- (project: attczdhexkpxpyqyasgz)
-- ============================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Add tracking column so we don't double-push
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shopify_order_id TEXT,
  ADD COLUMN IF NOT EXISTS shopify_synced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS shopify_sync_error TEXT;

-- 3. Trigger function — fires on new order insert
CREATE OR REPLACE FUNCTION public.push_order_to_shopify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Skip if already synced
  IF NEW.shopify_order_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := 'https://zkmxforzmhpzftbvnixi.supabase.co/functions/v1/shopify-import',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbXhmb3J6bWhwemZ0YnZuaXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MDA4OTAsImV4cCI6MjA5NDA3Njg5MH0.RUmXUYhyA5FXspWI7XDX82LLcVdpFFzQxpVB4wqLO9A'
    ),
    body := jsonb_build_object(
      'type', 'order',
      'items', jsonb_build_array(to_jsonb(NEW))
    )
  );

  RETURN NEW;
END;
$$;

-- 4. Attach trigger
DROP TRIGGER IF EXISTS trg_push_order_to_shopify ON public.orders;
CREATE TRIGGER trg_push_order_to_shopify
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.push_order_to_shopify();
