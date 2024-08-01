import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const API = "http://localhost:8085";

const CreateCoursePage = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage

        axios.post(API + '/api/courses', values, {
            headers: {
                'Authorization': `Bearer ${token}` // Set the Authorization header
            }
        })
            .then(response => {
                console.log('Course created successfully:', response.data);
                form.resetFields();
            })
            .catch(error => {
                console.error('Error creating course:', error);
            });
    };

    return (
        <Card title="Create a New Course">
            <Form form={form} name="create-course" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="title"
                    label="Course Title"
                    rules={[{ required: true, message: 'Please enter the course title' }]}
                >
                    <Input placeholder="Course Title" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Course Description"
                    rules={[{ required: true, message: 'Please enter the course description' }]}
                >
                    <TextArea rows={4} placeholder="Course Description" />
                </Form.Item>
                <Form.Item
                    name="duration"
                    label="Course Duration"
                    rules={[{ required: true, message: 'Please enter the course duration' }]}
                >
                    <Input placeholder="Course Duration (e.g., 10 weeks)" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit Course</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateCoursePage;
