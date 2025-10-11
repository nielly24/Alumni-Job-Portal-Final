-- Allow admins to delete any job posting
CREATE POLICY "Admins can delete any job posting"
ON public.job_postings
FOR DELETE
USING (is_admin());