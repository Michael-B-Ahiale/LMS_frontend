import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import axios from 'axios';

const API = "http://localhost:8085";

const StudentComponent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(API + '/api/users/by-role', {
                params: { role: 'STUDENT' },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
            setError('Failed to load students');
            message.error('Failed to load students. Please try again later.');
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
                <Table dataSource={students} columns={columns} rowKey="id" />
            )}
        </div>
    );
};

export default StudentComponent;
