import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import axios from 'axios';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import CreateCoursePage from "./components/CreateCourse.jsx";
import ProfileManagementPage from "./components/ManageProfile.jsx";
import ChatPage from "./components/ChatPage.jsx";

const { Header, Content } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8085/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      setUserRole(response.data.roles[0]); // Assuming the API returns roles
    } catch (error) {
      console.error('Failed to fetch user data', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    setUser(null);
  };

  const menuItems = [
    !isLoggedIn && { key: '1', label: <Link to="/login">Login</Link> },
    !isLoggedIn && { key: '2', label: <Link to="/signup">Signup</Link> },
    isLoggedIn && { key: '3', label: 'Logout', onClick: handleLogout }
  ].filter(Boolean);

  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" selectedKeys={[]} items={menuItems} />
        </Header>
        <Content style={{ padding: '50px' }}>
          <Routes>
            <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} setUser={setUser} /> : <Navigate to="/dashboard" />} />
            <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />} />
            <Route 
              path="/dashboard" 
              element={
                isLoggedIn && user ? (
                  userRole === 'STUDENT' ? (
                    <StudentDashboard user={user} />
                  ) : userRole === 'INSTRUCTOR' ? (
                    <InstructorDashboard user={user} />
                  ) : (
                    <Navigate to="/login" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path={"/create-course"} element={<CreateCoursePage />} ></Route>
            <Route path={"/manage-profile"} element={<ProfileManagementPage />} ></Route>
            <Route path={"/chat-page"} element={<ChatPage />} ></Route>
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;