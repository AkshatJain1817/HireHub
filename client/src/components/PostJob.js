import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './PostJob.css';

function PostJob() {
    const { token } = useAuth(); // Use token from AuthContext
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/jobs`, {
                title,
                description,
                location,
                salary: salary ? parseFloat(salary) : undefined
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/jobs');
        } catch (error) {
            setError(error.response.data.message || 'Failed to post job');
        }
    };

    return (
        <div className="post-job">
            <h2 className="text-2xl font-bold mb-4">Post a Job - HireHub</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-group"
                />
                <textarea
                    placeholder="Job Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="form-group"
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="form-group"
                />
                <input
                    type="number"
                    placeholder="Salary (optional)"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="form-group"
                />
                <button type="submit" className="form-group">Post Job</button>
            </form>
        </div>
    );
}

export default PostJob;