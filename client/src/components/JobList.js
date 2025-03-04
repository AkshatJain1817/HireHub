import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('/api/jobs');
                setJobs(response.data);
            } catch (error) {
                setError('Failed to load jobs');
            }
        };
        fetchJobs();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Job Listings - HireHub</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job._id}>
                        <Link to={`/jobs/${job._id}`}>{job.title} - {job.location}</Link>
                        {job.employerId?.companyName && ` (Posted by: ${job.employerId.companyName})`}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default JobList;