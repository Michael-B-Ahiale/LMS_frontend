import React from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col } from 'antd';
import { 
  UserOutlined, 
  PlusOutlined, 
  BookOutlined,
  LogoutOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function AdminDashboard({ user }) {
  const courses = [
    { id: 1, title: 'Introduction to React', students: 120 },
    { id: 2, title: 'Advanced JavaScript', students: 85 },
    { id: 3, title: 'Web Design Fundamentals', students: 150 },
    // Add more courses as needed
  ];

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 50px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: '16px 0' }}>Admin Dashboard</Title>
          </Col>
          <Col>
            <Avatar size={40} icon={<UserOutlined />} />
            <span style={{ marginLeft: 8 }}>{user.username}</span>
          </Col>
        </Row>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card>
                <Avatar size={64} icon={<UserOutlined />} />
                <Title level={4} style={{ marginTop: 16 }}>{user.username}</Title>
                <Text>{user.email}</Text>
              </Card>
            </Col>
            {courses.map(course => (
              <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                <Card
                  title={course.title}
                  extra={<BookOutlined />}
                  actions={[
                    <Button type="link">Edit</Button>,
                    <Button type="link">View</Button>
                  ]}
                >
                  <p>Students: {course.students}</p>
                </Card>
              </Col>
            ))}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => console.log('Create new course')}
              >
                <PlusOutlined style={{ fontSize: 24 }} />
                <Title level={4}>Create New Course</Title>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        © 2024 Your Learning Platform. All rights reserved.
      </Footer>
    </Layout>
  );
}

export default AdminDashboard;