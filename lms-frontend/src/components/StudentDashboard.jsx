import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col, Input } from 'antd';
import { 
  UserOutlined, 
  BookOutlined,
  MessageOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

function StudentDashboard({ user }) {
  const [collapsed, setCollapsed] = useState(false);

  const courses = [
    { id: 1, title: 'Introduction to React', progress: 60 },
    { id: 2, title: 'Advanced JavaScript', progress: 30 },
    { id: 3, title: 'Web Design Fundamentals', progress: 90 },
    // Add more courses as needed
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<BookOutlined />}>
            My Courses
          </Menu.Item>
          <Menu.Item key="2" icon={<SearchOutlined />}>
            Browse Courses
          </Menu.Item>
          <Menu.SubMenu key="sub1" icon={<MessageOutlined />} title="Discussions">
            <Menu.Item key="3">General</Menu.Item>
            <Menu.Item key="4">Course-specific</Menu.Item>
          </Menu.SubMenu>
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
              <Avatar size={40} icon={<UserOutlined />} />
              <span style={{ marginLeft: 8 }}>{user.username}</span>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Title level={2}>Welcome, {user.username}!</Title>
            <Search
              placeholder="Search courses"
              onSearch={value => console.log(value)}
              style={{ width: 300, marginBottom: 16 }}
            />
            <Title level={3}>My Courses</Title>
            <Row gutter={[16, 16]}>
              {courses.map(course => (
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
            <Button type="primary" style={{ marginTop: 16 }}>Enroll in New Course</Button>
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