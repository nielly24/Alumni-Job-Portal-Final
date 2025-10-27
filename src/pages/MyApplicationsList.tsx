// src/pages/MyApplicationsList.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import { ArrowRight } from 'lucide-react';

interface ApplicationSummary {
    id: number;
    status: string;
    created_at: string;
    job_postings: {
        id: string;
        title: string;
        company: string;
    };
}

const MyApplicationsList = () => {
    const [applications, setApplications] = useState<ApplicationSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchApplications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }

            // Fetch all applications linked to the current user
            const { data, error } = await supabase
                .from('job_applications')
                .select(`
                    id,
                    status,
                    created_at,
                    job_postings!fk_job_link ( id, title, company )
                `)
                .eq('applicant_id', user.id) // Filter by current user's ID
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data as unknown as ApplicationSummary[]);

        } catch (err: any) {
            setError('Failed to load application history.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    // Helper for badge styling (must match ViewMyApplication)
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Accepted':
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected':
            case 'Denied': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) return <div className="text-center p-10">Loading applications...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>
            
            {applications.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold">No applications found.</h2>
                    <p className="text-gray-600 mt-2">Browse the job board to find a new opportunity.</p>
                    <Link to="/jobs" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app.id} className="p-4 bg-white border rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">{app.job_postings.title}</h2>
                                <p className="text-sm text-gray-600">{app.job_postings.company} - Applied on {new Date(app.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(app.status)}`}>
                                    {app.status}
                                </span>
                                {/* Link to the detailed status view (ViewMyApplication.tsx) */}
                                <Link 
                                    to={`/my-application/${app.job_postings.id}`} 
                                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                                >
                                    View Details <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplicationsList;