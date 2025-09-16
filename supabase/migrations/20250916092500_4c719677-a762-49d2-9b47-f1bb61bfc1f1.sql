-- Create a function to promote the first user to admin (for initial setup)
CREATE OR REPLACE FUNCTION public.create_first_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- This is a one-time function to create the first admin
  -- You'll need to sign up with email: admin@cpealumni.com, password: Admin123!
  -- Then call this function to promote yourself to admin
  
  -- Check if there are any admins already
  IF EXISTS (SELECT 1 FROM user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Admin already exists. Use the admin panel to manage roles.';
  END IF;
  
  -- Get the user ID for admin@cpealumni.com (must be signed up first)
  SELECT auth.uid() INTO admin_user_id;
  
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user found. Please sign in first.';
  END IF;
  
  -- Promote current user to admin
  INSERT INTO user_roles (user_id, role) 
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Update profile if needed
  UPDATE profiles 
  SET 
    full_name = COALESCE(full_name, 'System Administrator'),
    role = COALESCE(role, 'System Admin')
  WHERE user_id = admin_user_id;
  
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_first_admin() TO authenticated;