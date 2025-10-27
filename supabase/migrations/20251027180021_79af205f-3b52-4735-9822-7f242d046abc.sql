-- Add DELETE policy for admins to remove other admins
CREATE POLICY "Admins can delete admin roles" 
ON public.user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Create a function to safely remove admin role and optionally delete user
CREATE OR REPLACE FUNCTION public.remove_admin_role(target_user_id uuid, delete_user boolean DEFAULT false)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_role_id uuid;
BEGIN
  -- Only allow admins to call this function
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can remove admin users';
  END IF;

  -- Prevent admins from removing themselves
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove your own admin role';
  END IF;

  -- Check if target user is an admin
  SELECT id INTO target_role_id
  FROM public.user_roles
  WHERE user_id = target_user_id AND role = 'admin'
  LIMIT 1;

  IF target_role_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'User is not an admin'
    );
  END IF;

  -- Remove admin role
  DELETE FROM public.user_roles
  WHERE id = target_role_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin role removed successfully',
    'user_id', target_user_id
  );
END;
$$;