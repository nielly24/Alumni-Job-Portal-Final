-- Update the handle_new_user function to include id_number and verification status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, company, role, id_number)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.raw_user_meta_data ->> 'company',
    NEW.raw_user_meta_data ->> 'role',
    NEW.raw_user_meta_data ->> 'id_number'
  );
  RETURN NEW;
END;
$$;