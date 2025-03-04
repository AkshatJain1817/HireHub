import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Signup.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('candidate');
    const [extraField, setExtraField] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setToken, setRole: setAuthRole } = useAuth();

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
            setToken(token);
            setAuthRole(role);
            navigate(role === 'candidate' ? '/candidate/dashboard' : '/employer/dashboard');
        } catch (error) {
            setError(error.response.data.message || 'Signup failed');
        }
    };

    return (
        <div className="signup-form">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up for HireHub</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-group"
                >
                    <option value="candidate">Job Seeker</option>
                    <option value="employer">Employer</option>
                </select>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-group"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-group"
                />
                {role === 'employer' ? (
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={extraField}
                        onChange={(e) => setExtraField(e.target.value)}
                        required
                        className="form-group"
                    />
                ) : (
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={extraField}
                        onChange={(e) => setExtraField(e.target.value)}
                        required
                        className="form-group"
                    />
                )}
                {error && <p className="error">{error}</p>}
                <button type="submit" className="form-group">Sign Up</button>
            </form>
        </div>
    );
}

export default Signup;