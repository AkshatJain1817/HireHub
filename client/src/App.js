import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployerLogin from './components/EmployerLogin';
import EmployerSignup from './components/EmployerSignup';
import CandidateLogin from './components/CandidateLogin';
import CandidateSignup from './components/CandidateSignup';
import JobList from './components/JobList';
import JobDetail from './components/JobDetail';
import PostJob from './components/PostJob';
import SearchJobs from './components/SearchJobs';
import EmployerDashboard from './components/EmployerDashboard';
import CandidateDashboard from './components/CandidateDashboard';
import ApplyJob from './components/ApplyJob'; // Add this line
import axios from 'axios';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const navigate = useNavigate();

    // Check if token is valid on mount
    useEffect(() => {
        const checkToken = async () => {
            if (token) {
                try {
                    await axios.get('/api/auth/validate', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Token is valid, do nothing
                } catch (error) {
                    // Token is invalid or expired, clear localStorage
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setToken('');
                    setRole('');
                    navigate('/login');
                }
            }
        };
        checkToken();
    }, [token, navigate]);

    // Update localStorage and state when token/role changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [token, role]);

    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
                <Route path="/signup" element={<Signup setToken={setToken} setRole={setRole} />} />
                <Route path="/employer/login" element={<EmployerLogin setToken={setToken} setRole={setRole} />} />
                <Route path="/employer/signup" element={<EmployerSignup setToken={setToken} setRole={setRole} />} />
                <Route path="/candidate/login" element={<CandidateLogin setToken={setToken} setRole={setRole} />} />
                <Route path="/candidate/signup" element={<CandidateSignup setToken={setToken} setRole={setRole} />} />
                <Route path="/jobs" element={<JobList />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/post-job" element={role === 'employer' && token ? <PostJob /> : <Navigate to="/login" />} />
                <Route path="/search-jobs" element={<SearchJobs />} />
                <Route path="/employer/dashboard" element={role === 'employer' && token ? <EmployerDashboard /> : <Navigate to="/login" />} />
                <Route path="/candidate/dashboard" element={role === 'candidate' && token ? <CandidateDashboard /> : <Navigate to="/login" />} />
                <Route path="/jobs/:id/apply" element={role === 'candidate' && token ? <ApplyJob /> : <Navigate to="/login" />} /> {/* Add this line */}
                <Route path="*" element={<Navigate to={token ? (role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard') : '/login'} />} />
            </Routes>
        </div>
    );
}

export default App;