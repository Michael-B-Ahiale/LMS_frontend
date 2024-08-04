import React, {useEffect, useState, useRef, useContext} from 'react';
import { Button, List,  Input, Typography } from 'antd';
import { Comment } from '@ant-design/compatible';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import {AuthContext} from "../contexts/AuthContext.jsx";

const { TextArea } = Input;
const { Title } = Typography;
const API = "http://localhost:8085"
const Discussion = ({ courseId=1 }) => {
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState('');
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);
    const { authToken, user } = useContext(AuthContext);
    useEffect(() => {
        const socket = new SockJS(API +'/ws-message');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({ Authorization: `Bearer ` + authToken}, (frame) => {
            console.log('Connected: ' + frame);
            setConnected(true);
            stompClient.current.subscribe(`/topic/discussions/${courseId}`, (message) => {
                const post = JSON.parse(message.body);
                setPosts((prevPosts) => [...prevPosts, post]);
            });
        }, (error) => {
            console.error('STOMP error: ', error);
        });

        // Load existing posts
        axios.get(API +`/discussions/${courseId}`).then((response) => {
            setPosts(response.data);
        });

        return () => {
            if (stompClient.current && connected) {
                stompClient.current.disconnect();
            }
        };
    }, [courseId, connected]);

    const sendMessage = (content, parentId = null) => {
        if (connected) {
            const message = {
                content,
                parentId,
                courseId
            };
            stompClient.current.send("/app/sendPost", {}, JSON.stringify(message));
            setMessage('');
        } else {
            console.error("WebSocket connection is not established yet.");
        }
    };

    const renderReplies = (parentId) => {
        return posts
            .filter(post => post.parentId === parentId)
            .map(reply => (
                <Comment
                    key={reply.id}
                    author={reply.username}
                    content={reply.content}
                />
            ));
    };

    return (

        <div style={{ padding: '20px' }}>
            <Title level={2}>Discussion for Course {courseId}</Title>
            <List
                itemLayout="horizontal"
                dataSource={posts.filter(post => !post.parentId)}
                renderItem={post => (
                    <li>
                        <Comment
                            author={post.username}
                            content={post.content}
                        >
                            {renderReplies(post.id)}
                            <TextArea
                                rows={2}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write a reply..."
                            />
                            <Button
                                type="primary"
                                onClick={() => sendMessage(message, post.id)}
                                style={{ marginTop: '10px' }}
                            >
                                Reply
                            </Button>
                        </Comment>
                    </li>
                )}
            />
            <TextArea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a new post..."
            />
            <Button
                type="primary"
                onClick={() => sendMessage(message)}
                style={{ marginTop: '10px' }}
            >
                Send Post
            </Button>
        </div>
    );
};

export default Discussion;
