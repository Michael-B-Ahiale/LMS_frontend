import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Radio, Space, Typography } from 'antd';
import QuestionCard from './QuestionCard';

const { Title } = Typography;

const QuizTakingPage = () => {
    const initialQuestions = [
        { id: 1, questionText: 'What is the capital of France?', optionA: 'Berlin', optionB: 'Madrid', optionC: 'Paris', optionD: 'Lisbon', correctOption: 'C' },
        { id: 2, questionText: 'Which planet is known as the Red Planet?', optionA: 'Earth', optionB: 'Mars', optionC: 'Jupiter', optionD: 'Saturn', correctOption: 'B' }
    ];
    const [questions, setQuestions] = useState(initialQuestions);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    useEffect(() => {
        // axios.get('/api/questions')
        //     .then(response => {
        //         setQuestions(response.data);
        //     })
        //     .catch(error => {
        //         console.error("There was an error fetching the questions!", error);
        //     });
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({
            ...answers,
            [questionId]: answer,
        });
    };

    const handleSubmit = () => {
        // Calculate the score
        let correctAnswers = 0;
        questions.forEach(question => {
            if (answers[question.id] === question.correctOption) {
                correctAnswers++;
            }
        });

        const totalScore = (correctAnswers / questions.length) * 100;
        setScore(totalScore);

        // Send score to backend
        axios.post('/api/save-score', { score: totalScore })
            .then(response => {
                console.log('Score saved successfully');
            })
            .catch(error => {
                console.error("There was an error saving the score!", error);
            });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Create Quiz</Title>
            {questions.map(question => (
                <QuestionCard
                    key={question.id}
                    question={question}
                    onAnswerChange={handleAnswerChange}
                />
            ))}
            <Button type="primary" onClick={handleSubmit}>Submit</Button>
            {score !== null && <p>Your score: {score}%</p>}
        </div>
    );
};

export default QuizTakingPage;
