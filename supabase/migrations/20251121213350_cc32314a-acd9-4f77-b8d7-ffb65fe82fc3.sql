-- Add phone column to orders table
ALTER TABLE public.orders 
ADD COLUMN customer_phone TEXT;

-- Create index for faster lookups
CREATE INDEX idx_orders_customer_phone ON public.orders(customer_phone);

-- Create customer profiles table
CREATE TABLE public.customer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on customer_profiles
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

-- Customers can view their own profile
CREATE POLICY "Customers can view own profile"
  ON public.customer_profiles FOR SELECT
  TO authenticated
  USING (phone = (SELECT raw_user_meta_data->>'phone' FROM auth.users WHERE id = auth.uid()));

-- Customers can update their own profile
CREATE POLICY "Customers can update own profile"
  ON public.customer_profiles FOR UPDATE
  TO authenticated
  USING (phone = (SELECT raw_user_meta_data->>'phone' FROM auth.users WHERE id = auth.uid()));

-- Customers can insert their own profile
CREATE POLICY "Customers can insert own profile"
  ON public.customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (phone = (SELECT raw_user_meta_data->>'phone' FROM auth.users WHERE id = auth.uid()));

-- Update orders RLS policies for customer access
CREATE POLICY "Customers can view their own orders by phone"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    customer_phone = (SELECT raw_user_meta_data->>'phone' FROM auth.users WHERE id = auth.uid())
    OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );