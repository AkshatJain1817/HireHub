import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SearchJobs() {
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Search Jobs - HireHub</h2>
            <input
                type="text"
                placeholder="Search jobs by title, description, or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredJobs.map(job => (
                    <li key={job._id}>
                        <Link to={`/jobs/${job._id}`}>{job.title} - {job.location}</Link>
                        {job.employerId?.companyName && ` (Posted by: ${job.employerId.companyName})`}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchJobs;