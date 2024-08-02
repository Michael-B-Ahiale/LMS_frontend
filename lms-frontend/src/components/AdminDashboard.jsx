import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col, Spin, message } from 'antd';
import { UserOutlined, PlusOutlined, BookOutlined, LogoutOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Link, Routes, Route } from 'react-router-dom'; 
import axios from 'axios';
import StudentComponent from './StudentComponent'; 
import InstructorComponent from './InstructorComponent';
import CreateCoursePage from './CreateCourse';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;
const API = "http://localhost:8085";

function AdminDashboard({ user }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(API + '/api/courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
      message.error('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Sider width={250} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/manage-profile">Profile</Link>
          </Menu.Item>
          <Menu.SubMenu key="sub1" icon={<UsergroupAddOutlined />} title="Users">
            <Menu.Item key="2">
              <Link to="/students">All Students</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/instructors">Instructors</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Item key="4" icon={<LogoutOutlined />} style={{ marginTop: 'auto' }}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px', minHeight: '100vh' }}>
        <Header style={{ padding: 0 }}>
          <Row justify="space-around" align="middle">
            <Col>
              <Title level={3} style={{ margin: '16px 0', color:"white"}}>Admin Dashboard</Title>
            </Col>
            <Col>
              <Link to="/manage-profile">
                <Avatar size={40} icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>{user.username}</span>
              </Link>
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>
          <div style={{ padding: 24, background: '#fff' }}>
            <Routes>
              <Route path="/students" element={<StudentComponent />} />
              <Route path="/instructors" element={<InstructorComponent />} />
              <Route path="/create-course" element={<CreateCoursePage />} /> {/* Added route for CreateCoursePage */}
              <Route path="/" element={
                loading ? (
                  <Spin size="large" />
                ) : error ? (
                  <div>{error}</div>
                ) : (
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
                      <Link to="/create-course">
                        <Card
                          hoverable
                          style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <PlusOutlined style={{ fontSize: 24 }} />
                          <Title level={4}>Create New Course</Title>
                        </Card>
                      </Link>
                    </Col>
                  </Row>
                )
              } />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © 2024 Your Learning Platform. All rights reserved.
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AdminDashboard;
