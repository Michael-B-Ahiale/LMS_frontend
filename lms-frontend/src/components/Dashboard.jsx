import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching user data with token:', token);
        const response = await axios.get('http://localhost:8083/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('User data received:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
        setError('Failed to fetch user data. Please try logging in again.');
      }
    };

    fetchUser();
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.roles.join(', ')}</p>
          {/* user.token */}
          {/* user.jwtExpiration */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;