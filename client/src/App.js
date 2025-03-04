import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
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
import ApplyJob from './components/ApplyJob';
import Home from './components/Home';
import axios from 'axios';

function App() {
    return (
        <AuthProvider>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/employer/login" element={<EmployerLogin />} />
                    <Route path="/employer/signup" element={<EmployerSignup />} />
                    <Route path="/candidate/login" element={<CandidateLogin />} />
                    <Route path="/candidate/signup" element={<CandidateSignup />} />
                    <Route path="/jobs" element={<JobList />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/post-job" element={<ProtectedRoute component={PostJob} role="employer" />} />
                    <Route path="/search-jobs" element={<SearchJobs />} />
                    <Route path="/employer/dashboard" element={<ProtectedRoute component={EmployerDashboard} role="employer" />} />
                    <Route path="/candidate/dashboard" element={<ProtectedRoute component={CandidateDashboard} role="candidate" />} />
                    <Route path="/jobs/:id/apply" element={<ProtectedRoute component={ApplyJob} role="candidate" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </AuthProvider>
    );
}

function ProtectedRoute({ component: Component, role }) {
    const { token, role: userRole, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (userRole !== role) {
            navigate(userRole === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
        }
    }, [isAuthenticated, userRole, role, navigate]);

    if (!isAuthenticated || userRole !== role) {
        return null;
    }

    return <Component />;
}

export default App;