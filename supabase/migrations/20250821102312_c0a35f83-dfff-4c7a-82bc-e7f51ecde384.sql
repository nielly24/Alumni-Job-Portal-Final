-- Create employment_history table for tracking job history
CREATE TABLE public.employment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')) DEFAULT 'full-time',
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.employment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for employment history
CREATE POLICY "Users can view their own employment history" 
ON public.employment_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own employment history" 
ON public.employment_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employment history" 
ON public.employment_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own employment history" 
ON public.employment_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_employment_history_updated_at
BEFORE UPDATE ON public.employment_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to ensure only one current job per user
CREATE OR REPLACE FUNCTION public.ensure_single_current_job()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = true THEN
    UPDATE public.employment_history 
    SET is_current = false 
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_current = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single current job
CREATE TRIGGER ensure_single_current_job_trigger
  BEFORE INSERT OR UPDATE ON public.employment_history
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_single_current_job();