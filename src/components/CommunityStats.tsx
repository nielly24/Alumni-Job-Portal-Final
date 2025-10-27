import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";

interface Stats {
  alumni: number;
  total: number;
}

const CommunityStats = () => {
  const [stats, setStats] = useState<Stats>({ alumni: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // --- FIX 1: Query for ALUMNI Count ---
        // Alumni status is determined by the user_roles table, not a column in 'profiles'.
        const { count: alumniCount, error: alumniError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'alumni'); // Assuming 'role' is the column name in user_roles

        if (alumniError) throw alumniError;

        // --- FIX 2: Query for TOTAL Users Count ---
        // Total count is the total number of profiles.
        const { count: totalCount, error: totalError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;

        setStats({
          alumni: alumniCount || 0,
          total: totalCount || 0 // Use the dedicated total count
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Growing Community</h2>
            <p className="text-muted-foreground">Loading statistics...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Growing Community</h2>
          <p className="text-muted-foreground">
            Join thousands of Computer Engineering professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">{stats.alumni.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Alumni Members</p>
              <p className="text-sm text-muted-foreground mt-1">
                CpE graduates networking and growing careers
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl font-bold">{stats.total.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Total Community</p>
              <p className="text-sm text-muted-foreground mt-1">
                Connected professionals and opportunities
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CommunityStats;