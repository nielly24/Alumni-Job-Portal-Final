import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VerificationGuardProps {
  children: React.ReactNode;
}

export const VerificationGuard = ({ children }: VerificationGuardProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { status, loading: statusLoading, isApproved } = useVerificationStatus(user?.id);

  if (loading || statusLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <>{children}</>;
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              {status === 'rejected' ? (
                <AlertCircle className="w-6 h-6 text-red-500" />
              ) : (
                <Clock className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            <CardTitle>
              {status === 'rejected' ? 'Account Rejected' : 'Account Pending Verification'}
            </CardTitle>
            <CardDescription>
              {status === 'rejected' 
                ? 'Your account has been rejected by an administrator.' 
                : 'Your account is pending admin verification.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                {status === 'rejected' 
                  ? 'Please contact an administrator if you believe this is an error.'
                  : 'An administrator will review your account and ID number. You will be notified once your account is approved.'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};