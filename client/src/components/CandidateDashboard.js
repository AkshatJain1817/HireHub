import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CandidateDashboard() {
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetch candidate profile
                const profileResponse = await axios.get('/api/auth/candidate/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(profileResponse.data);

                // Fetch applications
                const applicationsResponse = await axios.get('/api/applications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(applicationsResponse.data);
            } catch (error) {
                setError('Failed to load profile or applications');
            }
        };
        fetchData();
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
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

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Candidate Dashboard - HireHub</h2>
            <p>Welcome, manage your profile and job applications here!</p>

            <h3>Your Profile</h3>
            {profile ? (
                isEditing ? (
                    <form onSubmit={handleProfileUpdate}>
                        <input
                            type="text"
                            placeholder="Full Name"
                            defaultValue={profile.fullName}
                            onChange={(e) => setUpdatedProfile({ ...updatedProfile, fullName: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            defaultValue={profile.email}
                            onChange={(e) => setUpdatedProfile({ ...updatedProfile, email: e.target.value })}
                        />
                        <button type="submit">Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </form>
                ) : (
                    <div>
                        <p><strong>Full Name:</strong> {profile.fullName}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    </div>
                )
            ) : <p>Loading profile...</p>}

            <h3>Your Applications</h3>
            <ul>
                {applications.map(application => (
                    <li key={application._id}>
                        {application.jobId?.title || 'Job Title'} - 
                        Location: {application.jobId?.location || 'Not specified'} - 
                        Status: {application.status || 'Pending'}
                    </li>
                ))}
            </ul>
            {applications.length === 0 && <p>No applications found.</p>}
        </div>
    );
}

export default CandidateDashboard;