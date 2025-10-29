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
        let alumniCount = 0;
        let totalCount = 0;

        const { count: fetchedAlumniCount, error: alumniError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'alumni');

        if (alumniError) throw alumniError;
        alumniCount = fetchedAlumniCount || 0;

        const { count: fetchedTotalCount, error: totalError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (totalError) throw totalError;
        totalCount = fetchedTotalCount || 0;

        setStats({
          alumni: alumniCount,
          total: totalCount
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
              {/* --- FIX: Changed background color for consistency --- */}
              <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                {/* --- FIX: Changed icon color to be visible --- */}
                <TrendingUp className="w-6 h-6 text-primary" />
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