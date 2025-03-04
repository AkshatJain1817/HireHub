import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home" style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome to HireHub</h1>
            <p>Your premier job board for employers and job seekers. Find your next opportunity or hire top talent today!</p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/login" style={{ margin: '0 1rem', color: '#007bff', textDecoration: 'none' }}>Login</Link>
                <Link to="/signup" style={{ margin: '0 1rem', color: '#007bff', textDecoration: 'none' }}>Sign Up</Link>
                <Link to="/jobs" style={{ margin: '0 1rem', color: '#007bff', textDecoration: 'none' }}>Browse Jobs</Link>
            </div>
        </div>
    );
}

export default Home;