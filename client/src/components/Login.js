import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('candidate');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setToken, setRole: setAuthRole } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/${role}/login`, { email, password });
            const { token } = response.data;
            setToken(token);
            setAuthRole(role);
            navigate(role === 'candidate' ? '/candidate/dashboard' : '/employer/dashboard');
        } catch (error) {
            setError(error.response.data.message || 'Login failed');
        }
    };

    return (
        <div className="login-form">
            <h2 className="text-2xl font-bold mb-4 text-center">Login to HireHub</h2>
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
                {error && <p className="error">{error}</p>}
                <button type="submit" className="form-group">Login</button>
            </form>
        </div>
    );
}

export default Login;