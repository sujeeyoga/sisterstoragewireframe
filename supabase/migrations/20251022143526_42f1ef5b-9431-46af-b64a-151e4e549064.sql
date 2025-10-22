-- Fix critical security issues

-- Fix abandoned_carts: Remove public read access
DROP POLICY IF EXISTS "Users can view their own abandoned carts" ON abandoned_carts;
DROP POLICY IF EXISTS "Admins can view all abandoned carts" ON abandoned_carts;

CREATE POLICY "Users can view their own abandoned carts"
ON abandoned_carts FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
);

CREATE POLICY "Admins can view all abandoned carts"
ON abandoned_carts FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix orders: Add explicit deny policy for public access
DROP POLICY IF EXISTS "Deny public read access to orders" ON orders;

CREATE POLICY "Deny public read access to orders"
ON orders FOR SELECT
TO anon
USING (false);

-- Create waitlist_signups table for launch card email collection
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text NOT NULL,
  collection_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(email, collection_name)
);

-- Enable RLS
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;

-- RLS Policies for waitlist_signups
CREATE POLICY "Anyone can sign up for waitlist"
ON waitlist_signups FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all waitlist signups"
ON waitlist_signups FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete waitlist signups"
ON waitlist_signups FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));