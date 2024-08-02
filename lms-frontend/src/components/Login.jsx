import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col, Spin, message } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  MessageOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import BrowseCourses from './BrowseCoursesComponent';
import { AuthContext } from '../contexts/AuthContext'; // Make sure to import AuthContext

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolledCoursesLoading, setEnrolledCoursesLoading] = useState(false);
  const [enrolledCoursesError, setEnrolledCoursesError] = useState(null);
  const [currentView, setCurrentView] = useState('myCourses');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (currentView === 'myCourses') {
      fetchEnrolledCourses();
    }
  }, [currentView, user, navigate]);

  const fetchEnrolledCourses = async () => {
    if (!user) {
      console.error('No user data available, cannot fetch courses');
      return;
    }

    console.log('Fetching enrolled courses for user ID:', user.id);
    try {
      setEnrolledCoursesLoading(true);
      setEnrolledCoursesError(null);

      const response = await fetch(`http://localhost:8085/api/student/myenrolledcourses/${user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);

      if (!Array.isArray(data)) {
        console.error('API did not return an array:', data);
        throw new Error('API did not return an array of courses');
      }

      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      setEnrolledCoursesError(error.message);
      message.error('Failed to load enrolled courses. Please try again later.');
    } finally {
      setEnrolledCoursesLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    if (!user) {
      console.log('No user data available, cannot enroll');
      return;
    }
    console.log('Enrolling in course:', course);
    console.log('User ID:', user.id, 'Course ID:', course?.id);
    try {
      const response = await fetch('http://localhost:8085/api/student/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          user: { id: user.id },
          course: { id: course.id },
        }),
      });

      console.log('Enroll API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Enroll API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const enrollmentData = await response.json();
      console.log('Enrollment successful:', enrollmentData);

      message.success('Successfully enrolled in the course!');
      fetchEnrolledCourses(); // Refresh the enrolled courses list
      setCurrentView('myCourses');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      message.error(`Failed to enroll in the course: ${error.message}`);
    }
  };

  const handleLogout = () => {
    console.log('Logging out');
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    if (!user) {
      return <Spin size="large" />;
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
      return (
        <div>
          <Text type="danger">Error loading enrolled courses: {enrolledCoursesError}</Text>
          <Button onClick={fetchEnrolledCourses} style={{ marginTop: '10px' }}>Retry</Button>
        </div>
      );
    }

    return (
      <>
        <Title level={3}>My Courses</Title>
        {enrolledCourses.length === 0 ? (
          <Text>You are not enrolled in any courses yet.</Text>
        ) : (
          <Row gutter={[16, 16]}>
            {enrolledCourses.map((course) => (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <Card
                  title={course.title}
                  extra={<BookOutlined />}
                >
                  <Text>{course.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </>
    );
  };

  if (!user) {
    return <Spin size="large" />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<BookOutlined />} onClick={() => setCurrentView('myCourses')}>
            My Courses
          </Menu.Item>
          <Menu.Item key="2" icon={<SearchOutlined />} onClick={() => setCurrentView('browseCourses')}>
            Browse Courses
          </Menu.Item>
          <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {collapsed ? (
            <MenuUnfoldOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} />
          ) : (
            <MenuFoldOutlined className="trigger" onClick={() => setCollapsed(!collapsed)} />
          )}
          <div style={{ float: 'right', padding: '0 20px' }}>
            <Avatar icon={<UserOutlined />} />
            <Title level={3} style={{ display: 'inline', marginLeft: '10px' }}>{user?.name}</Title>
          </div>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2024 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
}

export default StudentDashboard;