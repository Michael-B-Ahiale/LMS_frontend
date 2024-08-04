import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Typography, Card, Button, Row, Col, Statistic, Modal, Form, Input, List } from 'antd';
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
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:8085/api/courses/user/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedCourse(null);
    form.resetFields();
  };

  const handleAddModule = async (values) => {
    try {
      const response = await fetch('http://localhost:8085/api/module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          course: {id: selectedCourse},
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add module');
      }

      fetchCourses(); // Refresh courses after adding a module
      handleModalCancel();
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const menuItems = [
    { key: '1', icon: <BookOutlined />, label: 'My Courses', to: '/instructor/courses' },
    { key: '2', icon: <TeamOutlined />, label: 'Students', to: '/instructor/students' },
    { key: '3', icon: <MessageOutlined />, label: 'Discussions', to: '/instructor/discussions' },
    { key: '4', icon: <MessageOutlined />, label: 'Chat', to: '/chat' },
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
                <Statistic title="Total Students" value={courses.reduce((acc, course) => acc + (course.enrolledStudents || 0), 0)} />
              </Col>
              <Col span={8}>
                <Statistic title="Total Modules" value={courses.reduce((acc, course) => acc + (course.modules?.length || 0), 0)} />
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
                      <Button type="link" key="edit" onClick={() => handleEdit(course)}>Edit</Button>,
                      <Button type="link" key="view">
                        <Link to={`/course/${course.id}`}>View</Link>
                      </Button>
                    ]}
                  >
                    <p>Description: {course.description}</p>
                    <p>Modules: {course.modules?.length || 0}</p>
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

      <Modal
        title={`Edit Course: ${selectedCourse?.title}`}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {selectedCourse && (
          <>
            <Title level={4}>Existing Modules</Title>
            <List
              dataSource={selectedCourse.modules || []}
              renderItem={(module) => (
                <List.Item>
                  <Text>{module.title}</Text>
                </List.Item>
              )}
            />

            <Title level={4} style={{ marginTop: 20 }}>Add New Module</Title>
            <Form form={form} onFinish={handleAddModule} layout="vertical">
              <Form.Item
                name="title"
                label="Module Title"
                rules={[{ required: true, message: 'Please input the module title!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Module Description"
                rules={[{ required: true, message: 'Please input the module description!' }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Module
                </Button>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </Layout>
  );
}

export default InstructorDashboard;