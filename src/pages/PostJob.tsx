import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 1. Import useParams
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PostJob = () => {
  const { id } = useParams(); // 2. Get job ID from URL for editing
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
    benefits: "",
    application_url: "",
    application_email: "",
    featured: false,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Authentication required", description: "Please sign in to manage jobs" });
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // 3. Check for edit mode
      if (id) {
        setIsEditMode(true);
        setLoading(true);
        try {
          const { data: jobData, error } = await supabase
            .from('job_postings')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          // Authorization check: ensure the user owns this job
          if (jobData && jobData.user_id !== session.user.id) {
            toast({ title: "Unauthorized", description: "You can only edit your own job postings.", variant: "destructive" });
            navigate("/jobs");
            return;
          }

          // Pre-fill the form with existing job data
          setFormData({
            title: jobData.title || "",
            company: jobData.company || "",
            location: jobData.location || "",
            type: jobData.type || "",
            salary_min: jobData.salary_min?.toString() || "",
            salary_max: jobData.salary_max?.toString() || "",
            description: jobData.description || "",
            requirements: jobData.requirements || "",
            benefits: jobData.benefits || "",
            application_url: jobData.application_url || "",
            application_email: jobData.application_email || "",
            featured: jobData.featured || false,
          });
        } catch (error) {
          toast({ title: "Error", description: "Could not fetch job data for editing." });
          navigate("/jobs");
        } finally {
          setLoading(false);
        }
      }
    };

    initialize();
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements || null,
        benefits: formData.benefits || null,
        application_url: formData.application_url || null,
        application_email: formData.application_email || null,
        featured: formData.featured,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      };

      let error;
      // 4. Handle update or insert based on edit mode
      if (isEditMode) {
        const { error: updateError } = await supabase
          .from('job_postings')
          .update(jobData)
          .eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('job_postings')
          .insert([{ ...jobData, user_id: user.id }]);
        error = insertError;
      }

      if (error) {
        throw error;
      } else {
        toast({
          title: "Success!",
          description: `Your job has been ${isEditMode ? 'updated' : 'posted'} successfully.`,
        });
        navigate(isEditMode ? `/job/${id}` : "/jobs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditMode ? 'update' : 'post'} job. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading && isEditMode) { // Show a specific loading message for editing
    return <div className="min-h-screen flex items-center justify-center"><p>Loading job for editing...</p></div>;
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(isEditMode ? `/job/${id}` : "/jobs")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <h1 className="text-2xl font-bold">{isEditMode ? "Edit Job" : "Post a Job"}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isEditMode ? "Edit Job Posting" : "Create Job Posting"}</CardTitle>
              <CardDescription>
                {isEditMode ? "Update the details for your job opportunity." : "Fill out the details below to post your job opportunity."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* All your form fields are here, and will be pre-filled by the formData state */}
                {/* ... (Your existing form JSX) ... */}
                 {/* Basic Information */}
                 <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div>
                    <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                    <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} placeholder="e.g. Senior Software Engineer" required />
                  </div>
                  <div>
                    <Label htmlFor="company">Company <span className="text-red-500">*</span></Label>
                    <Input id="company" value={formData.company} onChange={(e) => handleInputChange("company", e.target.value)} placeholder="e.g. TechCorp Inc." required />
                  </div>
                  <div>
                    <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                    <Input id="location" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} placeholder="e.g. San Francisco, CA or Remote" required />
                  </div>
                  <div>
                    <Label htmlFor="type">Job Type <span className="text-red-500">*</span></Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Salary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Salary Range (Optional)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary_min">Minimum Salary</Label>
                      <Input id="salary_min" type="number" value={formData.salary_min} onChange={(e) => handleInputChange("salary_min", e.target.value)} placeholder="50000" />
                    </div>
                    <div>
                      <Label htmlFor="salary_max">Maximum Salary</Label>
                      <Input id="salary_max" type="number" value={formData.salary_max} onChange={(e) => handleInputChange("salary_max", e.target.value)} placeholder="80000" />
                    </div>
                  </div>
                </div>

                {/* Description, Requirements, Benefits */}
                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Describe the role..." rows={6} required />
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements (Optional)</Label>
                  <Textarea id="requirements" value={formData.requirements} onChange={(e) => handleInputChange("requirements", e.target.value)} placeholder="List required skills..." rows={4} />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits (Optional)</Label>
                  <Textarea id="benefits" value={formData.benefits} onChange={(e) => handleInputChange("benefits", e.target.value)} placeholder="Health insurance, etc..." rows={3} />
                </div>

                {/* Application Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">How to Apply</h3>
                  <div>
                    <Label htmlFor="application_url">Application URL (Optional)</Label>
                    <Input id="application_url" type="url" value={formData.application_url} onChange={(e) => handleInputChange("application_url", e.target.value)} placeholder="https://company.com/careers/apply" />
                  </div>
                  <div>
                    <Label htmlFor="application_email">Application Email (Optional)</Label>
                    <Input id="application_email" type="email" value={formData.application_email} onChange={(e) => handleInputChange("application_email", e.target.value)} placeholder="careers@company.com" />
                  </div>
                </div>

                {/* Featured Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" checked={formData.featured} onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)} />
                  <Label htmlFor="featured">Make this a featured job posting</Label>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (isEditMode ? "Updating..." : "Posting...") : (isEditMode ? "Update Job" : "Post Job")}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(isEditMode ? `/job/${id}` : "/jobs")}
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

export default PostJob;