import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const AddTopicPage = () => {
    const [form] = Form.useForm();
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const API = "http://localhost:8085"
    useEffect(() => {
        axios.get(API +'/api/courses')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            axios.get(API + `/api/courses/`)
                .then(response => {
                    setModules(response.data);
                })
                .catch(error => {
                    console.error('Error fetching modules:', error);
                });
        }
    }, [selectedCourse]);

    const onFinish = (values) => {
        axios.post('/api/topics', values)
            .then(response => {
                console.log('Topic added successfully:', response.data);
                form.resetFields();
            })
            .catch(error => {
                console.error('Error adding topic:', error);
            });
    };

    return (
        <Card title="Add Topic to Module">
            <Form form={form} name="add-topic" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="courseId"
                    label="Select Course"
                    rules={[{ required: true, message: 'Please select a course' }]}
                >
                    <Select placeholder="Select a course" onChange={value => setSelectedCourse(value)}>
                        {courses.map(course => (
                            <Option key={course.id} value={course.id}>{course.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="moduleId"
                    label="Select Module"
                    rules={[{ required: true, message: 'Please select a module' }]}
                >
                    <Select placeholder="Select a module">
                        {modules.map(module => (
                            <Option key={module.id} value={module.id}>{module.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="title"
                    label="Topic Title"
                    rules={[{ required: true, message: 'Please enter the topic title' }]}
                >
                    <Input placeholder="Topic Title" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Topic Description"
                    rules={[{ required: true, message: 'Please enter the topic description' }]}
                >
                    <TextArea rows={4} placeholder="Topic Description" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Add Topic</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddTopicPage;
