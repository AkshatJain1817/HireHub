import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './CandidateDashboard.css';

function CandidateDashboard() {
    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileResponse = await axios.get('/api/auth/candidate/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(profileResponse.data);

                const applicationsResponse = await axios.get('/api/applications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(applicationsResponse.data);
            } catch (error) {
                setError('Failed to load profile or applications');
            }
        };
        fetchData();
    }, [token]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/api/auth/candidate/profile', updatedProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
            setIsEditing(false);
            setUpdatedProfile({});
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="candidate-dashboard">
            <h2 className="text-2xl font-bold mb-4">Candidate Dashboard - HireHub</h2>
            <p className="mb-4">Welcome, manage your profile and job applications here!</p>

            <div className="dashboard-section">
                <h3 className="text-xl font-bold mb-2">Your Profile</h3>
                {profile ? (
                    isEditing ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                defaultValue={profile.fullName}
                                onChange={(e) => setUpdatedProfile({ ...updatedProfile, fullName: e.target.value })}
                                className="form-group"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                defaultValue={profile.email}
                                onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })}
                                className="form-group"
                            />
                            <div className="flex space-x-2 flex-col md:flex-row">
                                <button type="submit" className="form-group">Save Changes</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="form-group bg-gray-500 hover:bg-gray-700">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-4">
                            <p className="mb-2"><strong>Full Name:</strong> {profile.fullName}</p>
                            <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
                            <button onClick={() => setIsEditing(true)} className="form-group">Edit Profile</button>
                        </div>
                    )
                ) : <p className="text-center">Loading profile...</p>}
            </div>

            <div className="dashboard-section">
                <h3 className="text-xl font-bold mb-2">Your Applications</h3>
                <ul className="list-disc pl-5">
                    {applications.map(application => (
                        <li key={application._id} className="mb-2">
                            {application.jobId?.title || 'Job Title'} - 
                            Location: {application.jobId?.location || 'Not specified'} - 
                            Status: {application.status || 'Pending'}
                        </li>
                    ))}
                </ul>
                {applications.length === 0 && <p className="text-center">No applications found.</p>}
            </div>
        </div>
    );
}

export default CandidateDashboard;