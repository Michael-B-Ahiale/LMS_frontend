import React, { useEffect, useState, useRef, useContext } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { AuthContext } from '../contexts/AuthContext'; // Adjust path as needed

const SOCKET_URL = 'http://localhost:8085/ws-message';

const WebSocketPage = () => {
    const { authToken, user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const stompClientRef = useRef(null);

    useEffect(() => {
        console.log('WebSocketPage initialized with authToken:', authToken);
        if (authToken) {
            console.log('authToken available, initializing WebSocket connection...');
            const socket = new SockJS(SOCKET_URL);
            stompClientRef.current = Stomp.over(socket);

            stompClientRef.current.connect(
                { Authorization: `Bearer ${authToken}` },
                (frame) => {
                    console.log('Connected to WebSocket:', frame);
                    stompClientRef.current.subscribe('/topic/message', (msg) => {
                        const message = JSON.parse(msg.body);
                        setMessages(prevMessages => [...prevMessages, message]);
                    });
                },
                (error) => {
                    console.error('STOMP error:', error);
                }
            );

            return () => {
                if (stompClientRef.current) {
                    console.log('Disconnecting WebSocket...');
                    stompClientRef.current.disconnect();
                }
            };
        } else {
            console.log('authToken not available, cannot initialize WebSocket connection.');
        }
    }, [authToken]);

    const sendMessage = () => {
        if (!inputMessage) {
            console.log('Input message is empty');
            return;
        }

        if (!stompClientRef.current) {
            console.log('WebSocket client is not available');
            return;
        }

        if (inputMessage && stompClientRef.current) {
            console.log('Sending message:', inputMessage);
            const message = { 
                content: inputMessage,
                username: user.username
            };
            stompClientRef.current.send("/app/sendMessage", {}, JSON.stringify(message));
            setMessages(prevMessages => [...prevMessages, message]); // Add the message to the state immediately
            setInputMessage("");
        }
    };

    return (
        <div>
            <h2>Messages</h2>
            <div style={{ border: '1px solid black', height: '300px', overflowY: 'scroll', padding: '10px' }}>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}><strong>{msg.username}:</strong> {msg.content}</li>
                    ))}
                </ul>
            </div>
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Enter message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default WebSocketPage;
