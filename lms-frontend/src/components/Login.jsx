import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:8083/api/auth/signin', 
        { login, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const {token } = response.data;
      if (token) {
        localStorage.setItem('token',token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate('/dashboard');
      } else {
        setError('Login failed: No access token received');
      }
    } catch (error) {
      console.error('Login failed', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;