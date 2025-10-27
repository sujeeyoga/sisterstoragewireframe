-- Create a function to get admin users with their emails
CREATE OR REPLACE FUNCTION public.get_admin_users()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role app_role,
  email text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can view admin users';
  END IF;

  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    au.email,
    ur.created_at
  FROM public.user_roles ur
  INNER JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC;
END;
$$;

-- Create a function to add admin role by email
CREATE OR REPLACE FUNCTION public.add_admin_by_email(user_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
  result jsonb;
BEGIN
  -- Only allow admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can add admin users';
  END IF;

  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  -- Check if user exists
  IF target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User not found with email: ' || user_email
    );
  END IF;

  -- Check if user is already an admin
  IF EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = target_user_id AND role = 'admin'
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User is already an admin'
    );
  END IF;

  -- Add admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin');

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin role added successfully',
    'user_id', target_user_id
  );
END;
$$;

-- Add RLS policy for admins to view all user roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to insert user roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));