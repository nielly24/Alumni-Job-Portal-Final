import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'admin' | 'alumni';

export const useUserRole = (userId?: string) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      console.log('useUserRole: No userId provided');
      setLoading(false);
      return;
    }

    console.log('useUserRole: Fetching role for userId:', userId);

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        console.log('useUserRole: Query result:', { data, error });

        if (error) throw error;
        
        const userRole = data?.role || 'alumni';
        console.log('useUserRole: Setting role to:', userRole);
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
        console.log('useUserRole: Defaulting to alumni role');
        setRole('alumni');
        toast({
          title: "Error",
          description: "Failed to fetch user role",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [userId, toast]);

  return { role, loading, isAdmin: role === 'admin' };
};