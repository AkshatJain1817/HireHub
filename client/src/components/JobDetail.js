import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function JobDetail() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [error, setError] = useState('');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

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

    if (error) return <p>{error}</p>;
    if (!job) return <p>Loading...</p>;

    return (
        <div>
            <h2>{job.title}</h2>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Salary:</strong> {job.salary ? `$${job.salary}` : 'Not specified'}</p>
            <p><strong>Posted by:</strong> {job.employerId?.companyName}</p>
            {role === 'candidate' && token && (
                <Link to={`/jobs/${id}/apply`}>Apply Now</Link>
            )}
        </div>
    );
}

export default JobDetail;