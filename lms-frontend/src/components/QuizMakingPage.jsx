import React, { useState } from 'react';
import { Button, Card, Form, Input, Radio, Space, Typography } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const QuizMakingPage = () => {
    const [questions, setQuestions] = useState([]);

    const handleAddQuestion = () => {
        setQuestions([...questions, { id: Date.now(), questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: '' }]);
    };

    const handleInputChange = (id, field, value) => {
        setQuestions(questions.map(question => question.id === id ? { ...question, [field]: value } : question));
    };

    const handleSaveQuiz = () => {
        axios.post('/api/save-quiz', { questions })
            .then(response => {
                console.log('Quiz saved successfully');
            })
            .catch(error => {
                console.error("There was an error saving the quiz!", error);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Create Quiz</Title>
            {questions.map(question => (
                <Card key={question.id} style={{ marginBottom: '20px' }}>
                    <Form layout="vertical">
                        <Form.Item label="Question">
                            <Input value={question.questionText} onChange={e => handleInputChange(question.id, 'questionText', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Option A">
                            <Input value={question.optionA} onChange={e => handleInputChange(question.id, 'optionA', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Option B">
                            <Input value={question.optionB} onChange={e => handleInputChange(question.id, 'optionB', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Option C">
                            <Input value={question.optionC} onChange={e => handleInputChange(question.id, 'optionC', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Option D">
                            <Input value={question.optionD} onChange={e => handleInputChange(question.id, 'optionD', e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Correct Option">
                            <Radio.Group onChange={e => handleInputChange(question.id, 'correctOption', e.target.value)} value={question.correctOption}>
                                <Space direction="vertical">
                                    <Radio value="A">A</Radio>
                                    <Radio value="B">B</Radio>
                                    <Radio value="C">C</Radio>
                                    <Radio value="D">D</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Card>
            ))}
            <Button type="dashed" onClick={handleAddQuestion} style={{ marginBottom: '20px' }}>Add Question</Button>
            <Button type="primary" onClick={handleSaveQuiz}>Save Quiz</Button>
        </div>
    );
};

export default QuizMakingPage;
