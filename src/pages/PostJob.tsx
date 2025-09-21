import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post a job",
      });
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

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
        user_id: user.id,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      };

      const { error } = await supabase
        .from('job_postings')
        .insert([jobData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to post job. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Your job has been posted successfully.",
        });
        navigate("/jobs");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/jobs")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              <h1 className="text-2xl font-bold">Post a Job</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Job Posting</CardTitle>
              <CardDescription>
                Fill out the details below to post your job opportunity to the CpE Alumni Network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="e.g. TechCorp Inc."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Job Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
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
                      <Input
                        id="salary_min"
                        type="number"
                        value={formData.salary_min}
                        onChange={(e) => handleInputChange("salary_min", e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary_max">Maximum Salary</Label>
                      <Input
                        id="salary_max"
                        type="number"
                        value={formData.salary_max}
                        onChange={(e) => handleInputChange("salary_max", e.target.value)}
                        placeholder="80000"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                    rows={6}
                    required
                  />
                </div>

                {/* Requirements */}
                <div>
                  <Label htmlFor="requirements">Requirements (Optional)</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="List the required skills, experience, education, etc..."
                    rows={4}
                  />
                </div>

                {/* Benefits */}
                <div>
                  <Label htmlFor="benefits">Benefits (Optional)</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => handleInputChange("benefits", e.target.value)}
                    placeholder="Health insurance, 401k, flexible hours, etc..."
                    rows={3}
                  />
                </div>

                {/* Application Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">How to Apply</h3>
                  
                  <div>
                    <Label htmlFor="application_url">Application URL (Optional)</Label>
                    <Input
                      id="application_url"
                      type="url"
                      value={formData.application_url}
                      onChange={(e) => handleInputChange("application_url", e.target.value)}
                      placeholder="https://company.com/careers/apply"
                    />
                  </div>

                  <div>
                    <Label htmlFor="application_email">Application Email (Optional)</Label>
                    <Input
                      id="application_email"
                      type="email"
                      value={formData.application_email}
                      onChange={(e) => handleInputChange("application_email", e.target.value)}
                      placeholder="careers@company.com"
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    If neither URL nor email is provided, applicants will use our built-in application system.
                  </p>
                </div>

                {/* Featured Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
                  />
                  <Label htmlFor="featured">Make this a featured job posting</Label>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Posting..." : "Post Job"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/jobs")}
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