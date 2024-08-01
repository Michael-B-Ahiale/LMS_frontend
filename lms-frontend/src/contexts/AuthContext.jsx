import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authToken) {
        try {
          const response = await axios.get('http://localhost:8085/api/users/me', {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          
          console.log('Full response data:', JSON.stringify(response.data, null, 2));
          console.log('Type of roles:', typeof response.data.roles);
          console.log('Roles value:', response.data.roles);
          
          setUser(response.data);
          
          // Extract role from the roles string
          let extractedRole = null;
          if (typeof response.data.roles === 'string') {
            // Remove brackets and quotes, then split if it's a comma-separated list
            const roles = response.data.roles.replace(/[\[\]"]/g, '').split(',');
            extractedRole = roles[0].trim(); // Take the first role if there are multiple
          } else if (Array.isArray(response.data.roles) && response.data.roles.length > 0) {
            extractedRole = response.data.roles[0];
          }
          
          console.log('Extracted role:', extractedRole);
          setUserRole(extractedRole);
          
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to fetch user data', error);
          localStorage.removeItem('token');
          setAuthToken(null);
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, [authToken]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    setUser(userData);
    
    // Extract role from userData
    let extractedRole = null;
    if (typeof userData.roles === 'string') {
      const roles = userData.roles.replace(/[\[\]"]/g, '').split(',');
      extractedRole = roles[0].trim();
    } else if (Array.isArray(userData.roles) && userData.roles.length > 0) {
      extractedRole = userData.roles[0];
    }
    
    setUserRole(extractedRole);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}