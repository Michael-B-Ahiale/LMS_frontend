import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

function Login({ setIsLoggedIn, setUserRole, setUser }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8085/api/auth/signin', 
        values,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsLoggedIn(true);
        
        // Fetch user data
        const userResponse = await axios.get('http://localhost:8085/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userResponse.data);
        setUserRole(userResponse.data.roles[0]); // Assuming the API returns roles as an array
        
        navigate('/dashboard');
      } else {
        message.error('Login failed: No access token received');
      }
    } catch (error) {
      console.error('Login failed', error);
      message.error(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card style={{ width: 300 }}>
        <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="login"
            rules={[{ required: true, message: 'Please input your Username or Email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username or Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;