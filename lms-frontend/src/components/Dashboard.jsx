import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { authState } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!authState.isAuthenticated) {
        console.log('User is not authenticated, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching user data with token:', authState.token);
        const response = await axios.get('http://localhost:8083/api/users/me', {
          headers: { Authorization: `Bearer ${authState.token}` },
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
  }, [authState.isAuthenticated, authState.token, navigate]);

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
              <div><button><Link to={"/create-course"} >Create Course</Link>
              </button></div>
            </div>
        ) : (
            <p>Loading...</p>
        )}
      </div>
  );
}

export default Dashboard;
