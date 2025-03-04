import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import EmployerLogin from './components/EmployerLogin';
import EmployerSignup from './components/EmployerSignup';
import CandidateLogin from './components/CandidateLogin';
import CandidateSignup from './components/CandidateSignup';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/employer/login" element={<EmployerLogin />} />
                <Route path="/employer/signup" element={<EmployerSignup />} />
                <Route path="/candidate/login" element={<CandidateLogin />} />
                <Route path="/candidate/signup" element={<CandidateSignup />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
}

export default App;