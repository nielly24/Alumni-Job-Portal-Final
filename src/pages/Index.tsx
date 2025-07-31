import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Clock, Users, Briefcase, GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/554263cb-c020-41c0-97f8-9592f3dd2fd2.png" alt="CSU Logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold">CSU CE Alumni Network</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost">Jobs</Button>
              <Button variant="ghost">Companies</Button>
              <Button variant="ghost">Network</Button>
              <Button>Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Computer Engineering Alumni
            <span className="block text-primary">Job Portal</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with fellow CE alumni, discover career opportunities, and build your professional network in tech industry.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="px-8">
              <Briefcase className="mr-2 h-5 w-5" />
              Browse Jobs
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              <Users className="mr-2 h-5 w-5" />
              Join Network
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Alumni</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">250+</div>
              <div className="text-muted-foreground">Job Openings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Senior Software Engineer",
                company: "TechCorp Inc.",
                location: "San Francisco, CA",
                type: "Full-time",
                salary: "$120k - $160k",
                posted: "2 days ago"
              },
              {
                title: "AI/ML Engineer",
                company: "DataTech Solutions",
                location: "Seattle, WA",
                type: "Full-time",
                salary: "$130k - $170k",
                posted: "1 week ago"
              },
              {
                title: "DevOps Engineer",
                company: "CloudFirst",
                location: "Austin, TX",
                type: "Remote",
                salary: "$110k - $150k",
                posted: "3 days ago"
              }
            ].map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{job.title}</span>
                    <Badge variant="secondary">{job.type}</Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {job.posted}
                    </div>
                    <div className="font-semibold text-primary">{job.salary}</div>
                    <Button className="w-full mt-4">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">View All Jobs</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/lovable-uploads/554263cb-c020-41c0-97f8-9592f3dd2fd2.png" alt="CSU Logo" className="h-8 w-8" />
                <span className="font-bold">CSU CE Alumni Network</span>
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
