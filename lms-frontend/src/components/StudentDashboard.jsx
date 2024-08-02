import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col, Spin, message } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  MessageOutlined, 
  LogoutOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  SearchOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import BrowseCourses from './BrowseCoursesComponent';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

function StudentDashboard({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrolledCoursesLoading, setEnrolledCoursesLoading] = useState(true);
  const [enrolledCoursesError, setEnrolledCoursesError] = useState(null);
  const [currentView, setCurrentView] = useState('myCourses');

  useEffect(() => {
    if (currentView === 'myCourses') {
      fetchEnrolledCourses();
    }
  }, [currentView]);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchEnrolledCourses = async () => {
    try {
      setEnrolledCoursesLoading(true);
      const response = await fetch('http://localhost:8085/api/enroll', {
        headers: {
          'Authorization': `Bearer ${getToken()}`, 
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      setEnrolledCoursesError(error.message);
      message.error('Failed to load enrolled courses. Please try again later.');
    } finally {
      setEnrolledCoursesLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    try {
      const response = await fetch('http://localhost:8085/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          user: { id: user.id },
          course: { id: course.id },
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }
      message.success('Successfully enrolled in the course!');
      setCurrentView('myCourses');
    } catch (error) {
      message.error('Failed to enroll in the course. Please try again later.');
    }
  };

  const renderContent = () => {
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

    return (
      <>
        <Title level={3}>My Courses</Title>
        <Row gutter={[16, 16]}>
          {enrolledCourses.map(course => (
            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
              <Card
                title={course.title}
                extra={<BookOutlined />}
                actions={[
                  <Button type="link">Continue</Button>,
                  <Button type="link">View Details</Button>
                ]}
              >
                <Text>Progress: {course.progress}%</Text>
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
        {course.title}
      </Menu.Item>
    ));

    return (
      <Menu.SubMenu key="sub1" icon={<MessageOutlined />} title="Discussions">
        {courseItems.length ? courseItems : <Menu.Item key="no-courses">No courses enrolled</Menu.Item>}
      </Menu.SubMenu>
    );
  };

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
          <Menu.Item key="5" icon={<LogoutOutlined />} style={{ marginTop: 'auto' }}>
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
                <span style={{ marginLeft: 8 }}>{user.username}</span>
              </Link>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Title level={2}>Welcome, {user.username}!</Title>
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