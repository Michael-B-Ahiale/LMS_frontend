import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        error: null,
    });

    const login = async (login, password) => {
        setAuthState({ ...authState, error: null });
        try {
            const response = await axios.post('http://localhost:8083/api/auth/signin',
                { login, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const { token } = response.data;
            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({ token, isAuthenticated: true, error: null });
            } else {
                setAuthState({ ...authState, error: 'Login failed: No access token received' });
            }
        } catch (error) {
            console.error('Login failed', error);
            setAuthState({
                ...authState,
                error: error.response?.data?.message || 'An error occurred during login',
            });
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setAuthState({ token: null, isAuthenticated: false, error: null });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
