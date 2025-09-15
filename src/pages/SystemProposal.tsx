import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Database, Users, Shield, Code, Server, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SystemProposal = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/554263cb-c020-41c0-97f8-9592f3dd2fd2.png" alt="CSU Logo" className="h-10 w-10" />
              <img src="/lovable-uploads/c101f9cb-9ca8-4f75-952b-fc90fd772dc8.png" alt="CpE Logo" className="h-10 w-10" />
              <h1 className="text-2xl font-bold">System Proposal</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CpE Alumni Network Job Portal</h1>
          <h2 className="text-2xl text-muted-foreground mb-2">Proposed System Architecture</h2>
          <p className="text-lg text-muted-foreground">A Comprehensive Web-Based Job Matching Platform for Computer Engineering Alumni</p>
        </div>

        {/* System Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The CpE Alumni Network Job Portal is a comprehensive web-based platform designed to bridge the gap between Computer Engineering graduates and potential employers. The system facilitates job discovery, application management, and professional networking within the CpE alumni community.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">Alumni profiles and authentication</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Database className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Job Management</h3>
                <p className="text-sm text-muted-foreground">Job postings and applications</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Security & Privacy</h3>
                <p className="text-sm text-muted-foreground">Data protection and access control</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Frontend Technologies</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Framework</span>
                    <Badge variant="secondary">React 18.3.1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Language</span>
                    <Badge variant="secondary">TypeScript</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Styling</span>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>UI Components</span>
                    <Badge variant="secondary">Radix UI + shadcn/ui</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Routing</span>
                    <Badge variant="secondary">React Router 6</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>State Management</span>
                    <Badge variant="secondary">TanStack Query</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Build Tool</span>
                    <Badge variant="secondary">Vite</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Backend Technologies</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge variant="secondary">PostgreSQL (Supabase)</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authentication</span>
                    <Badge variant="secondary">Supabase Auth</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API</span>
                    <Badge variant="secondary">Supabase REST API</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Real-time</span>
                    <Badge variant="secondary">Supabase Realtime</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Security</span>
                    <Badge variant="secondary">Row Level Security</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Edge Functions</span>
                    <Badge variant="secondary">Supabase Edge Functions</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Architecture */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Entity Relationship Design</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Profiles Table */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">profiles</h4>
                    <div className="space-y-1 text-sm">
                      <div>id (UUID, PK)</div>
                      <div>user_id (UUID, FK)</div>
                      <div>full_name (TEXT)</div>
                      <div>company (TEXT)</div>
                      <div>role (TEXT)</div>
                      <div>bio (TEXT)</div>
                      <div>avatar_url (TEXT)</div>
                      <div>created_at (TIMESTAMP)</div>
                      <div>updated_at (TIMESTAMP)</div>
                    </div>
                  </div>

                  {/* Job Postings Table */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">job_postings</h4>
                    <div className="space-y-1 text-sm">
                      <div>id (UUID, PK)</div>
                      <div>user_id (UUID, FK)</div>
                      <div>title (TEXT)</div>
                      <div>company (TEXT)</div>
                      <div>location (TEXT)</div>
                      <div>type (TEXT)</div>
                      <div>description (TEXT)</div>
                      <div>requirements (TEXT)</div>
                      <div>benefits (TEXT)</div>
                      <div>salary_min (INTEGER)</div>
                      <div>salary_max (INTEGER)</div>
                      <div>is_active (BOOLEAN)</div>
                      <div>featured (BOOLEAN)</div>
                      <div>expires_at (TIMESTAMP)</div>
                      <div>created_at (TIMESTAMP)</div>
                      <div>updated_at (TIMESTAMP)</div>
                    </div>
                  </div>

                  {/* Job Applications Table */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">job_applications</h4>
                    <div className="space-y-1 text-sm">
                      <div>id (UUID, PK)</div>
                      <div>job_id (UUID, FK)</div>
                      <div>applicant_id (UUID, FK)</div>
                      <div>status (TEXT)</div>
                      <div>cover_letter (TEXT)</div>
                      <div>resume_url (TEXT)</div>
                      <div>applied_at (TIMESTAMP)</div>
                      <div>updated_at (TIMESTAMP)</div>
                    </div>
                  </div>

                  {/* Employment History Table */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">employment_history</h4>
                    <div className="space-y-1 text-sm">
                      <div>id (UUID, PK)</div>
                      <div>user_id (UUID, FK)</div>
                      <div>company (TEXT)</div>
                      <div>position (TEXT)</div>
                      <div>employment_type (TEXT)</div>
                      <div>location (TEXT)</div>
                      <div>description (TEXT)</div>
                      <div>start_date (DATE)</div>
                      <div>end_date (DATE)</div>
                      <div>is_current (BOOLEAN)</div>
                      <div>created_at (TIMESTAMP)</div>
                      <div>updated_at (TIMESTAMP)</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Security Policies (Row Level Security)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">SELECT</Badge>
                    <span>Users can view their own profiles and employment history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">INSERT/UPDATE</Badge>
                    <span>Users can create and modify their own data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">DELETE</Badge>
                    <span>Users can delete their own employment records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">PUBLIC</Badge>
                    <span>Active job postings are viewable by all authenticated users</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Components */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              System Components & Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Core Modules</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Authentication System</h4>
                    <p className="text-sm text-muted-foreground">Secure user registration, login, and session management with email verification</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Job Management</h4>
                    <p className="text-sm text-muted-foreground">Job posting creation, editing, search, and filtering capabilities</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Application Tracking</h4>
                    <p className="text-sm text-muted-foreground">Job application submission and status tracking for both applicants and employers</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Profile Management</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive user profiles with employment history and professional information</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold">Responsive Design</h4>
                    <p className="text-sm text-muted-foreground">Mobile-first design ensuring optimal experience across all devices</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold">Real-time Updates</h4>
                    <p className="text-sm text-muted-foreground">Live notifications and real-time data synchronization</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold">Advanced Search</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive filtering by location, salary, job type, and company</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h4 className="font-semibold">Professional Networking</h4>
                    <p className="text-sm text-muted-foreground">Alumni directory and networking capabilities within the CpE community</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Architecture Diagram */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>System Architecture Flow</CardTitle>
            <CardDescription>High-level system architecture and data flow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-6 rounded-lg">
              <div className="text-center space-y-4">
                <div className="flex justify-center items-center gap-4 flex-wrap">
                  <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/20">
                    <div className="font-semibold">Client Layer</div>
                    <div className="text-sm text-muted-foreground">React + TypeScript</div>
                  </div>
                  <div className="text-2xl">↓</div>
                  <div className="bg-secondary/10 p-4 rounded-lg border-2 border-secondary/20">
                    <div className="font-semibold">API Layer</div>
                    <div className="text-sm text-muted-foreground">Supabase REST API</div>
                  </div>
                  <div className="text-2xl">↓</div>
                  <div className="bg-accent/10 p-4 rounded-lg border-2 border-accent/20">
                    <div className="font-semibold">Database Layer</div>
                    <div className="text-sm text-muted-foreground">PostgreSQL + RLS</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Secure, scalable architecture with clear separation of concerns
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Benefits */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Implementation Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Security First</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in authentication, RLS policies, and secure data handling ensure user data protection
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Code className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">Modern Stack</h3>
                <p className="text-sm text-muted-foreground">
                  Latest technologies ensure scalability, maintainability, and developer productivity
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold mb-2">User Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Intuitive interface design focused on user needs and accessibility standards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle>System Proposal Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              The proposed CpE Alumni Network Job Portal represents a comprehensive solution for connecting Computer Engineering graduates with career opportunities. The system leverages modern web technologies to provide a secure, scalable, and user-friendly platform that addresses the specific needs of the CpE alumni community. With its robust architecture, comprehensive feature set, and focus on security and user experience, this system serves as an effective bridge between job seekers and employers in the technology sector.
            </p>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Technical Specifications Summary:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Frontend:</span> React + TypeScript
                </div>
                <div>
                  <span className="font-medium">Backend:</span> Supabase
                </div>
                <div>
                  <span className="font-medium">Database:</span> PostgreSQL
                </div>
                <div>
                  <span className="font-medium">Deployment:</span> Cloud-based
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemProposal;