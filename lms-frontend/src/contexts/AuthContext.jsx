import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  const checkAuthStatus = useCallback(async () => {
    console.log('Checking auth status...');
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    if (token) {
      try {
        console.log('Attempting to fetch user data...');
        const response = await axios.get('http://localhost:8085/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('API Response:', response);

        if (response.data) {
          setUser(response.data);
          setIsLoggedIn(true);
          setAuthToken(token);
          
          // Set user role
          let extractedRole = null;
          if (typeof response.data.roles === 'string') {
            const roles = response.data.roles.replace(/[\[\]"]/g, '').split(',');
            extractedRole = roles[0].trim();
          } else if (Array.isArray(response.data.roles) && response.data.roles.length > 0) {
            extractedRole = response.data.roles[0];
          }
          setUserRole(extractedRole);
          
          console.log('User authenticated successfully:', { user: response.data, role: extractedRole });
        } else {
          throw new Error('No user data in response');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
        setUser(null);
        setAuthToken(null);
      }
    } else {
      console.log('No token found in localStorage');
      setIsLoggedIn(false);
      setUserRole(null);
      setUser(null);
      setAuthToken(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback((token, userData) => {
    console.log('Login called with token:', token);
    localStorage.setItem('token', token);
    setAuthToken(token);
    setUser(userData);
    setIsLoggedIn(true);
    
    let extractedRole = null;
    if (typeof userData.roles === 'string') {
      const roles = userData.roles.replace(/[\[\]"]/g, '').split(',');
      extractedRole = roles[0].trim();
    } else if (Array.isArray(userData.roles) && userData.roles.length > 0) {
      extractedRole = userData.roles[0];
    }
    setUserRole(extractedRole);
    
    console.log('Login completed, user state updated:', { user: userData, role: extractedRole });
  }, []);

  const logout = useCallback(() => {
    console.log('Logout called');
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
    console.log('Logout completed, user state cleared');
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, user, loading, login, logout, authToken, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}