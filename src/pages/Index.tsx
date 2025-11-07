import { Button } from "@/components/ui/button";
import { Users, Briefcase, User, LogOut } from "lucide-react"; // Removed FileText icon
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

    // --- "handleSignInClick" function removed ---

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
                            <h1 className="text-2xl font-bold">CpE Alumni Community</h1>
                        </div>
                        <nav className="flex items-center gap-4">
                            <Button variant="ghost" onClick={handleJobsClick}>Jobs</Button>
                            <Button variant="ghost" onClick={() => navigate("/alumni")}>
                                <Users className="w-4 h-4 mr-2" />
                                Alumni
                            </Button>
                            
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
                                // --- "Sign In" BUTTON REMOVED FROM HERE ---
                                null // Show nothing if the user is logged out
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
                        Connect with fellow CpE alumni, discover career opportunities.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="px-8" onClick={handleBrowseJobsClick}>
                            <Briefcase className="mr-2 h-5 w-5" />
                            Browse Jobs
                        </Button>
                        <Button size="lg" variant="outline" className="px-8" onClick={handleJoinNetworkClick}>
                            <Users className="mr-2 h-5 w-5" />
                            Join Community
                        </Button>
                    </div>
                </div>
            </section>

            {/* Community Stats */}
            <CommunityStats />

            <footer className="bg-gradient-to-b from-sky-100 to-sky-50 text-foreground py-10 px-6 md:px-16">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-20">
                
                {/* Logo + Description */}
                <div className="md:w-1/2">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="/uploads/554263cb-c020-41c0-97f8-9592f3dd2fd2.png"
                      alt="CSU Logo"
                      className="h-10 w-10"
                    />
                    <img
                      src="/uploads/c101f9cb-9ca8-4f75-952b-fc90fd772dc8.png"
                      alt="CpE Logo"
                      className="h-10 w-10"
                    />
                    <span className="font-bold text-lg">CpE Alumni Network</span>
                  </div>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Connecting Computer Engineering graduates with exciting career opportunities.
                  </p>
                </div>

                {/* Links Section */}
                <div className="flex gap-10">
                  {/* For Job Seekers */}
                  <div>
                    <h3 className="font-semibold mb-3">For Job Seekers</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-blue-600">Browse Jobs</a></li>
                      <li><a href="#" className="hover:text-blue-600">Career Resources</a></li>
                      <li><a href="#" className="hover:text-blue-600">Alumni Directory</a></li>
                    </ul>
                  </div>

                  {/* Support */}
                  <div>
                    <h3 className="font-semibold mb-3">Support</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="#" className="hover:text-blue-600">Help Center</a></li>
                      <li><a href="#" className="hover:text-blue-600">Contact Us</a></li>
                      <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Divider */}
              <div className="mt-10 border-t border-gray-300 pt-4 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} CpE Alumni Network. All rights reserved.
              </div>
            </footer>
        </div>
    );
};

export default Index;