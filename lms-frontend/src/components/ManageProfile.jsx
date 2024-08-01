import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const API = "http://localhost:8085";

const ProfileManagementPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true);
            axios.get(API + '/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    form.setFieldsValue(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching profile data:', error);
                    setLoading(false);
                });
        }
    }, [form]);

    const onFinish = (values) => {
        const token = localStorage.getItem('token');
        axios.put(API + '/api/profile', values, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                message.success('Profile updated successfully!');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                message.error('Failed to update profile');
            });
    };

    const handleUpload = ({ file }) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);

        axios.post(API + '/api/upload', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                form.setFieldsValue({ profilePicture: response.data.url });
                setUploading(false);
                message.success('Profile picture uploaded successfully!');
            })
            .catch(error => {
                console.error('Error uploading profile picture:', error);
                setUploading(false);
                message.error('Failed to upload profile picture');
            });
    };

    return (
        <Card title="Manage Your Profile">
            <Form form={form} name="profile-management" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please enter your username' }]}
                >
                    <Input placeholder="Username" disabled={loading} />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
                >
                    <Input placeholder="Email" disabled={loading} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: true, message: 'Please enter your password' }]}
                >
                    <Input.Password placeholder="Password" disabled={loading} />
                </Form.Item>
                <Form.Item
                    name="bio"
                    label="Bio"
                >
                    <TextArea rows={4} placeholder="Bio" disabled={loading} />
                </Form.Item>
                <Form.Item
                    name="profilePicture"
                    label="Profile Picture"
                    rules={[{ required: true, message: 'Please upload a profile picture' }]}
                >
                    <Upload
                        name="file"
                        customRequest={handleUpload}
                        showUploadList={false}
                        disabled={uploading}
                    >
                        <Button icon={<UploadOutlined />} loading={uploading}>Upload Profile Picture</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>Update Profile</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProfileManagementPage;
