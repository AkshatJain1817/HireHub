import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EmployerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/jobs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
            <h2>Employer Dashboard - HireHub</h2>
            <p>Welcome, manage your job postings here!</p>
            <Link to="/post-job">Post a New Job</Link>
            <h3>Your Job Listings</h3>
            <ul>
                {jobs.map(job => (
                    <li key={job._id}>
                        {job.title} - {job.location}
                        <Link to={`/jobs/${job._id}`}>View</Link> | 
                        <Link to={`/jobs/${job._id}/edit`}>Edit</Link> | 
                        <button onClick={async () => {
                            try {
                                await axios.delete(`/api/jobs/${job._id}`, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                                });
                                setJobs(jobs.filter(j => j._id !== job._id));
                            } catch (error) {
                                setError('Failed to delete job');
                            }
                        }}>Delete</button>
                    </li>
                ))}
            </ul>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default EmployerDashboard;