import { Button } from "@/components/ui/button";
import { Users, Briefcase, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import CommunityStats from "@/components/CommunityStats";
import VerificationBanner from "@/components/VerificationBanner";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const { isAdmin } = useUserRole(user?.id);

  useEffect(() => {
    // Check for existing user session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignInClick = () => {
    navigate("/auth");
  };

  const handleJobsClick = () => {
    navigate("/jobs");
  };

  const handleBrowseJobsClick = () => {
    navigate("/jobs");
  };

  const handleJoinNetworkClick = () => {
    navigate("/auth");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/uploads/554263cb-c020-41c0-97f8-9592f3dd2fd2.png" alt="CSU Logo" className="h-10 w-10" />
              <img src="/uploads/c101f9cb-9ca8-4f75-952b-fc90fd772dc8.png" alt="CpE Logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold">CpE Alumni Network</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" onClick={handleJobsClick}>Jobs</Button>
              
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="ghost" onClick={() => navigate("/admin")}>
                      Admin
                    </Button>
                  )}
                  <Button variant="ghost" onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button onClick={handleSignInClick}>Sign In</Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Verification Banner */}
      {user && (
        <div className="container mx-auto px-4 pt-6">
          <VerificationBanner userId={user.id} />
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Computer Engineering Alumni
            <span className="block text-primary">Job Portal</span>
          </h1>
          <p className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Connect with fellow CpE alumni, discover career opportunities, and build your professional network in tech industry.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="px-8" onClick={handleBrowseJobsClick}>
              <Briefcase className="mr-2 h-5 w-5" />
              Browse Jobs
            </Button>
            <Button size="lg" variant="outline" className="px-8" onClick={handleJoinNetworkClick}>
              <Users className="mr-2 h-5 w-5" />
              Join Network
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <CommunityStats />

      {/* Footer */}
      <footer className="bg-card/80 backdrop-blur-sm border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/uploads/554263cb-c020-41c0-97f8-9592f3dd2fd2.png" alt="CSU Logo" className="h-8 w-8" />
                <img src="/uploads/c101f9cb-9ca8-4f75-952b-fc90fd772dc8.png" alt="CpE Logo" className="h-8 w-8" />
                <span className="font-bold">CpE Alumni Network</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting Computer Engineering graduates with exciting career opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">For Job Seekers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Browse Jobs</li>
                <li>Career Resources</li>
                <li>Alumni Directory</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">For Employers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Post a Job</li>
                <li>Search Candidates</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
