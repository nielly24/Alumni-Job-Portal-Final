import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export const useVerificationStatus = (userId?: string) => {
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('verification_status')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        
        setStatus(data?.verification_status as VerificationStatus || 'pending');
      } catch (error) {
        console.error('Error fetching verification status:', error);
        toast({
          title: "Error",
          description: "Failed to fetch verification status",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [userId, toast]);

  return { status, loading, isApproved: status === 'approved' };
};