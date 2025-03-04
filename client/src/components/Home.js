import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                // Fetch the latest jobs (e.g., limit to 3) or featured jobs (you can modify the backend to mark jobs as featured)
                const response = await axios.get('/api/jobs', {
                    params: { limit: 3, sort: '-createdAt' } // Get 3 most recent jobs, sorted by creation date descending
                });
                setFeaturedJobs(response.data);
            } catch (error) {
                setError('Failed to load featured jobs');
            }
        };
        fetchFeaturedJobs();
    }, []);

    return (
        <div className="home" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome to HireHub</h1>
            <p>Your premier job board for employers and job seekers. Find your next opportunity or hire top talent today!</p>
            {error ? (
                <p>{error}</p>
            ) : (
                <>
                    <h2>Featured Jobs</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {featuredJobs.map(job => (
                            <li key={job._id} style={{ margin: '1rem 0', borderBottom: '1px solid #ccc' }}>
                                <Link to={`/jobs/${job._id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                                    {job.title} - {job.location}
                                </Link>
                                {job.employerId?.companyName && ` (Posted by: ${job.employerId.companyName})`}
                            </li>
                        ))}
                        {featuredJobs.length === 0 && <p>No featured jobs available.</p>}
                    </ul>
                </>
            )}
            <div style={{ marginTop: '2rem' }}>
                <Link to="/login" style={{ margin: '0 1rem', color: '#007bff', textDecoration: 'none' }}>Login</Link>
                <Link to="/signup" style={{ margin: '0 1rem', color: '#007bff', textDecoration: 'none' }}>Sign Up</Link>
                <Link to="/jobs" style={{ margin: '0 1rem', color: '#007bff', textDecoration: 'none' }}>Browse Jobs</Link>
            </div>
        </div>
    );
}

export default Home;