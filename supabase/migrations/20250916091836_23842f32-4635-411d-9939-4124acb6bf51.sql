-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'employer', 'alumni');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'alumni',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, check_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = check_role
  );
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.is_admin());

-- Update profiles table RLS to allow admin access
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

-- Update job_postings table RLS to allow admin access  
CREATE POLICY "Admins can view all job postings"
ON public.job_postings
FOR SELECT
USING (public.is_admin());

-- Update job_applications table RLS to allow admin access
CREATE POLICY "Admins can view all job applications"
ON public.job_applications
FOR SELECT
USING (public.is_admin());

-- Update employment_history table RLS to allow admin access
CREATE POLICY "Admins can view all employment history"
ON public.employment_history
FOR SELECT
USING (public.is_admin());

-- Function to automatically assign role on profile creation
CREATE OR REPLACE FUNCTION public.handle_user_role_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert default alumni role for new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'alumni');
  RETURN NEW;
END;
$$;