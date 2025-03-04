import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
    const { isAuthenticated, role, setToken, setRole } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.get('/api/auth/validate', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    setToken('');
                    setRole('');
                }
            }
        };
        checkToken();
    }, [setToken, setRole]);

    const handleLogout = () => {
        setToken('');
        setRole('');
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search-jobs?query=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="nav-brand">HireHub</Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>

                <div className="nav-actions">
                    <form onSubmit={handleSearch} className="search-input">
                        <FaSearch className="ml-2 text-gray-800" />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border-none outline-none text-gray-800"
                        />
                    </form>

                    <Link to="/jobs" className="nav-actions">Job Listings</Link>

                    {isAuthenticated ? (
                        <>
                            <FaUserCircle
                                size={24} /* Default size, overridden by CSS */
                                className="profile-icon"
                                onClick={() => navigate(role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard')}
                            />
                            <button
                                onClick={handleLogout}
                                className="nav-actions"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-actions">Login</Link>
                            <Link to="/signup" className="nav-actions">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>

            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <form onSubmit={handleSearch} className="mobile-menu search-input">
                    <FaSearch className="ml-2 text-gray-800" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border-none outline-none text-gray-800"
                    />
                </form>

                <Link to="/jobs" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Job Listings</Link>

                {isAuthenticated ? (
                    <>
                        <FaUserCircle
                            size={24} /* Default size, overridden by CSS */
                            className="mobile-profile-icon"
                            onClick={() => {
                                navigate(role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard');
                                setIsMenuOpen(false);
                            }}
                        />
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                            className="mobile-menu-item"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <Link to="/signup" className="mobile-menu-item" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;