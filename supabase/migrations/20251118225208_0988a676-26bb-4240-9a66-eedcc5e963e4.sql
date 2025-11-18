-- Drop the incorrect trigger for active_carts
-- The active_carts table uses 'last_updated' not 'updated_at'
-- and we manually set it in the application code
DROP TRIGGER IF EXISTS update_active_carts_updated_at ON public.active_carts;