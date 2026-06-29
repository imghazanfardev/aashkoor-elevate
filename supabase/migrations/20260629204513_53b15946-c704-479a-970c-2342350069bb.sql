
-- Update trigger to also auto-grant admin to ghazanfardev403@gmail.com
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_grant()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.email IN ('admin@aashkoor.com', 'ghazanfardev403@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- If the user already exists in auth.users, grant admin now
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'ghazanfardev403@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
