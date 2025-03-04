import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './JobList.css';

function JobList() {
    const { token } = useAuth();
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

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="job-list">
            <h2 className="text-2xl font-bold mb-4">Job Listings - HireHub</h2>
            <ul className="job-grid">
                {jobs.map(job => (
                    <li key={job._id} className="job-item">
                        <Link to={`/jobs/${job._id}`}>
                            {job.title} - {job.location}
                        </Link>
                        <div className="job-details">
                            <p><strong>Description:</strong> {job.description || 'No description available'}</p>
                            <p><strong>Salary:</strong> {job.salary ? `$${job.salary}` : 'Not specified'}</p>
                            <p><strong>Posted by:</strong> {job.employerId?.companyName || 'Anonymous'}</p>
                            <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Not specified'}</p>
                        </div>
                    </li>
                ))}
            </ul>
            {jobs.length === 0 && <p className="text-center">No jobs available.</p>}
        </div>
    );
}

export default JobList;