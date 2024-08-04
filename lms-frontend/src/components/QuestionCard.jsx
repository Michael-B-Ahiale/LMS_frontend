import React from 'react';
import { Card, Radio, Space, Typography } from 'antd';

const { Text } = Typography;

const QuestionCard = ({ question, onAnswerChange }) => {
    const handleOptionChange = e => {
        onAnswerChange(question.id, e.target.value);
    };

    return (
        <Card style={{ marginBottom: '20px' }}>
            <Text strong>{question.questionText}</Text>
            <Radio.Group onChange={handleOptionChange}>
                <Space direction="vertical">
                    <Radio value="A">{question.optionA}</Radio>
                    <Radio value="B">{question.optionB}</Radio>
                    <Radio value="C">{question.optionC}</Radio>
                    <Radio value="D">{question.optionD}</Radio>
                </Space>
            </Radio.Group>
        </Card>
    );
};

export default QuestionCard;
