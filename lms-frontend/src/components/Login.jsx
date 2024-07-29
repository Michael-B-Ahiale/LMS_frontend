import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext.jsx';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { authState, login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authLogin(login, password);
    if (authState.isAuthenticated) {
      navigate('/dashboard');
    }
  };

  return (
      <div>
        <h2>Login</h2>
        {authState.error && <p>{authState.error}</p>}
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Login"
              required
          />
          <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
          />
          <button type="submit">Login</button>
        </form>
      </div>
  );
};

export default Login;
