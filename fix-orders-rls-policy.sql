-- Fix RLS policy that's causing "permission denied for table users" error
-- 
-- Run this SQL in your Supabase SQL Editor after maintenance is complete
-- This fixes the customer orders visibility issue

-- Drop the problematic policy that references auth.users directly
DROP POLICY IF EXISTS "Customers can view their own orders by phone" ON public.orders;

-- Create corrected policy using auth.jwt() instead of querying auth.users
-- This policy allows authenticated customers to view their own orders
CREATE POLICY "Customers can view their own orders by phone"
  ON public.orders FOR SELECT
  TO authenticated
  USING (
    -- Match by phone number from JWT metadata
    customer_phone = (auth.jwt() -> 'user_metadata' ->> 'phone')
    OR 
    -- Match by email (auth.email() is a safe built-in function)
    customer_email = auth.email()
  );

-- Verify the policy was created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'orders' 
ORDER BY policyname;
