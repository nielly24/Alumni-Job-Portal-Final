import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Building, Calendar, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface EmploymentHistory {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  employment_type: string;
  location: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
  });

  const [jobForm, setJobForm] = useState({
    company: '',
    position: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    employment_type: 'full-time',
    location: '',
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      setUser(user);
      await fetchProfile(user.id);
      await fetchEmploymentHistory(user.id);
      setLoading(false);
    };

    getUser();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setProfile(data);
      setProfileForm({
        full_name: data.full_name || '',
        bio: data.bio || '',
      });
    }
  };

  const fetchEmploymentHistory = async (userId: string) => {
    const { data, error } = await supabase
      .from('employment_history')
      .select('*')
      .eq('user_id', userId)
      .order('is_current', { ascending: false })
      .order('start_date', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch employment history",
        variant: "destructive",
      });
      return;
    }

    setEmploymentHistory(data || []);
  };

  const updateProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(profileForm)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
    
    setEditingProfile(false);
    await fetchProfile(user.id);
  };

  const saveJob = async () => {
    if (!user) return;

    const jobData = {
      ...jobForm,
      user_id: user.id,
      end_date: jobForm.is_current ? null : jobForm.end_date,
    };

    let error;
    if (editingJob) {
      ({ error } = await supabase
        .from('employment_history')
        .update(jobData)
        .eq('id', editingJob));
    } else {
      ({ error } = await supabase
        .from('employment_history')
        .insert(jobData));
    }

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: editingJob ? "Job updated successfully" : "Job added successfully",
    });

    resetJobForm();
    await fetchEmploymentHistory(user.id);
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase
      .from('employment_history')
      .delete()
      .eq('id', jobId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Job deleted successfully",
    });

    await fetchEmploymentHistory(user.id);
  };

  const resetJobForm = () => {
    setJobForm({
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      employment_type: 'full-time',
      location: '',
    });
    setShowAddJob(false);
    setEditingJob(null);
  };

  const startEditingJob = (job: EmploymentHistory) => {
    setJobForm({
      company: job.company,
      position: job.position,
      start_date: job.start_date,
      end_date: job.end_date || '',
      is_current: job.is_current,
      description: job.description || '',
      employment_type: job.employment_type,
      location: job.location || '',
    });
    setEditingJob(job.id);
    setShowAddJob(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your profile and employment history</p>
      </div>

      {/* Profile Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingProfile(!editingProfile)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {editingProfile ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <Button onClick={updateProfile}>Save Changes</Button>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{profile?.full_name || 'No name set'}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              {profile?.bio && <p>{profile.bio}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employment History Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Employment History</CardTitle>
              <CardDescription>Track your career journey and job transitions</CardDescription>
            </div>
            <Button onClick={() => setShowAddJob(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add/Edit Job Form */}
          {showAddJob && (
            <Card className="mb-6 border-dashed">
              <CardHeader>
                <CardTitle>{editingJob ? 'Edit Job' : 'Add New Job'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={jobForm.position}
                      onChange={(e) => setJobForm({ ...jobForm, position: e.target.value })}
                      placeholder="Job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select value={jobForm.employment_type} onValueChange={(value) => setJobForm({ ...jobForm, employment_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={jobForm.start_date}
                      onChange={(e) => setJobForm({ ...jobForm, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={jobForm.end_date}
                      onChange={(e) => setJobForm({ ...jobForm, end_date: e.target.value })}
                      disabled={jobForm.is_current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_current"
                    checked={jobForm.is_current}
                    onChange={(e) => setJobForm({ ...jobForm, is_current: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is_current">This is my current job</Label>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={saveJob}>
                    {editingJob ? 'Update Job' : 'Add Job'}
                  </Button>
                  <Button variant="outline" onClick={resetJobForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employment History List */}
          <div className="space-y-4">
            {employmentHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No employment history added yet. Click "Add Job" to get started.
              </p>
            ) : (
              employmentHistory.map((job) => (
                <Card key={job.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{job.position}</h3>
                          {job.is_current && (
                            <Badge variant="secondary">Current</Badge>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {job.employment_type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.company}
                          </div>
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <Calendar className="w-4 h-4" />
                          {formatDate(job.start_date)} - {job.is_current ? 'Present' : job.end_date ? formatDate(job.end_date) : 'Present'}
                        </div>
                        {job.description && (
                          <p className="text-sm">{job.description}</p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditingJob(job)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;