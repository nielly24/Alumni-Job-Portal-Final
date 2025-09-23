-- Add verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN id_number TEXT,
ADD COLUMN verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN verified_by UUID REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX idx_profiles_verification_status ON public.profiles(verification_status);
CREATE INDEX idx_profiles_id_number ON public.profiles(id_number);

-- Update RLS policies to restrict access for unverified users
CREATE POLICY "Only verified users can access most features"
ON public.job_postings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND verification_status = 'approved'
  )
);

CREATE POLICY "Only verified users can apply for jobs"
ON public.job_applications
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND verification_status = 'approved'
  ) AND auth.uid() = applicant_id
);

-- Function to verify a user (admin only)
CREATE OR REPLACE FUNCTION public.verify_user(target_user_id UUID, approve BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can verify users';
  END IF;
  
  -- Update verification status
  UPDATE public.profiles 
  SET 
    verification_status = CASE WHEN approve THEN 'approved' ELSE 'rejected' END,
    verified_at = CASE WHEN approve THEN now() ELSE NULL END,
    verified_by = CASE WHEN approve THEN auth.uid() ELSE NULL END
  WHERE user_id = target_user_id;
END;
$$;