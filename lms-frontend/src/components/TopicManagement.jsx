import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import { LinkOutlined } from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css'; // Import styles for React Quill
import ReactQuill from 'react-quill';

const API = "http://localhost:8085";

const TopicPage = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await axios.get(`${API}/api/topics`);
            setTopics(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
            setLoading(false);
        }
    };

    const handleAddTopic = async (values) => {
        try {
            await axios.post(`${API}/api/topics`, values);
            message.success('Topic added successfully!');
            fetchTopics();
            setAddModalVisible(false);
        } catch (error) {
            console.error('Failed to add topic:', error);
            message.error('Failed to add topic');
        }
    };

    const handleEditTopic = async (values) => {
        try {
            await axios.put(`${API}/api/topics/${currentTopic.id}`, values);
            message.success('Topic updated successfully!');
            fetchTopics();
            setEditModalVisible(false);
            setCurrentTopic(null);
        } catch (error) {
            console.error('Failed to update topic:', error);
            message.error('Failed to update topic');
        }
    };

    const openEditModal = (topic) => {
        setCurrentTopic(topic);
        form.setFieldsValue(topic);
        setEditModalVisible(true);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Conclusion',
            dataIndex: 'conclusion',
            key: 'conclusion',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Button onClick={() => openEditModal(record)}>Edit</Button>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setAddModalVisible(true)}>Add Topic</Button>
            <Table
                columns={columns}
                dataSource={topics}
                loading={loading}
                expandedRowRender={record => (
                    <div>
                        <h3>Learning Materials</h3>
                        <ul>
                            {record.learningMaterials.map(material => (
                                <li key={material.id}>
                                    <a href={`${API}/api/learning-materials/download/${material.fileName}`} target="_blank" rel="noopener noreferrer">
                                        <LinkOutlined /> {material.fileName}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                rowKey="id"
            />
            <Modal
                title="Add Topic"
                visible={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddTopic} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the topic name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please enter the topic content' }]}
                    >
                        <ReactQuill theme="snow" />
                    </Form.Item>
                    <Form.Item
                        name="conclusion"
                        label="Conclusion"
                        rules={[{ required: true, message: 'Please enter the topic conclusion' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Add Topic</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Edit Topic"
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleEditTopic} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the topic name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="Content"
                        rules={[{ required: true, message: 'Please enter the topic content' }]}
                    >
                        <ReactQuill theme="snow" />
                    </Form.Item>
                    <Form.Item
                        name="conclusion"
                        label="Conclusion"
                        rules={[{ required: true, message: 'Please enter the topic conclusion' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Update Topic</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TopicPage;
