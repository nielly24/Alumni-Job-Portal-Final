import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Building, Plus, Edit, Trash2, CalendarIcon, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface EmploymentHistory {
  id: string;
  user_id: string;
  company: string;
  position: string;
  employment_type: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    company: "",
    role: "",
    bio: ""
  });
  const [employmentForm, setEmploymentForm] = useState({
    company: "",
    position: "",
    employment_type: "full-time",
    location: "",
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
    is_current: false,
    description: ""
  });
  const [showEmploymentDialog, setShowEmploymentDialog] = useState(false);
  const [editingEmployment, setEditingEmployment] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await loadProfileData(user.id);
  };

  const loadProfileData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Load or create profile with dummy data
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create one with dummy data
        const dummyProfile = {
          user_id: userId,
          full_name: "John Doe",
          company: "Tech Solutions Inc.",
          role: "Senior Software Engineer",
          bio: "Experienced Computer Engineering graduate with 5+ years in software development. Passionate about AI, machine learning, and creating scalable solutions."
        };

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert(dummyProfile)
          .select()
          .single();

        if (createError) throw createError;
        profileData = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      setProfile(profileData);
      setProfileForm({
        full_name: profileData?.full_name || "",
        company: profileData?.company || "",
        role: profileData?.role || "",
        bio: profileData?.bio || ""
      });

      // Load employment history
      const { data: employmentData, error: employmentError } = await supabase
        .from('employment_history')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (employmentError) throw employmentError;

      // If no employment history exists, create dummy data

      
      

        const { data: newEmploymentData, error: createEmploymentError } = await supabase
          .from('employment_history')
          .insert(dummyEmployment)
          .select();

        if (createEmploymentError) throw createEmploymentError;
        setEmploymentHistory(newEmploymentData || []);
      } else {
        setEmploymentHistory(employmentData || []);
      }

    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileForm)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({ ...profile!, ...profileForm });
      setEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const updateEmployment = async (id: string) => {
    if (!user || !employmentForm.company || !employmentForm.position || !employmentForm.start_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const employmentData = {
        company: employmentForm.company,
        position: employmentForm.position,
        employment_type: employmentForm.employment_type,
        location: employmentForm.location || null,
        start_date: format(employmentForm.start_date, 'yyyy-MM-dd'),
        end_date: employmentForm.end_date ? format(employmentForm.end_date, 'yyyy-MM-dd') : null,
        is_current: employmentForm.is_current,
        description: employmentForm.description || null
      };

      const { data, error } = await supabase
        .from('employment_history')
        .update(employmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEmploymentHistory(employmentHistory.map(item => item.id === id ? data : item));
      setShowEmploymentDialog(false);
      resetEmploymentForm();
      toast({
        title: "Success",
        description: "Employment record updated successfully",
      });
    } catch (error) {
      console.error('Error updating employment:', error);
      toast({
        title: "Error",
        description: "Failed to update employment record",
        variant: "destructive",
      });
    }
  };

  const deleteEmployment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employment_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEmploymentHistory(employmentHistory.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Employment record deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting employment:', error);
      toast({
        title: "Error",
        description: "Failed to delete employment record",
        variant: "destructive",
      });
    }
  };

  const addEmployment = async () => {
    if (!user || !employmentForm.company || !employmentForm.position || !employmentForm.start_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const employmentData = {
        user_id: user.id,
        company: employmentForm.company,
        position: employmentForm.position,
        employment_type: employmentForm.employment_type,
        location: employmentForm.location || null,
        start_date: format(employmentForm.start_date, 'yyyy-MM-dd'),
        end_date: employmentForm.end_date ? format(employmentForm.end_date, 'yyyy-MM-dd') : null,
        is_current: employmentForm.is_current,
        description: employmentForm.description || null
      };

      const { data, error } = await supabase
        .from('employment_history')
        .insert(employmentData)
        .select()
        .single();

      if (error) throw error;

      setEmploymentHistory([data, ...employmentHistory]);
      setShowEmploymentDialog(false);
      resetEmploymentForm();
      toast({
        title: "Success",
        description: "Employment record added successfully",
      });
    } catch (error) {
      console.error('Error adding employment:', error);
      toast({
        title: "Error",
        description: "Failed to add employment record",
        variant: "destructive",
      });
    }
  };

  const resetEmploymentForm = () => {
    setEmploymentForm({
      company: "",
      position: "",
      employment_type: "full-time",
      location: "",
      start_date: undefined,
      end_date: undefined,
      is_current: false,
      description: ""
    });
    setEditingEmployment(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/")}>
                ← Back to Home
              </Button>
              <h1 className="text-2xl font-bold">Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Information */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8" />
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your personal and professional details</CardDescription>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setEditingProfile(!editingProfile)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {editingProfile ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Current Company</Label>
                  <Input
                    id="company"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Current Role</Label>
                  <Input
                    id="role"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={updateProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-muted-foreground">{profile?.full_name || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Company</Label>
                  <p className="text-sm text-muted-foreground">{profile?.company || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Role</Label>
                  <p className="text-sm text-muted-foreground">{profile?.role || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bio</Label>
                  <p className="text-sm text-muted-foreground">{profile?.bio || "No bio provided"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8" />
                <div>
                  <CardTitle>Employment History</CardTitle>
                  <CardDescription>Track your career journey and experience</CardDescription>
                </div>
              </div>
              <Dialog open={showEmploymentDialog} onOpenChange={setShowEmploymentDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetEmploymentForm()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Position
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEmployment ? "Edit Employment" : "Add New Position"}
                    </DialogTitle>
                    <DialogDescription>
                      Add details about your work experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={employmentForm.company}
                        onChange={(e) => setEmploymentForm({ ...employmentForm, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={employmentForm.position}
                        onChange={(e) => setEmploymentForm({ ...employmentForm, position: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="employment_type">Employment Type</Label>
                      <Select value={employmentForm.employment_type} onValueChange={(value) => setEmploymentForm({ ...employmentForm, employment_type: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="temporary">Temporary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={employmentForm.location}
                        onChange={(e) => setEmploymentForm({ ...employmentForm, location: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !employmentForm.start_date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {employmentForm.start_date ? (
                                format(employmentForm.start_date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={employmentForm.start_date}
                              onSelect={(date) => setEmploymentForm({ ...employmentForm, start_date: date })}
                              disabled={(date) =>
                                date > new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !employmentForm.end_date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {employmentForm.end_date ? (
                                format(employmentForm.end_date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={employmentForm.end_date}
                              onSelect={(date) => setEmploymentForm({ ...employmentForm, end_date: date })}
                              disabled={(date) =>
                                date > new Date() || (employmentForm.start_date && date < employmentForm.start_date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="is_current">Currently Employed</Label>
                      <Input
                        type="checkbox"
                        id="is_current"
                        checked={employmentForm.is_current}
                        onChange={(e) => setEmploymentForm({ ...employmentForm, is_current: e.target.checked })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={employmentForm.description}
                        onChange={(e) => setEmploymentForm({ ...employmentForm, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={() => setShowEmploymentDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" onClick={() => {
                      if (editingEmployment) {
                        updateEmployment(editingEmployment);
                      } else {
                        addEmployment();
                      }
                    }}>
                      {editingEmployment ? "Update Position" : "Add Position"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {employmentHistory.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{job.position}</h3>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.is_current && <Badge variant="secondary">Current</Badge>}
                      <Badge variant="outline">{job.employment_type}</Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Employment</DialogTitle>
                            <DialogDescription>
                              Edit details about your work experience
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div>
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                defaultValue={job.company}
                                onChange={(e) => setEmploymentForm({ ...employmentForm, company: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="position">Position</Label>
                              <Input
                                id="position"
                                defaultValue={job.position}
                                onChange={(e) => setEmploymentForm({ ...employmentForm, position: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="employment_type">Employment Type</Label>
                              <Select defaultValue={job.employment_type} onValueChange={(value) => setEmploymentForm({ ...employmentForm, employment_type: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full-time">Full-time</SelectItem>
                                  <SelectItem value="part-time">Part-time</SelectItem>
                                  <SelectItem value="contract">Contract</SelectItem>
                                  <SelectItem value="internship">Internship</SelectItem>
                                  <SelectItem value="temporary">Temporary</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                defaultValue={job.location || ""}
                                onChange={(e) => setEmploymentForm({ ...employmentForm, location: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Start Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !employmentForm.start_date && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {employmentForm.start_date ? (
                                        format(employmentForm.start_date, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={employmentForm.start_date}
                                      onSelect={(date) => setEmploymentForm({ ...employmentForm, start_date: date })}
                                      disabled={(date) =>
                                        date > new Date()
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !employmentForm.end_date && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {employmentForm.end_date ? (
                                        format(employmentForm.end_date, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={employmentForm.end_date}
                                      onSelect={(date) => setEmploymentForm({ ...employmentForm, end_date: date })}
                                      disabled={(date) =>
                                        date > new Date() || (employmentForm.start_date && date < employmentForm.start_date)
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="is_current">Currently Employed</Label>
                              <Input
                                type="checkbox"
                                id="is_current"
                                checked={employmentForm.is_current}
                                onChange={(e) => setEmploymentForm({ ...employmentForm, is_current: e.target.checked })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                defaultValue={job.description || ""}
                                onChange={(e) => setEmploymentForm({ ...employmentForm, description: e.target.value })}
                                rows={4}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={() => setShowEmploymentDialog(false)}>
                              Cancel
                            </Button>
                            <Button type="submit" onClick={() => {
                              updateEmployment(job.id);
                            }}>
                              Update Position
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" onClick={() => deleteEmployment(job.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span>{format(new Date(job.start_date), 'MMM yyyy')} - {job.end_date ? format(new Date(job.end_date), 'MMM yyyy') : 'Present'}</span>
                    {job.location && <span>• {job.location}</span>}
                  </div>
                  {job.description && (
                    <p className="text-sm text-muted-foreground mt-2">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
