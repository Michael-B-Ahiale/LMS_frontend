import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import axios from 'axios';

const API = "http://localhost:8085";

const InstructorComponent = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(API + '/api/users/by-role', {
                params: { role: 'INSTRUCTOR' },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setInstructors(response.data);
        } catch (error) {
            console.error('Error fetching instructors:', error);
            setError('Failed to load instructors');
            message.error('Failed to load instructors. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { title: 'Username', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        // Add more columns as needed
    ];

    return (
        <div>
            {loading ? (
                <Spin size="large" />
            ) : error ? (
                <div>{error}</div>
            ) : (
                <Table dataSource={instructors} columns={columns} rowKey="id" />
            )}
        </div>
    );
};

export default InstructorComponent;
