import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSearch } from 'react-icons/fa'; // Using react-icons for profile and search icons
import axios from 'axios';
import './Navbar.css';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Check authentication status on mount and update
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        setIsAuthenticated(!!token);
        setRole(storedRole || '');

        const checkToken = async () => {
            if (token) {
                try {
                    await axios.get('/api/auth/validate', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Token is valid, do nothing
                } catch (error) {
                    // Token is invalid or expired, clear localStorage and state
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setIsAuthenticated(false);
                    setRole('');
                }
            }
        };
        checkToken();
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setRole('');
        navigate('/login');
    };

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search-jobs?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-brand">HireHub</Link>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>

                <div className="nav-actions">
                    <Link to="/jobs">Job Listings</Link>

                    {isAuthenticated ? (
                        <>
                            <FaUserCircle
                                size={24}
                                className="profile-icon"
                                onClick={() => navigate(role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard')}
                            />
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/signup">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;