// AuthContext.jsx
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
    if (token) {
      try {
        const response = await axios.get('http://localhost:8085/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          setUser(response.data);
          setIsLoggedIn(true);
          setAuthToken(token);
         
          let extractedRole = null;
          if (typeof response.data.roles === 'string') {
            const roles = response.data.roles.replace(/[\[\]"]/g, '').split(',');
            extractedRole = roles[0].trim();
          } else if (Array.isArray(response.data.roles) && response.data.roles.length > 0) {
            extractedRole = response.data.roles[0];
          }
          setUserRole(extractedRole);
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
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, user, loading, login, logout, authToken, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}