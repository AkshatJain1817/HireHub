import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup({ setToken, setRole }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setLocalRole] = useState('candidate'); // Default to candidate
    const [extraField, setExtraField] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (role === 'employer') {
                response = await axios.post('/api/auth/employer/register', { email, password, companyName: extraField });
            } else {
                response = await axios.post('/api/auth/candidate/register', { email, password, fullName: extraField });
            }
            const { token } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            setToken(token);
            setRole(role);
            navigate(role === 'candidate' ? '/candidate/dashboard' : '/employer/dashboard');
        } catch (error) {
            setError(error.response.data.message || 'Signup failed');
        }
    };

    return (
        <div>
            <h2>Sign Up for HireHub</h2>
            <form onSubmit={handleSubmit}>
                <select value={role} onChange={(e) => setLocalRole(e.target.value)}>
                    <option value="candidate">Job Seeker</option>
                    <option value="employer">Employer</option>
                </select>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {role === 'employer' ? (
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={extraField}
                        onChange={(e) => setExtraField(e.target.value)}
                        required
                    />
                ) : (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={extraField}
                        onChange={(e) => setExtraField(e.target.value)}
                        required
                    />
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;