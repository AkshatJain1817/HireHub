import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
    const [featuredJobs, setFeaturedJobs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeaturedJobs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/jobs`, {
                    params: { limit: 3, sort: '-createdAt' }
                });
                setFeaturedJobs(response.data);
            } catch (error) {
                setError('Failed to load featured jobs');
            }
        };
        fetchFeaturedJobs();
    }, []);

    return (
        <div className="home">
            <h1 className="text-3xl font-bold">Welcome to HireHub</h1>
            <p>Your premier job board for employers and job seekers. Find your next opportunity or hire top talent today!</p>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Featured Jobs</h2>
                    <ul className="featured-jobs">
                        {featuredJobs.map(job => (
                            <li key={job._id} className="featured-job">
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
                        {featuredJobs.length === 0 && <p>No featured jobs available.</p>}
                    </ul>
                </>
            )}
            <div className="home-links">
                <Link to="/login" className="text-blue-500 hover:text-blue-700 mr-4">Login</Link>
                <Link to="/signup" className="text-blue-500 hover:text-blue-700 mr-4">Sign Up</Link>
                <Link to="/jobs" className="text-blue-500 hover:text-blue-700">Browse Jobs</Link>
            </div>
        </div>
    );
}

export default Home;