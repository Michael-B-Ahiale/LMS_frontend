import React, { useState, useEffect } from 'react';
import { Collapse, Card, Typography, List, Button, Layout, Spin, Breadcrumb, message } from 'antd';
import { YoutubeOutlined, FileOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useParams, Link } from "react-router-dom";

const { Panel } = Collapse;
const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

const CourseOverview = ({ course }) => (
    <Card>
        <Title level={2}>{course.title}</Title>
        <Paragraph>{course.description}</Paragraph>
        <Paragraph><strong>Syllabus:</strong> {course.syllabus}</Paragraph>
        <Paragraph><strong>Schedule:</strong> {course.schedule}</Paragraph>
    </Card>
);

const LearningMaterials = ({ materials }) => (
    <List
        itemLayout="horizontal"
        dataSource={materials}
        renderItem={material => (
            <List.Item>
                <Button
                    icon={material.type === 'youtube' ? <YoutubeOutlined /> : <FileOutlined />}
                    type="link"
                    href={material.s3FileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {material.title || (material.type === 'youtube' ? "YouTube Video" : "Downloadable File")}
                </Button>
                {material.type !== 'youtube' && (
                    <Button
                        icon={<DownloadOutlined />}
                        type="link"
                        href={material.s3FileUrl}
                        download
                    >
                        Download
                    </Button>
                )}
            </List.Item>
        )}
    />
);

const TopicList = ({ topics }) => (
    <Collapse accordion>
        {topics?.map(topic => (
            <Panel header={topic.name} key={topic.id}>
                <div dangerouslySetInnerHTML={{ __html: topic.content }} />
                {topic.conclusion && (
                    <Card style={{ marginTop: '1rem' }}>
                        <Paragraph><strong>Conclusion:</strong> {topic.conclusion}</Paragraph>
                    </Card>
                )}
                <LearningMaterials materials={topic.learningMaterials} />
            </Panel>
        ))}
    </Collapse>
);

const ModuleList = ({ modules }) => (
    <Collapse accordion>
        {modules?.map(module => (
            <Panel header={module.title} key={module.id}>
                <Paragraph>{module.description}</Paragraph>
                <TopicList topics={module.topic} />
            </Panel>
        ))}
    </Collapse>
);

const ViewCoursePage = () => {
    const API = "http://localhost:8085";
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${API}/api/courses/${id}`)
            .then(response => {
                setCourse(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching the course data:', error);
                message.error('Failed to load course data. Please try again later.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>Course Management System</Title>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item><Link to="/">Home</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>Course Details</Breadcrumb.Item>
                </Breadcrumb>
                {course && (
                    <div style={{ background: '#fff', padding: '24px', minHeight: 280 }}>
                        <CourseOverview course={course} />
                        <Title level={3} style={{ marginTop: '2rem' }}>Modules</Title>
                        <ModuleList modules={course.modules} />
                    </div>
                )}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Course Management System ©2024 Created by Ahmed
            </Footer>
        </Layout>
    );
};

export default ViewCoursePage;