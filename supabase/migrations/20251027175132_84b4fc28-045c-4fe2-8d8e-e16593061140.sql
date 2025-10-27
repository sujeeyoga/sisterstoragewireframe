-- Fix get_admin_users function to handle email type correctly
CREATE OR REPLACE FUNCTION public.get_admin_users()
 RETURNS TABLE(id uuid, user_id uuid, role app_role, email text, created_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    au.email::text, -- Cast email to text to match return type
    ur.created_at
  FROM public.user_roles ur
  INNER JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC;
END;
$function$;