import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = "http://localhost:8086"
  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(API + '/api/auth/signup', values);
      message.success('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed', error);
      message.error(error.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card style={{ width: 300 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Signup</Title>
        <Form
          name="signup"
          initialValues={{ role: 'STUDENT' }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select placeholder="Select a role">
              <Option value="STUDENT">Student</Option>
              <Option value="INSTRUCTOR">Instructor</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Signup;