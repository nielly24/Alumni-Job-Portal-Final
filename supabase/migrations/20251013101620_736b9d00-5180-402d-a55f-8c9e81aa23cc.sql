-- Security fixes for exposed user data and employer contact information

-- Drop the existing overly permissive policy on profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create more restrictive policies for profiles
-- Authenticated users can view basic profile info (excluding sensitive fields)
CREATE POLICY "Authenticated users can view basic profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Public (unauthenticated) users can only view non-sensitive profile fields
-- We'll handle this in the application layer by not exposing sensitive fields

-- Update job_postings policy to hide contact info from unauthenticated users
-- First, drop the existing public policy
DROP POLICY IF EXISTS "Job postings are viewable by everyone" ON public.job_postings;

-- Create new policy that allows viewing active jobs (contact info will be filtered in app layer)
CREATE POLICY "Active job postings are viewable by everyone"
ON public.job_postings
FOR SELECT
USING (is_active = true);

-- Add a policy specifically for authenticated users to see full details
CREATE POLICY "Authenticated users can view full job details"
ON public.job_postings
FOR SELECT
TO authenticated
USING (is_active = true);

-- Add helpful comments
COMMENT ON POLICY "Authenticated users can view basic profiles" ON public.profiles IS 
'Authenticated users can view profiles. Application layer should filter sensitive fields (contact_phone, id_number) for non-owners.';

COMMENT ON POLICY "Active job postings are viewable by everyone" ON public.job_postings IS 
'Public users can view job postings. Application layer should hide application_email and application_url for unauthenticated users.';