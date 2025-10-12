-- Update all existing profiles to be verified
UPDATE public.profiles 
SET 
  verification_status = 'approved',
  verified_at = now()
WHERE verification_status = 'pending';