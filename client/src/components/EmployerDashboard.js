import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './EmployerDashboard.css';

function EmployerDashboard() {
    const { token } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobs(jobsResponse.data);

                const applicationsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/applications/employer`, {
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
            await axios.put(`${process.env.REACT_APP_API_URL}/api/applications/${applicationId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(applications.map(app =>
                app._id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            setError('Failed to update application status');
        }
    };

    const handleJobDelete = async (jobId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(jobs.filter(j => j._id !== jobId));
        } catch (error) {
            setError('Failed to delete job');
        }
    };

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="employer-dashboard">
            <h2 className="text-2xl font-bold mb-4">Employer Dashboard - HireHub</h2>
            <p className="mb-4">Welcome, manage your job postings and applications here!</p>
            <Link to="/post-job" className="mb-4 inline-block">Post a New Job</Link>
            <div className="dashboard-section">
                <h3 className="text-xl font-bold mb-2">Your Job Listings</h3>
                <ul className="job-list">
                    {jobs.map(job => (
                        <li key={job._id} className="job-item">
                            {job.title} - {job.location}
                            <Link to={`/jobs/${job._id}`} className="ml-2">View</Link> | 
                            <Link to={`/jobs/${job._id}/edit`} className="ml-2">Edit</Link> | 
                            <button onClick={() => handleJobDelete(job._id)} className="delete-btn ml-2">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="dashboard-section">
                <h3 className="text-xl font-bold mb-2">Applications for Your Jobs</h3>
                <ul className="application-list">
                    {applications.map(application => (
                        <li key={application._id} className="application-item">
                            {application.candidateId?.fullName || 'Anonymous'} applied for {application.jobId?.title} - 
                            Location: {application.jobId?.location || 'Not specified'} - 
                            Status: {application.status || 'Pending'}
                            <select
                                value={application.status}
                                onChange={(e) => handleStatusUpdate(application._id, e.target.value)}
                                className="ml-2 p-1 border rounded"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Reviewed">Reviewed</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </li>
                    ))}
                </ul>
                {applications.length === 0 && <p className="text-center">No applications for your jobs.</p>}
            </div>
        </div>
    );
}

export default EmployerDashboard;