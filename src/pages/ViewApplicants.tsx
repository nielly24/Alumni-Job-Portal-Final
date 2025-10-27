// src/pages/ViewApplicants.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Adjust path if necessary

// Define a type for the applicant data we expect to receive
type Applicant = {
  id: number;
  motivation: string;
  profiles: { // This comes from the joined 'profiles' table
    full_name: string;
    email: string;
    // Add any other profile fields you want to display, e.g., avatar_url, bio
  };
};

const ViewApplicants = () => {
  // The 'jobId' will come from the URL, e.g., /jobs/5/applicants
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

        // Fetch applications and join with the user's profile information
        // This query gets all applications for the given job_id
        // and for each application, it fetches all columns (*) from the related 'profiles' table
        // and the 'title' from the related 'jobs' table.
        const { data, error: fetchError } = await supabase
          .from('applications')
          .select(`
            id,
            motivation,
            profiles ( full_name, email ),
            jobs ( title )
          `)
          .eq('job_id', jobId);

        if (fetchError) {
          throw fetchError;
        }

        if (data && data.length > 0) {
          // @ts-ignore
          setApplicants(data);
          // @ts-ignore
          setJobTitle(data[0].jobs.title); // Set job title from the first applicant's data
        }

      } catch (err: any) {
        setError('Failed to fetch applicants. Please try again.');
        console.error(err);
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
            <div key={applicant.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{applicant.profiles.full_name}</h2>
              <a href={`mailto:${applicant.profiles.email}`} className="text-blue-500 hover:underline text-sm">
                {applicant.profiles.email}
              </a>
              <p className="text-gray-600 mt-4">
                <span className="font-semibold">Motivation:</span>
              </p>
              <p className="bg-gray-50 p-3 rounded-md mt-1 whitespace-pre-wrap">{applicant.motivation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;