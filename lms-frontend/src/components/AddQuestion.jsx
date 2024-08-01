import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Card } from 'antd';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;
const API = "http://localhost:8085"
const AddQuestionPage = () => {
    const [form] = Form.useForm();
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);

    useEffect(() => {
        axios.get(API + '/api/courses')
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
            });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            axios.get(API + `/api/courses/${selectedCourse}/modules`)
                .then(response => {
                    setModules(response.data);
                })
                .catch(error => {
                    console.error('Error fetching modules:', error);
                });
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedModule) {
            axios.get(API + `/api/modules/${selectedModule}/topics`)
                .then(response => {
                    setTopics(response.data);
                })
                .catch(error => {
                    console.error('Error fetching topics:', error);
                });
        }
    }, [selectedModule]);

    const onFinish = (values) => {
        axios.post(API + '/api/questions', values)
            .then(response => {
                console.log('Question added successfully:', response.data);
                form.resetFields();
            })
            .catch(error => {
                console.error('Error adding question:', error);
            });
    };

    return (
        <Card title="Add Question to Topic">
            <Form form={form} name="add-question" onFinish={onFinish} layout="vertical">
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
                    <Select placeholder="Select a module" onChange={value => setSelectedModule(value)}>
                        {modules.map(module => (
                            <Option key={module.id} value={module.id}>{module.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="topicId"
                    label="Select Topic"
                    rules={[{ required: true, message: 'Please select a topic' }]}
                >
                    <Select placeholder="Select a topic">
                        {topics.map(topic => (
                            <Option key={topic.id} value={topic.id}>{topic.title}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="question"
                    label="Question"
                    rules={[{ required: true, message: 'Please enter the question' }]}
                >
                    <TextArea rows={4} placeholder="Question" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Add Question</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddQuestionPage;
