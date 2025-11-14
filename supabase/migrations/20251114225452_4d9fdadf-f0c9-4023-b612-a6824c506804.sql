-- Enable full row tracking for realtime updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;