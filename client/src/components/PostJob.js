import React, { useState } from 'react'; // Add useState
import { useNavigate } from 'react-router-dom'; // Add useNavigate
import { useAuth } from '../context/AuthContext'; // Add this line
import axios from 'axios';

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
            await axios.post('/api/jobs', {
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
        <div>
            <h2>Post a Job - HireHub</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Job Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Job Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Salary (optional)"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                />
                <button type="submit">Post Job</button>
            </form>
        </div>
    );
}

export default PostJob;