import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function SearchJobs() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';

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

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.location.toLowerCase().includes(query.toLowerCase())
    );

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Search Jobs - HireHub</h2>
            <ul>
                {filteredJobs.map(job => (
                    <li key={job._id}>
                        <Link to={`/jobs/${job._id}`}>{job.title} - {job.location}</Link>
                        {job.employerId?.companyName && ` (Posted by: ${job.employerId.companyName})`}
                    </li>
                ))}
            </ul>
            {filteredJobs.length === 0 && <p>No jobs found matching your search.</p>}
        </div>
    );
}

export default SearchJobs;