-- Add account_type enum and update profiles table
CREATE TYPE public.account_type AS ENUM ('alumni', 'employer');

-- Add account_type column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN account_type account_type NOT NULL DEFAULT 'alumni';

-- Add employer-specific fields
ALTER TABLE public.profiles 
ADD COLUMN company_size text,
ADD COLUMN company_website text,
ADD COLUMN company_description text,
ADD COLUMN contact_phone text;

-- Update the handle_new_user function to include account_type and new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    full_name, 
    company, 
    role, 
    id_number,
    account_type,
    company_size,
    company_website,
    company_description,
    contact_phone
  )
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'company',
    NEW.raw_user_meta_data ->> 'role',
    NEW.raw_user_meta_data ->> 'id_number',
    COALESCE((NEW.raw_user_meta_data ->> 'account_type')::account_type, 'alumni'::account_type),
    NEW.raw_user_meta_data ->> 'company_size',
    NEW.raw_user_meta_data ->> 'company_website',
    NEW.raw_user_meta_data ->> 'company_description',
    NEW.raw_user_meta_data ->> 'contact_phone'
  );
  RETURN NEW;
END;
$$;