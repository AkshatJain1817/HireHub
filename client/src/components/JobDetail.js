import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './JobDetail.css';

function JobDetail() {
    const { id } = useParams();
    const { token, role } = useAuth();
    const [job, setJob] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`/api/jobs/${id}`);
                setJob(response.data);
            } catch (error) {
                setError('Failed to load job details');
            }
        };
        fetchJob();
    }, [id]);

    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!job) return <p className="text-center">Loading...</p>;

    return (
        <div className="job-detail">
            <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
            <p className="mb-2"><strong>Description:</strong> {job.description}</p>
            <p className="mb-2"><strong>Location:</strong> {job.location}</p>
            <p className="mb-2"><strong>Salary:</strong> {job.salary ? `$${job.salary}` : 'Not specified'}</p>
            <p className="mb-4"><strong>Posted by:</strong> {job.employerId?.companyName}</p>
            {role === 'candidate' && token && (
                <Link to={`/jobs/${id}/apply`} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Apply Now
                </Link>
            )}
        </div>
    );
}

export default JobDetail;