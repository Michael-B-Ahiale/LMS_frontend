import React from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  BookOutlined,
  TeamOutlined,
  MessageOutlined,
  LogoutOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;

function InstructorDashboard({ user }) {
  const courses = [
    { id: 1, title: 'Introduction to React', students: 120, discussions: 45 },
    { id: 2, title: 'Advanced JavaScript', students: 85, discussions: 30 },
    { id: 3, title: 'Web Design Fundamentals', students: 150, discussions: 60 },
    // Add more courses as needed
  ];

  const menuItems = [
    { key: '1', icon: <BookOutlined />, label: 'My Courses', to: '/instructor/courses' },
    { key: '2', icon: <TeamOutlined />, label: 'Students', to: '/instructor/students' },
    { key: '3', icon: <MessageOutlined />, label: 'Discussions', to: '/instructor/discussions' },
    { key: '4', icon: <MessageOutlined />, label: 'Chat', to: '/chat-page' }, // Added Chat menu item
    { key: '5', icon: <ProfileOutlined />, label: 'Profile', to: '/manage-profile' },
    { key: '6', icon: <LogoutOutlined />, label: 'Logout', style: { marginTop: 'auto' } }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon} style={item.style}>
              <Link to={item.to}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="header" style={{ background: '#fff', padding: '0 16px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: '16px 0' }}>Instructor Dashboard</Title>
            </Col>
            <Col>
              <Link to="/manage-profile">
                <Row align="middle">
                  <Avatar size={40} icon={<UserOutlined />} />
                  <span style={{ marginLeft: 8 }}>{user.username}</span>
                </Row>
              </Link>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
            <Title level={2}>Welcome, {user.username}!</Title>
            <Text>Email: {user.email}</Text>
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={8}>
                <Statistic title="Total Courses" value={courses.length} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Students" value={courses.reduce((acc, course) => acc + course.students, 0)} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Discussions" value={courses.reduce((acc, course) => acc + course.discussions, 0)} />
              </Col>
            </Row>
            <Title level={3} style={{ marginTop: 24 }}>My Courses</Title>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              {courses.map(course => (
                <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                  <Card
                    title={course.title}
                    extra={<BookOutlined />}
                    actions={[
                      <Button type="link" key="edit">Edit</Button>,
                      <Button type="link" key="view">View</Button>
                    ]}
                  >
                    <p>Students: {course.students}</p>
                    <p>Discussions: {course.discussions}</p>
                  </Card>
                </Col>
              ))}
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Link to="/create-course">
                    <PlusOutlined style={{ fontSize: 24 }} />
                    <Title level={4}>Create New Course</Title>
                  </Link>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © 2024 Your Learning Platform. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}

export default InstructorDashboard;
