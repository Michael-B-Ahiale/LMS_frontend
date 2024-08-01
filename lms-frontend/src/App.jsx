import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import AdminDashboard from './components/AdminDashboard';
import CreateCoursePage from "./components/CreateCourse.jsx";
import ProfileManagementPage from "./components/ManageProfile.jsx";
import ChatPage from "./components/ChatPage.jsx";


const { Header, Content } = Layout;

function App() {
  const { isLoggedIn, userRole, user, loading, logout } = useContext(AuthContext);
  console.log(userRole);

  if (loading) {
    return <div>Loading...</div>;
  }

  const menuItems = [
    !isLoggedIn && { key: '1', label: <Link to="/login">Login</Link> },
    !isLoggedIn && { key: '2', label: <Link to="/signup">Signup</Link> },
    isLoggedIn && { key: '3', label: 'Logout', onClick: logout }
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
            <Route
              path="/login"
              element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/signup"
              element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  userRole === 'STUDENT' ? <StudentDashboard user={user} />
                  : userRole === 'INSTRUCTOR' ? <InstructorDashboard user={user} />
                  : userRole === 'ADMIN' ? <AdminDashboard user={user} />
                  : null
                ) : <Navigate to="/login" />
              }
            />
            <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
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