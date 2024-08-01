import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, List, Avatar, Typography } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const userId = 1; // This should be dynamic, fetched from authenticated user context

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await axios.get('http://localhost:8084/api/messages');
            setMessages(response.data);
        };

        fetchMessages();

        const socket = new SockJS('http://localhost:8084/chat');
        const client = Stomp.over(socket);

        client.connect({}, () => {
            client.subscribe('/topic/public', (message) => {
                if (message.body) {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                }
            });
        });

        setStompClient(client);

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, []);

    const handleSend = () => {
        if (inputValue.trim() && stompClient) {
            const chatMessage = {
                sender: 'Student', // This should be dynamic, fetched from authenticated user context
                content: inputValue,
                timestamp: new Date().toISOString(),
                userId: userId // This should be dynamic, fetched from authenticated user context
            };
            stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(chatMessage));
            setInputValue('');
        }
    };

    const renderMessage = (item) => {
        const isSender = item.user_id === userId;
        return (
            <List.Item style={{ justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
                <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<span>{item.sender}</span>}
                    description={item.content}
                    style={{ background: isSender ? '#f0f0f0' : '#e6f7ff', padding: '10px', borderRadius: '10px' }}
                />
            </List.Item>
        );
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{ background: '#fff', padding: 0 }}>
                <Title level={3} style={{ margin: '16px' }}>Student Discussion Chat</Title>
            </Header>
            <Content style={{ padding: '0 50px', marginTop: 20 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={renderMessage}
                    />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                <Input.Group compact>
                    <TextArea
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        rows={2}
                        style={{ width: 'calc(100% - 90px)' }}
                        placeholder="Type your message..."
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                    >
                        Send
                    </Button>
                </Input.Group>
            </Footer>
        </Layout>
    );
};

export default ChatPage;
