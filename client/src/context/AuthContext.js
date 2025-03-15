import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const navigate = null; // We’ll handle navigation in components, not here

    useEffect(() => {
        const checkToken = async () => {
            if (token) {
                try {
                    await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/validate`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Token is valid, do nothing
                } catch (error) {
                    // Token is invalid or expired, clear localStorage and state
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setToken('');
                    setRole('');
                }
            }
        };
        checkToken();
    }, [token]);

    // Update localStorage when token or role changes
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

    const value = {
        token,
        role,
        setToken,
        setRole,
        isAuthenticated: !!token
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);