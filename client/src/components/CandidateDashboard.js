import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CandidateDashboard() {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/applications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(response.data);
            } catch (error) {
                setError('Failed to load applications');
            }
        };
        fetchApplications();
    }, []);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Candidate Dashboard - HireHub</h2>
            <p>Welcome, manage your job applications here!</p>
            <h3>Your Applications</h3>
            <ul>
                {applications.map(application => (
                    <li key={application._id}>
                        {application.jobId?.title || 'Job Title'} - 
                        Location: {application.jobId?.location || 'Not specified'} - 
                        Status: {application.status || 'Pending'}
                    </li>
                ))}
            </ul>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default CandidateDashboard;