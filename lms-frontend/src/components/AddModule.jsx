import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;
const API = "http://localhost:8085"
const AddModulePage = () => {
    const [form] = Form.useForm();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get(API + '/api/courses')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    const onFinish = (values) => {
        const formattedValues = {
            title: values.title,
            description: values.description,
            course: {
                id: values.courseId // Assuming courseId is a field in your form
            }
        };
        axios.post(API +'/api/module', formattedValues)
            .then(response => {
                console.log('Module added successfully:', response.data);
                form.resetFields();
            })
            .catch(error => {
                console.error('Error adding module:', error);
            });
    };

    return (
        <Card title="Add Module to Course">
            <Form form={form} name="add-module" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="courseId"
                    label="Select Course"
                    rules={[{ required: true, message: 'Please select a course' }]}
                >
                    <Select placeholder="Select a course">
                        {courses.map(course => (
                            <Option key={course.id} value={course.id}>{course.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="title"
                    label="Module Title"
                    rules={[{ required: true, message: 'Please enter the module title' }]}
                >
                    <Input placeholder="Module Title" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Module Description"
                    rules={[{ required: true, message: 'Please enter the module description' }]}
                >
                    <TextArea rows={4} placeholder="Module Description" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Add Module</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddModulePage;
