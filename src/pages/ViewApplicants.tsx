// src/pages/ViewApplicants.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Make sure this path is correct

// Type definition for the applicant data
type Applicant = {
  id: number;
  motivation: string;
  profiles: {
    full_name: string;
    email: string;
  }[];
  job_postings: {
    title: string;
  }[];
};

const ViewApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>(); 
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) return;

      try {
        setLoading(true);
        setError(null);
        
        // --- THIS IS THE FIX ---
        // Corrected the table name to match your database.
        const applicationsTableName = 'job_applications';

        const { data, error: fetchError } = await supabase
          .from(applicationsTableName)
          .select(`
            id,
            motivation,
            profiles!inner ( full_name, email ),
            job_postings!inner ( title )
          `)
          .eq('job_id', jobId);
        
        if (fetchError) {
          console.error("Supabase fetch error:", fetchError);
          throw fetchError;
        }

        if (data && data.length > 0) {
          setApplicants(data);
          setJobTitle(data[0].job_postings[0].title);
        }

      } catch (err: any) {
        setError('Failed to fetch applicants. Please try again.');
        console.error("Error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) {
    return <div className="text-center p-10">Loading applicants...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Jobs</Link>
      <h1 className="text-3xl font-bold mb-2">Applicants for: <span className="text-gray-700">{jobTitle}</span></h1>
      
      {applicants.length === 0 ? (
        <p className="bg-gray-100 p-6 rounded-lg text-center text-gray-600 mt-4">No one has applied for this job yet.</p>
      ) : (
        <div className="space-y-6 mt-4">
          {applicants.map((applicant) => (
            applicant.profiles && applicant.profiles.length > 0 && (
              <div key={applicant.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">{applicant.profiles[0].full_name}</h2>
                <a href={`mailto:${applicant.profiles[0].email}`} className="text-blue-500 hover:underline text-sm">
                  {applicant.profiles[0].email}
                </a>
                <p className="text-gray-600 mt-4">
                  <span className="font-semibold">Motivation:</span>
                </p>
                <p className="bg-gray-50 p-3 rounded-md mt-1 whitespace-pre-wrap">{applicant.motivation}</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;