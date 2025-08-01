-- Create job postings table
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Remote', 'Internship')),
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  application_url TEXT,
  application_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on job postings
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Create policies for job postings
CREATE POLICY "Job postings are viewable by everyone" 
ON public.job_postings 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can create their own job postings" 
ON public.job_postings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job postings" 
ON public.job_postings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job postings" 
ON public.job_postings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Enable RLS on job applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for job applications
CREATE POLICY "Users can view applications for their job postings" 
ON public.job_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.job_postings 
    WHERE id = job_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own applications" 
ON public.job_applications 
FOR SELECT 
USING (auth.uid() = applicant_id);

CREATE POLICY "Users can create applications for active jobs" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (
  auth.uid() = applicant_id AND
  EXISTS (
    SELECT 1 FROM public.job_postings 
    WHERE id = job_id AND is_active = true
  )
);

CREATE POLICY "Users can update their own applications" 
ON public.job_applications 
FOR UPDATE 
USING (auth.uid() = applicant_id);

CREATE POLICY "Job posters can update application status" 
ON public.job_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.job_postings 
    WHERE id = job_id AND user_id = auth.uid()
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();