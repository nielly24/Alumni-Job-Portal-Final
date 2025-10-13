import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface VerificationBannerProps {
  userId: string;
}

const VerificationBanner = ({ userId }: VerificationBannerProps) => {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('verification_status')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;
        setVerificationStatus(data?.verification_status || 'pending');
      } catch (error) {
        console.error('Error fetching verification status:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchVerificationStatus();
    }
  }, [userId]);

  if (loading || !verificationStatus) return null;

  if (verificationStatus === 'approved') return null;

  if (verificationStatus === 'pending') {
    return (
      <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <Clock className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-900 dark:text-yellow-100">Account Pending Verification</AlertTitle>
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          Your account is awaiting admin approval. You can browse jobs but cannot post jobs or apply until verified.
        </AlertDescription>
      </Alert>
    );
  }

  if (verificationStatus === 'rejected') {
    return (
      <Alert className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
        <XCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-900 dark:text-red-100">Account Verification Rejected</AlertTitle>
        <AlertDescription className="text-red-800 dark:text-red-200">
          Your account verification was not approved. Please contact support for more information.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default VerificationBanner;
