import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Building, GraduationCap } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [accountType, setAccountType] = useState("alumni");
  const [idNumber, setIdNumber] = useState("");
  // Employer-specific fields
  const [companySize, setCompanySize] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const signupData = {
        full_name: fullName,
        company,
        role,
        account_type: accountType,
        id_number: idNumber,
      };

      // Add employer-specific fields if account type is employer
      if (accountType === 'employer') {
        Object.assign(signupData, {
          company_size: companySize,
          company_website: companyWebsite,
          company_description: companyDescription,
          contact_phone: contactPhone,
        });
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: signupData
        }
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account.",
        });
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate("/");
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">CpE Alumni Network</h1>
          <p className="text-muted-foreground mt-2">Join our professional community</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>Join the CpE Alumni Network today</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Account Type Selection */}
                  <div>
                    <Label>I am joining as:</Label>
                    <RadioGroup 
                      value={accountType} 
                      onValueChange={setAccountType}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alumni" id="alumni" />
                        <Label htmlFor="alumni" className="flex items-center gap-2 cursor-pointer">
                          <GraduationCap className="h-4 w-4" />
                          Alumni
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="employer" id="employer" />
                        <Label htmlFor="employer" className="flex items-center gap-2 cursor-pointer">
                          <Building className="h-4 w-4" />
                          Employer
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Common fields */}
                  {accountType === 'alumni' && (
                    <div>
                      <Label htmlFor="signup-id-number">ID Number</Label>
                      <Input
                        id="signup-id-number"
                        type="text"
                        placeholder="Your student ID number"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="signup-company">
                      {accountType === 'employer' ? 'Company Name' : 'Current Company (Optional)'}
                    </Label>
                    <Input
                      id="signup-company"
                      type="text"
                      placeholder={accountType === 'employer' ? 'Your company name' : 'Your current company'}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      required={accountType === 'employer'}
                    />
                  </div>

                  <div>
                    <Label htmlFor="signup-role">
                      {accountType === 'employer' ? 'Your Position' : 'Current Role (Optional)'}
                    </Label>
                    <Input
                      id="signup-role"
                      type="text"
                      placeholder={accountType === 'employer' ? 'Your position in the company' : 'Your current position'}
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required={accountType === 'employer'}
                    />
                  </div>

                  {/* Employer-specific fields */}
                  {accountType === 'employer' && (
                    <>
                      <div>
                        <Label htmlFor="signup-company-size">Company Size</Label>
                        <Input
                          id="signup-company-size"
                          type="text"
                          placeholder="e.g., 1-10, 11-50, 51-200, etc."
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="signup-company-website">Company Website</Label>
                        <Input
                          id="signup-company-website"
                          type="url"
                          placeholder="https://yourcompany.com"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="signup-contact-phone">Contact Phone</Label>
                        <Input
                          id="signup-contact-phone"
                          type="tel"
                          placeholder="Your contact phone number"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="signup-company-description">Company Description</Label>
                        <Textarea
                          id="signup-company-description"
                          placeholder="Brief description of your company and what you do..."
                          value={companyDescription}
                          onChange={(e) => setCompanyDescription(e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : `Sign Up as ${accountType === 'alumni' ? 'Alumni' : 'Employer'}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;