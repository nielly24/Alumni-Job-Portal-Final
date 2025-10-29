import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building, Clock, DollarSign, ArrowLeft, Edit, Trash2 } from "lucide-react"; // 1. Import Trash2 icon
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string;
  benefits?: string;
  created_at: string;
  featured: boolean;
  user_id: string;
}

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserAndFetchJob = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (id) {
        await fetchJob();
      }
    };
    checkUserAndFetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      if (error) throw error;
      setJob(data);
    } catch (error) {
      toast({ title: "Error", description: "Job not found", variant: "destructive" });
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  // 2. NEW FUNCTION to handle deleting the job
  const handleDelete = async () => {
    if (!job) return;

    const isConfirmed = window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.");

    if (isConfirmed) {
      try {
        const { error } = await supabase
          .from('job_postings')
          .delete()
          .eq('id', job.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Job posting deleted successfully.",
        });
        navigate("/jobs");
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          title: "Error",
          description: "Failed to delete job posting. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
    if (min) return `From ₱${min.toLocaleString()}`;
    if (max) return `Up to ₱${max.toLocaleString()}`;
    return "Not specified";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
          <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && job && currentUser.id === job.user_id;

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>

          {/* 3. ADDED "Edit" and "Delete" buttons for the owner */}
          {isOwner && (
            <div className="flex gap-2">
              <Button onClick={() => navigate(`/edit-job/${job.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Job
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {job.title}
                      {job.featured && <Badge variant="secondary">Featured</Badge>}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2 text-lg">
                      <Building className="h-5 w-5" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {job.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {formatSalary(job.salary_min, job.salary_max)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Posted {formatDate(job.created_at)}
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{job.description}</p>
                    </div>
                  </div>
                  {job.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{job.requirements}</p>
                      </div>
                    </div>
                  )}
                  {job.benefits && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{job.benefits}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Job Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between"><span className="text-muted-foreground">Company</span><span className="font-medium">{job.company}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{job.location}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Job Type</span><span className="font-medium">{job.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Salary</span><span className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Posted</span><span className="font-medium">{formatDate(job.created_at)}</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;