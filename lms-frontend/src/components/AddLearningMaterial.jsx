import React, { useState } from 'react';
import { Form, Input, Button, Card, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const LearningMaterialsUploadPage = () => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = ({ file, module, week }) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('module', module);
        formData.append('week', week);

        setUploading(true);

        axios.post('http://localhost:8085/api/learning-materials/upload', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                message.success(response.data);
                setUploading(false);
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                message.error('Failed to upload file');
                setUploading(false);
            });
    };

    const onFinish = (values) => {
        handleUpload(values);
    };

    return (
        <Card title="Upload Learning Materials">
            <Form name="learning-materials-upload" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="module"
                    label="Module"
                    rules={[{ required: true, message: 'Please select a module' }]}
                >
                    <Select placeholder="Select a module">
                        <Option value="module1">Module 1</Option>
                        <Option value="module2">Module 2</Option>
                        {/* Add more modules as needed */}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="week"
                    label="Week"
                    rules={[{ required: true, message: 'Please select a week' }]}
                >
                    <Select placeholder="Select a week">
                        <Option value="week1">Week 1</Option>
                        <Option value="week2">Week 2</Option>
                        {/* Add more weeks as needed */}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="file"
                    label="File"
                    rules={[{ required: true, message: 'Please upload a file' }]}
                >
                    <Upload
                        name="file"
                        customRequest={({ file, onSuccess }) => {
                            setTimeout(() => onSuccess("ok"), 0);
                        }}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={uploading}>
                        Upload
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LearningMaterialsUploadPage;
