import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import WebSocketPage from './components/WebSocketPage.jsx'
import QuizMakingPage from "./components/QuizMakingPage.jsx";
import QuizTakingPage from "./components/QuizTakingPage.jsx";
import TopicManagement from "./components/TopicManagement.jsx";
import TopicPage from "./components/TopicManagement.jsx";
import ViewCoursePage from "./components/ViewCourse.jsx";
import Discussion from "./components/Discussions.jsx";
import "./App.css"

const { Header, Content } = Layout;

function AppContent() {
  const { isLoggedIn, userRole, user, loading, logout, checkAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth state changed:', { isLoggedIn, userRole, user, loading });
  }, [isLoggedIn, userRole, user, loading]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (loading) {
    console.log('App is in loading state');
    return <div>Loading...</div>;
  }

  const menuItems = [
    !isLoggedIn && { key: '1', label: <Link to="/login">Login</Link> },
    !isLoggedIn && { key: '2', label: <Link to="/signup">Signup</Link> },
    isLoggedIn && {
      key: '3',
      label: 'Logout',
      onClick: () => {
        console.log('Logout clicked');
        logout();
        navigate('/login');
      }
    }
  ].filter(Boolean);

  console.log('Rendering App component');

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" selectedKeys={[]} items={menuItems} />
      </Header>
      <Content style={{ padding: '50px' }}>
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                userRole === 'STUDENT' ? (
                  <StudentDashboard user={user} />
                ) : userRole === 'INSTRUCTOR' ? (
                  <InstructorDashboard user={user} />
                ) : userRole === 'ADMIN' ? (
                  <AdminDashboard user={user} />
                ) : (
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/create-course" element={isLoggedIn ? <CreateCoursePage /> : <Navigate to="/login" replace />} />
          <Route path="/manage-profile" element={isLoggedIn ? <ProfileManagementPage /> : <Navigate to="/login" replace />} />
          <Route path="/chat-page" element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" replace />} />
          <Route path="/chat" element={isLoggedIn ? <WebSocketPage /> : <Navigate to="/login" replace />} />
          <Route path="/quiz-making" element={isLoggedIn ? <QuizMakingPage /> : <Navigate to="/login" replace />} />
          <Route path="/quiz-taking" element={isLoggedIn ? <QuizTakingPage /> : <Navigate to="/login" replace />} />
          <Route path="/add-learning-material" element={isLoggedIn ? <QuizTakingPage /> : <Navigate to="/login" replace />} />
          <Route path="/topic-management" element={isLoggedIn ? <TopicPage /> : <Navigate to="/login" replace />} />
          <Route path="/course/:id" element={isLoggedIn ? <ViewCoursePage /> : <Navigate to="/login" replace />} />
          <Route path="/course/:id/discussions" element={isLoggedIn ? <Discussion /> : <Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />

        </Routes>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;







// import React, { useContext, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';
// import { Layout, Menu } from 'antd';
// import { AuthContext } from './contexts/AuthContext';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import StudentDashboard from './components/StudentDashboard';
// import InstructorDashboard from './components/InstructorDashboard';
// import AdminDashboard from './components/AdminDashboard';
// import CreateCoursePage from "./components/CreateCourse.jsx";
// import ProfileManagementPage from "./components/ManageProfile.jsx";
// import ChatPage from "./components/ChatPage.jsx";
// import { AuthProvider } from './contexts/AuthContext';

// const { Header, Content } = Layout;

// function AppContent() {
//   const { isLoggedIn, userRole, user, loading, logout, checkAuthStatus } = useContext(AuthContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log('Auth state changed:', { isLoggedIn, userRole, user, loading });
//   }, [isLoggedIn, userRole, user, loading]);

//   useEffect(() => {
//     checkAuthStatus();
//   }, [checkAuthStatus]);

//   if (loading) {
//     console.log('App is in loading state');
//     return <div>Loading...</div>;
//   }

//   const menuItems = [
//     !isLoggedIn && { key: '1', label: <Link to="/login">Login</Link> },
//     !isLoggedIn && { key: '2', label: <Link to="/signup">Signup</Link> },
//     isLoggedIn && {
//       key: '3',
//       label: 'Logout',
//       onClick: () => {
//         console.log('Logout clicked');
//         logout();
//         navigate('/login');
//       }
//     }
//   ].filter(Boolean);

//   console.log('Rendering App component');

//   return (
//     <Layout className="layout" style={{ minHeight: '100vh' }}>
//       <Header>
//         <div className="logo" />
//         <Menu theme="dark" mode="horizontal" selectedKeys={[]} items={menuItems} />
//       </Header>
//       <Content style={{ padding: '50px' }}>
//         <Routes>
//           <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" replace />} />
//           <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/dashboard" replace />} />
//           <Route
//             path="/dashboard"
//             element={
//               isLoggedIn ? (
//                 userRole === 'STUDENT' ? (
//                   <StudentDashboard user={user} />
//                 ) : userRole === 'INSTRUCTOR' ? (
//                   <InstructorDashboard user={user} />
//                 ) : userRole === 'ADMIN' ? (
//                   <AdminDashboard user={user} />
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               ) : (
//                 <Navigate to="/login" replace />
//               )
//             }
//           />
//           <Route path="/create-course" element={isLoggedIn ? <CreateCoursePage /> : <Navigate to="/login" replace />} />
//           <Route path="/manage-profile" element={isLoggedIn ? <ProfileManagementPage /> : <Navigate to="/login" replace />} />
//           <Route path="/chat-page" element={isLoggedIn ? <ChatPage /> : <Navigate to="/login" replace />} />
//           <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
//         </Routes>
//       </Content>
//     </Layout>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AuthProvider> {/* Ensure AuthProvider wraps the whole application */}
//         <AppContent />
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;
