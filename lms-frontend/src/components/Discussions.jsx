import React, { useEffect, useState, useRef, useContext } from 'react';
import { Button, List, Input, Typography } from 'antd';
import { Comment } from '@ant-design/compatible';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import { AuthContext } from "../contexts/AuthContext.jsx";
// import './Discussion.css'; // Create and import this CSS file for custom styles

const { TextArea } = Input;
const { Title } = Typography;
const API = "http://localhost:8085";

const Discussion = ({ courseId = 1 }) => {
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState('');
    const [replyMessages, setReplyMessages] = useState({});
    const [showReply, setShowReply] = useState({});
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);
    const { authToken, user } = useContext(AuthContext);
console.log(posts)
    useEffect(() => {
        const socket = new SockJS(API + '/ws-message');
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect({ Authorization: `Bearer ` + authToken }, (frame) => {
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
        axios.get(API + `/discussions/${courseId}`).then((response) => {
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
            if (parentId) {
                setReplyMessages((prev) => ({ ...prev, [parentId]: '' }));
                setShowReply((prev) => ({ ...prev, [parentId]: false }));
            } else {
                setMessage('');
            }
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
                    className={reply.username === user.username ? 'sender' : 'receiver'}
                />
            ));
    };

    const handleReplyChange = (e, postId) => {
        const value = e.target.value;
        setReplyMessages((prev) => ({ ...prev, [postId]: value }));
    };

    const handleShowReply = (postId) => {
        setShowReply((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Discussion for Course {courseId}</Title>
            <List
                itemLayout="horizontal"
                dataSource={posts.filter(post => !post.parentId)}
                renderItem={post => (
                    <li key={post.id}>
                        <Comment
                            author={post.username}
                            content={post.content}
                            className={post.username === user.username ? 'sender' : 'receiver'}
                            actions={[
                                <span key="comment-basic-reply-to" onClick={() => handleShowReply(post.id)}>Reply</span>
                            ]}
                        >
                            {renderReplies(post.id)}
                            {showReply[post.id] && (
                                <div>
                                    <TextArea
                                        rows={2}
                                        value={replyMessages[post.id] || ''}
                                        onChange={(e) => handleReplyChange(e, post.id)}
                                        placeholder="Write a reply..."
                                    />
                                    <Button
                                        type="primary"
                                        onClick={() => sendMessage(replyMessages[post.id], post.id)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        Reply
                                    </Button>
                                </div>
                            )}
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
