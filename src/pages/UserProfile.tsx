import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Mail, Phone, Globe, Briefcase } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  full_name: string | null;
  company: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  account_type: string;
  company_size: string | null;
  company_website: string | null;
  company_description: string | null;
  contact_phone: string | null;
}

interface EmploymentHistory {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  employment_type: string | null;
  description: string | null;
}

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([]);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is required",
        variant: "destructive",
      });
      navigate("/jobs");
      return;
    }

    try {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch employment history
      const { data: employmentData, error: employmentError } = await supabase
        .from("employment_history")
        .select("*")
        .eq("user_id", userId)
        .order("start_date", { ascending: false });

      if (employmentError) throw employmentError;
      setEmploymentHistory(employmentData || []);
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>The user profile you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/jobs")} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.full_name || "User"}</h1>
                  <Badge variant="secondary">{profile.account_type}</Badge>
                </div>
                {profile.role && (
                  <p className="text-lg text-muted-foreground mb-1">{profile.role}</p>
                )}
                {profile.company && (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {profile.company}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          {(profile.bio || profile.company_website || profile.contact_phone) && (
            <CardContent className="space-y-4">
              {profile.bio && (
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-4">
                {profile.company_website && (
                  <a
                    href={profile.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {profile.contact_phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {profile.contact_phone}
                  </div>
                )}
              </div>
              {profile.company_description && (
                <div>
                  <h3 className="font-semibold mb-2">About Company</h3>
                  <p className="text-muted-foreground">{profile.company_description}</p>
                  {profile.company_size && (
                    <p className="text-sm text-muted-foreground mt-2">Company Size: {profile.company_size}</p>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Employment History */}
        {employmentHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Employment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {employmentHistory.map((job) => (
                  <div key={job.id} className="border-l-2 border-primary pl-4 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{job.position}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        {job.location && (
                          <p className="text-sm text-muted-foreground">{job.location}</p>
                        )}
                      </div>
                      {job.is_current && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <span>{new Date(job.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                      <span>-</span>
                      <span>
                        {job.is_current
                          ? "Present"
                          : job.end_date
                          ? new Date(job.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                          : "N/A"}
                      </span>
                      {job.employment_type && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{job.employment_type}</span>
                        </>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-muted-foreground text-sm whitespace-pre-line">{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
