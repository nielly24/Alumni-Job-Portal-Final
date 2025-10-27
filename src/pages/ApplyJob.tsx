import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js"; // Import the User type

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}

const ApplyJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Use the correct type for user
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to apply for jobs",
        });
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkAuth();
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('id, title, company, location, type')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Job not found",
          variant: "destructive",
        });
        navigate("/jobs");
      } else {
        setJob(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch job details",
        variant: "destructive",
      });
      navigate("/jobs");
    }
  };

  // --- THIS ENTIRE FUNCTION HAS BEEN REPLACED ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Re-fetch the session to ensure we have the latest user data.
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // If there's no session or an error, stop the process.
    if (sessionError || !session) {
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      setLoading(false);
      navigate('/auth');
      return;
    }
    
    const currentUser = session.user;
    
    console.log('--- DEBUG: Submitting application for user ID:', currentUser.id);

    try {
      // Check if user has already applied
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', id)
        .eq('applicant_id', currentUser.id)
        .single();

      if (existingApplication) {
        toast({
          title: "Already applied",
          description: "You have already applied for this job",
          variant: "destructive",
        });
        setLoading(false); // Make sure to stop loading here
        navigate(`/job/${id}`);
        return;
      }

      const applicationData = {
        job_id: id,
        applicant_id: currentUser.id,
        cover_letter: coverLetter || null,
        resume_uri: resumeUrl || null,
      };

      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([applicationData]);

      if (insertError) {
        console.error("Error submitting application:", insertError);
        toast({
          title: "Error",
          description: "Failed to submit application. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Application submitted!",
          description: "Your application has been sent successfully.",
        });
        navigate(`/job/${id}`);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(`/job/${id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Apply for Job</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Applying for:</CardTitle>
              <CardDescription>
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-foreground">{job.title}</div>
                  <div>{job.company} • {job.location} • {job.type}</div>
                </div>
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Application</CardTitle>
              <CardDescription>
                Fill out the information below to submit your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="resume_url">Resume URL (Optional)</Label>
                  <Input
                    id="resume_url"
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... or https://linkedin.com/in/yourprofile"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Link to your resume (Google Drive, LinkedIn, personal website, etc.)
                  </p>
                </div>

                <div>
                  <Label htmlFor="cover_letter">Cover Letter (Optional)</Label>
                  <Textarea
                    id="cover_letter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're interested in this position and how your experience makes you a great fit..."
                    rows={8}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Share your motivation and relevant experience for this role
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Application Details</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your profile information will be automatically included</li>
                    <li>• The employer will be able to see your application details</li>
                    <li>• You can track your application status in your dashboard</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/job/${id}`)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;