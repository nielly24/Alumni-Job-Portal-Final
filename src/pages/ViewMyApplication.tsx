// src/pages/ViewMyApplication.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

type ApplicationDetail = {
  id: number;
  cover_letter: string; 
  status: string;
  resume_uri: string | null;
  profiles: {
    full_name: string;
    email: string;
  }; 
  job_postings: {
    title: string;
  };
};

const ViewMyApplication = () => {
  const { jobId } = useParams<{ jobId: string }>(); 
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMyApplication = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth'); 
        return;
      }
      
      const { data, error: fetchError } = await supabase
        .from('job_applications')
        .select(`
          id,
          cover_letter,
          status,
          resume_uri,
          profiles!fk_applicant ( full_name, email ),
          job_postings!fk_job_link ( title )
        `)
        .eq('job_id', jobId)
        .eq('applicant_id', user.id) // Filter by the current user's ID
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows found"
        throw fetchError;
      }

      setApplication(data as unknown as ApplicationDetail | null);

    } catch (err: any) {
      setError('Failed to load application status. Please check your network.');
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplication();
  }, [jobId]);

  // Helper to determine badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Accepted':
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected':
      case 'Denied': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) { return <div className="text-center p-10">Loading application status...</div>; }
  if (error) { return <div className="text-center p-10 text-red-500">{error}</div>; }

  if (!application) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Jobs</Link>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold">Application Not Found</h2>
            <p className="text-gray-600">You have not submitted an application for this position.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Jobs</Link>
      <h1 className="text-3xl font-bold mb-2">My Application Status</h1>
      <h2 className="text-xl text-gray-700 mb-6">For: {application.job_postings.title}</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-2xl mx-auto">
        
        <div className="flex justify-between items-start border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Application Details</h3>
        </div>
        
        {/* Applicant Name and Status */}
        <div className="mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{application.profiles.full_name}</h2>
                    <a href={`mailto:${application.profiles.email}`} className="text-blue-500 hover:underline text-sm">
                        {application.profiles.email}
                    </a>
                </div>
                {/* Status Badge - Always Visible */}
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(application.status)}`}>
                    {application.status}
                </span>
            </div>
        </div>

        {/* Resume Link */}
        {application.resume_uri && (
            <div className="mb-4">
                <p className="font-semibold text-gray-800">Resume URL:</p>
                <a 
                    href={application.resume_uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline text-sm break-all"
                >
                    {application.resume_uri}
                </a>
            </div>
        )}

        {/* Cover Letter */}
        <p className="text-gray-600"><span className="font-semibold">Cover Letter:</span></p>
        <p className="bg-gray-50 p-3 rounded-md mt-1 whitespace-pre-wrap">{application.cover_letter}</p>
        
        <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            You can track all application updates on this page.
        </div>
      </div>
    </div>
  );
};

export default ViewMyApplication;