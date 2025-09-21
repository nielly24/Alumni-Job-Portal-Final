import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, GraduationCap, Settings, ArrowLeft } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  role: string | null;
  bio: string | null;
  created_at: string;
}

interface UserWithRole {
  profile: Profile;
  user_role: string;
}

const Admin = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { role: userRole, loading: roleLoading } = useUserRole(currentUser?.id);

  useEffect(() => {
    // Only deny access if we have a definitive role that's not admin
    if (!roleLoading && currentUser && userRole && userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [userRole, roleLoading, currentUser, navigate, toast]);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAllUsers();
    }
  }, [userRole]);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles for all users
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = profiles?.map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        return {
          profile,
          user_role: userRole?.role || 'alumni'
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'employer' | 'alumni') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      // Refresh the users list
      fetchAllUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'employer': return 'default';
      case 'alumni': return 'secondary';
      default: return 'outline';
    }
  };

  const filterUsersByRole = (targetRole: string) => {
    return users.filter(user => user.user_role === targetRole);
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null; // Will redirect in useEffect
  }

  const employers = filterUsersByRole('employer');
  const alumni = filterUsersByRole('alumni');
  const admins = filterUsersByRole('admin');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and view system statistics</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alumni</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alumni.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Employers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admins.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="alumni">Alumni</TabsTrigger>
                <TabsTrigger value="employer">Employers</TabsTrigger>
                <TabsTrigger value="admin">Admins</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <UserList users={users} onRoleUpdate={updateUserRole} />
              </TabsContent>

              <TabsContent value="alumni" className="space-y-4">
                <UserList users={alumni} onRoleUpdate={updateUserRole} />
              </TabsContent>

              <TabsContent value="employer" className="space-y-4">
                <UserList users={employers} onRoleUpdate={updateUserRole} />
              </TabsContent>

              <TabsContent value="admin" className="space-y-4">
                <UserList users={admins} onRoleUpdate={updateUserRole} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface UserListProps {
  users: UserWithRole[];
  onRoleUpdate: (userId: string, newRole: 'admin' | 'employer' | 'alumni') => void;
}

const UserList = ({ users, onRoleUpdate }: UserListProps) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'employer': return 'default';
      case 'alumni': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.profile.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {user.profile.full_name || 'No name provided'}
                </h3>
                <Badge variant={getRoleBadgeVariant(user.user_role)}>
                  {user.user_role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {user.profile.company || 'No company'} • {user.profile.role || 'No role'}
              </p>
              {user.profile.bio && (
                <p className="text-sm text-muted-foreground mt-2">{user.profile.bio}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Joined: {new Date(user.profile.created_at).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoleUpdate(user.profile.user_id, 'alumni')}
                disabled={user.user_role === 'alumni'}
              >
                Alumni
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoleUpdate(user.profile.user_id, 'employer')}
                disabled={user.user_role === 'employer'}
              >
                Employer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRoleUpdate(user.profile.user_id, 'admin')}
                disabled={user.user_role === 'admin'}
              >
                Admin
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found in this category
        </div>
      )}
    </div>
  );
};

export default Admin;