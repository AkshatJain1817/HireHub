import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSearch } from 'react-icons/fa';
import axios from 'axios';

function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

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
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setIsAuthenticated(false);
                    setRole('');
                }
            }
        };
        checkToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
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
        <nav className="navbar" style={{ backgroundColor: '#333', padding: '1rem', color: 'white' }}>
            <div className="navbar-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>HireHub</Link>

                <form onSubmit={handleSearch} style={{ flex: 1, margin: '0 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '4px', padding: '0.5rem' }}>
                        <FaSearch style={{ color: '#333', marginRight: '0.5rem' }} />
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '1rem' }}
                        />
                    </div>
                </form>

                <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>Job Listings</Link>

                    {isAuthenticated ? (
                        <>
                            <FaUserCircle
                                size={24}
                                style={{ cursor: 'pointer', color: 'white' }}
                                onClick={() => navigate(role === 'employer' ? '/employer/dashboard' : '/candidate/dashboard')}
                            />
                            <button onClick={handleLogout} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
                            <Link to="/signup" style={{ color: 'white', textDecoration: 'none' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;