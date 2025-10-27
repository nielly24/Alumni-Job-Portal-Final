// src/pages/ViewApplicants.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 

// Type definition for the applicant data
type Applicant = {
  id: number;
  cover_letter: string; 
  status: string;
  // --- FIX: Add resume_uri to the type definition ---
  resume_uri: string | null;
  profiles: {
    full_name: string;
    email: string;
  }; 
  job_postings: {
    title: string;
  };
};

const ViewApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>(); 
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch applicants
  const fetchApplicants = async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      setError(null);
      
      // The select statement forces the return structure into the Applicant type
      const { data, error: fetchError } = await supabase
        .from('job_applications')
        .select(`
          id,
          cover_letter,
          status,
          resume_uri,  // --- FIX: Request the resume_uri from the database ---
          profiles!fk_applicant ( full_name, email ),
          job_postings!fk_job_link ( title )
        `)
        .eq('job_id', jobId);
      
      if (fetchError) { throw fetchError; }

      // We must cast the data here to match the Applicant[] type structure
      if (data && data.length > 0) {
        setApplicants(data as unknown as Applicant[]);
        setJobTitle((data[0] as unknown as Applicant).job_postings.title);
      }

    } catch (err: any) {
      setError('Failed to fetch applicants. Please try again.');
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleUpdateStatus = async (applicationId: number, newStatus: 'Accepted' | 'Rejected') => {
    setApplicants(applicants.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));

    const { error } = await supabase
      .from('job_applications')
      .update({ status: newStatus })
      .eq('id', applicationId);

    if (error) {
      console.error("Error updating status:", error);
      alert('Failed to update status. Please try again.');
      fetchApplicants();
    }
  };

  if (loading) { return <div className="text-center p-10">Loading applicants...</div>; }
  if (error) { return <div className="text-center p-10 text-red-500">{error}</div>; }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Jobs</Link>
      <h1 className="text-3xl font-bold mb-2">Applicants for: <span className="text-gray-700">{jobTitle}</span></h1>
      
      {applicants.length === 0 ? (
        <p className="bg-gray-100 p-6 rounded-lg text-center text-gray-600 mt-4">No one has applied for this job yet.</p>
      ) : (
        <div className="space-y-6 mt-4">
          {applicants.map((applicant) => (
            // Access is simplified since the type is now a single object
            <div key={applicant.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{applicant.profiles.full_name}</h2>
                  <a href={`mailto:${applicant.profiles.email}`} className="text-blue-500 hover:underline text-sm">
                    {applicant.profiles.email}
                  </a>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(applicant.status)}`}>
                  {applicant.status}
                </span>
              </div>
              
              {/* --- FIX: Displaying the full Resume URL text --- */}
              {applicant.resume_uri && (
                  <div className="mt-4 pb-2">
                      <p className="font-semibold text-gray-800">Resume URL:</p>
                      <a 
                          href={applicant.resume_uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 hover:underline text-sm break-all"
                      >
                          {applicant.resume_uri} {/* Shows the full URL text */}
                      </a>
                  </div>
              )}

              <p className="text-gray-600 mt-4"><span className="font-semibold">Cover Letter:</span></p>
              <p className="bg-gray-50 p-3 rounded-md mt-1 whitespace-pre-wrap">{applicant.cover_letter}</p>
              
              <div className="flex gap-4 mt-4 border-t pt-4">
                <button 
                  onClick={() => handleUpdateStatus(applicant.id, 'Accepted')} 
                  disabled={applicant.status === 'Accepted'}
                  className="flex-1 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition"
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleUpdateStatus(applicant.id, 'Rejected')} 
                  disabled={applicant.status === 'Rejected'}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;