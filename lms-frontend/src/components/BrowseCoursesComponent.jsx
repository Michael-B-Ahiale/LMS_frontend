import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Row, Col, Input, Modal, message, Spin } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/AuthContext';

const { Search } = Input;

function BrowseCourses({ onEnroll }) {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8085/api/courses', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      setError(error.message);
      message.error('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleEnrollClick = (course) => {
    setSelectedCourse(course);
    setEnrollModalOpen(true);
  };

  const handleEnrollConfirm = async () => {
    if (selectedCourse) {
      try {
        await onEnroll(selectedCourse);
        setEnrollModalOpen(false);
      } catch (error) {
        message.error('Failed to enroll in the course. Please try again later.');
      }
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Search
        placeholder="Search courses"
        onSearch={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Row gutter={[16, 16]}>
        {filteredCourses.map(course => (
          <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
            <Card
              title={course.title}
              extra={<BookOutlined />}
              actions={[
                <Button onClick={() => handleEnrollClick(course)}>Enroll</Button>
              ]}
            >
              <p>{course.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
        title="Enroll in Course"
        open={enrollModalOpen}
        onOk={handleEnrollConfirm}
        onCancel={() => setEnrollModalOpen(false)}
      >
        <p>Are you sure you want to enroll in {selectedCourse?.title}?</p>
      </Modal>
    </>
  );
}

export default BrowseCourses;