import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/employer/login" element={<EmployerLogin />} />
                <Route path="/employer/signup" element={<EmployerSignup />} />
                <Route path="/candidate/login" element={<CandidateLogin />} />
                <Route path="/candidate/signup" element={<CandidateSignup />} />
                <Route path="/jobs" element={<JobList />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/post-job" element={role === 'employer' && token ? <PostJob /> : <Navigate to="/login" />} />
                <Route path="/search-jobs" element={<SearchJobs />} />
                <Route path="/employer/dashboard" element={role === 'employer' && token ? <EmployerDashboard /> : <Navigate to="/login" />} />
                <Route path="/candidate/dashboard" element={role === 'candidate' && token ? <CandidateDashboard /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={token ? (role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard') : '/login'} />} />
            </Routes>
        </div>
    );
}

export default App;