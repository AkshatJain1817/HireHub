import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function EmployerDashboard() {
    const { token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch jobs
                const jobsResponse = await axios.get('/api/jobs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobs(jobsResponse.data);

                // Fetch applications for this employer
                const applicationsResponse = await axios.get('/api/applications/employer', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(applicationsResponse.data);
            } catch (error) {
                setError('Failed to load data');
            }
        };
        fetchData();
    }, [token]);

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await axios.put(`/api/applications/${applicationId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(applications.map(app =>
                app._id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            setError('Failed to update application status');
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Employer Dashboard - HireHub</h2>
            <p>Welcome, manage your job postings and applications here!</p>
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
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                setJobs(jobs.filter(j => j._id !== job._id));
                            } catch (error) {
                                setError('Failed to delete job');
                            }
                        }}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Applications for Your Jobs</h3>
            <ul>
                {applications.map(application => (
                    <li key={application._id}>
                        {application.candidateId?.fullName || 'Anonymous'} applied for {application.jobId?.title} - 
                        Location: {application.jobId?.location || 'Not specified'} - 
                        Status: {application.status || 'Pending'}
                        <select
                            value={application.status}
                            onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                            style={{ marginLeft: '1rem' }}
                        >
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </li>
                ))}
            </ul>
            {applications.length === 0 && <p>No applications for your jobs.</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default EmployerDashboard;