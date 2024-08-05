import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col, Spin, message, Empty } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  MessageOutlined, 
  LogoutOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import BrowseCourses from '../components/BrowseCoursesComponent';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

function StudentDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolledCoursesLoading, setEnrolledCoursesLoading] = useState(true);
  const [enrolledCoursesError, setEnrolledCoursesError] = useState(null);
  const [currentView, setCurrentView] = useState('myCourses');

  const { user, authToken, logout, loading: authLoading, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isLoggedIn && user && currentView === 'myCourses') {
      fetchEnrolledCourses();
    }
  }, [currentView, user, authLoading, isLoggedIn]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [authLoading, isLoggedIn, navigate]);

  const fetchEnrolledCourses = async () => {
    if (!user || !user.id) {
      setEnrolledCoursesError("User information is not available");
      setEnrolledCoursesLoading(false);
      return;
    }

    try {
      setEnrolledCoursesLoading(true);
      const response = await axios.get(`http://localhost:8085/api/student/myenrolledcourses/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      setEnrolledCourses(response.data);
      setEnrolledCoursesError(null);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCoursesError("Failed to load enrolled courses. Please try again later.");
      message.error('Failed to load enrolled courses. Please try again later.');
    } finally {
      setEnrolledCoursesLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    if (!user || !user.id) {
      message.error('User information is not available. Please log in again.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8085/api/student/enroll', {
        user: { id: user.id },
        course: { id: course.id },
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      const newEnrollment = response.data;
      setEnrolledCourses(prevCourses => [...prevCourses, newEnrollment]);
      message.success('Successfully enrolled in the course!');
      setCurrentView('myCourses');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      message.error('Failed to enroll in the course. Please try again later.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    if (authLoading) {
      return <Spin size="large" />;
    }

    if (!isLoggedIn) {
      return <div>Please log in to view your dashboard.</div>;
    }

    if (currentView === 'browseCourses') {
      return (
        <>
          <Title level={3}>Browse Courses</Title>
          <BrowseCourses onEnroll={handleEnroll} />
        </>
      );
    }

    if (enrolledCoursesLoading) {
      return <Spin size="large" />;
    }

    if (enrolledCoursesError) {
      return <div>Error loading enrolled courses: {enrolledCoursesError}</div>;
    }

    if (enrolledCourses.length === 0) {
      return (
        <Empty
          description="You are not enrolled in any courses yet."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => setCurrentView('browseCourses')}>Browse Courses</Button>
        </Empty>
      );
    }

    return (
      <>
        <Title level={3}>My Courses</Title>
        <Row gutter={[16, 16]}>
          {enrolledCourses.map(enrollment => (
            <Col xs={24} sm={12} md={8} lg={6} key={enrollment.id}>
              <Card
                title={enrollment.course.title}
                extra={<BookOutlined />}
                actions={[
                  <Button type="link">Continue</Button>,
                  <Button type="link" key="view">
                    <Link to={`/course/${enrollment.course.id}`}>View</Link>
                  </Button>
                ]}
              >
                <Text>Progress: {enrollment.progress}%</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  const renderDiscussionsMenu = () => {
    const courseItems = enrolledCourses.map(course => (
      <Menu.Item key={`course-${course.id}`}>
        {/*{course.course.title}*/}
        <Link to={"/course/" + course.id + "/discussions"} >{course.course.title}</Link>
      </Menu.Item>
    ));

    return (
      <Menu.SubMenu key="sub1" icon={<MessageOutlined />} title="Discussions">
        {courseItems.length ? courseItems : <Menu.Item key="no-courses">No courses enrolled</Menu.Item>}
      </Menu.SubMenu>
    );
  };

  if (authLoading) {
    return <Spin size="large" />;
  }

  if (!isLoggedIn) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<BookOutlined />} onClick={() => setCurrentView('myCourses')}>
            My Courses
          </Menu.Item>
          <Menu.Item key="2" icon={<SearchOutlined />} onClick={() => setCurrentView('browseCourses')}>
            Browse Courses
          </Menu.Item>
          {renderDiscussionsMenu()}
          <Menu.Item key="4" icon={<MessageOutlined />}>
            <Link to="/chat">Chat</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: 'auto' }}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0, background: '#fff' }}>
          <Row justify="space-between" align="middle" style={{ height: '100%', padding: '0 24px' }}>
            <Col>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => setCollapsed(!collapsed),
              })}
            </Col>
            <Col>
              <Link to="/manage-profile">
                <Avatar size={40} icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{user?.username}</span>
              </Link>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Title level={2}>Welcome, {user?.username}!</Title>
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © 2024 Your Learning Platform. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}

export default StudentDashboard;