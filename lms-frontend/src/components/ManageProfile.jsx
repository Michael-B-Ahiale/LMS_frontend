import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Upload, Avatar } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const API = "http://localhost:8085";

const ProfileManagementPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentImage, setCurrentImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true);
            axios.get(API + '/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    form.setFieldsValue({
                        username: response.data.username,
                        email: response.data.email,
                        profilePictureUrl: response.data.profilePicture
                    });
                    setCurrentImage(response.data.profilePicture || '');
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
        axios.put(API + '/api/profile/update', {
            ...values,
            profilePictureUrl: currentImage
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                message.success('Profile updated successfully!');
                handleLogout();
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
                form.setFieldsValue({ profilePictureUrl: response.data.profilePictureUrl });
                setCurrentImage(response.data.profilePictureUrl);
                setUploading(false);
                message.success('Profile picture uploaded successfully!');
            })
            .catch(error => {
                console.error('Error uploading profile picture:', error);
                setUploading(false);
                message.error('Failed to upload profile picture');
            });
    };

    const handleLogout = () => {
        const token = localStorage.getItem('token');
        axios.post(API + '/api/auth/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
                message.success('Logged out successfully!');
            })
            .catch(error => {
                console.error('Error logging out:', error);
                message.error('Failed to logout');
            });
    };

    return (
        <Card title="Manage Your Profile">
            {currentImage && (
                <Avatar size={90} src={currentImage} />
            )}
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
                    name="currentPassword"
                    label="Current Password"
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                >
                    <Input.Password placeholder="Current Password" disabled={loading} />
                </Form.Item>
                <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[{ required: false, message: 'Please enter your new password' }]}
                >
                    <Input.Password placeholder="New Password" disabled={loading} />
                </Form.Item>
                <Form.Item
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    rules={[{ required: false, message: 'Please confirm your new password' }, ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                    })]}
                >
                    <Input.Password placeholder="Confirm New Password" disabled={loading} />
                </Form.Item>

                <Form.Item
                    name="profilePictureUrl"
                    label="Profile Picture"
                >
                    {currentImage && (
                        <Avatar size={90} src={currentImage} style={{ marginBottom: 16 }} />
                    )}
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
