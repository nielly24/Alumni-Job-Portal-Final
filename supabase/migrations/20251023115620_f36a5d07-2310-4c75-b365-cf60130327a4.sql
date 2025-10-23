-- Remove employer role from the system

-- First, update any existing employer roles to alumni
UPDATE public.user_roles 
SET role = 'alumni' 
WHERE role = 'employer';

-- Update any existing employer account types to alumni
UPDATE public.profiles 
SET account_type = 'alumni' 
WHERE account_type = 'employer';

-- Drop the default constraint on user_roles.role before changing the enum
ALTER TABLE public.user_roles 
  ALTER COLUMN role DROP DEFAULT;

-- Drop and recreate the app_role enum without employer
ALTER TYPE public.app_role RENAME TO app_role_old;
CREATE TYPE public.app_role AS ENUM ('admin', 'alumni');

-- Update the user_roles table to use the new enum
ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;

-- Restore the default
ALTER TABLE public.user_roles 
  ALTER COLUMN role SET DEFAULT 'alumni'::app_role;

-- Drop the old enum with CASCADE to handle dependent functions
DROP TYPE public.app_role_old CASCADE;

-- Recreate the functions with the new enum
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_uuid uuid, check_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = check_role
  );
$$;

-- Drop the default constraint on profiles.account_type before changing the enum
ALTER TABLE public.profiles 
  ALTER COLUMN account_type DROP DEFAULT;

-- Drop and recreate the account_type enum without employer
ALTER TYPE public.account_type RENAME TO account_type_old;
CREATE TYPE public.account_type AS ENUM ('alumni');

-- Update the profiles table to use the new enum
ALTER TABLE public.profiles 
  ALTER COLUMN account_type TYPE public.account_type USING account_type::text::public.account_type;

-- Restore the default to alumni
ALTER TABLE public.profiles 
  ALTER COLUMN account_type SET DEFAULT 'alumni'::account_type;

-- Drop the old enum
DROP TYPE public.account_type_old;