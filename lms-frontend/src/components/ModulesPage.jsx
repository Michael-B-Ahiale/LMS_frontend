import React, { useState, useEffect } from 'react';
import { Card, List, Button, message } from 'antd';
import axios from 'axios';
import { useNavigate, useParams , Link} from 'react-router-dom';

const API = "http://localhost:8085";

const ModulesPage = () => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id} = useParams()
console.log(modules)
    useEffect(() => {
        fetchModules();
    }, []);

    const fetchModules = async () => {
        try {
            const response = await axios.get(`${API}/api/module/courses/`+ id);
            setModules(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            message.error('Failed to fetch modules');
            setLoading(false);
        }
    };

    const handleTopicClick = (topicId) => {
        navigate(`/topic/${topicId}`);
    };

    return (
        <div>
            <h1>Modules</h1>
            <List
                loading={loading}
                dataSource={modules}
                renderItem={module => (
                    <List.Item>
                        <Card title={module.title} style={{ width: '100%' }}>
                            <Link to={"/topic/" + module.id} >Manage topics</Link>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ModulesPage;