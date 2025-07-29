'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { validate as isUuid } from 'uuid';
import uuidTime from 'uuid-time';

export default function Chat() {
    const [userUuid, setUserUuid] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const messagesEndRef = useRef(null);

    const apiBaseUrl = 'http://localhost:10101';

    // 🔐 Fetch UUID from Supabase
    useEffect(() => {
        const getUUID = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUserUuid(data.user.id);
            } else {
                console.error('Failed to get user UUID:', error);
                setError('Unable to authenticate user.');
            }
        };
        getUUID();
    }, []);

    useEffect(() => {
        if (!userUuid || !isUuid(userUuid)) {
            setError('Invalid user UUID. Please log in again.');
            setIsChatOpen(false);
        }
    }, [userUuid]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!userUuid || !isUuid(userUuid)) return;

        const fetchChats = async () => {
            setIsLoadingChats(true);
            try {
                const response = await fetch(`${apiBaseUrl}/chat/${encodeURIComponent(userUuid)}`);
                if (!response.ok) throw new Error('Failed to fetch chats');
                const data = await response.json();
                setChats((prevChats) => {
                    const prevIds = prevChats.map((c) => c.chat_id).sort().join(',');
                    const newIds = data.map((c) => c.chat_id).sort().join(',');
                    return prevIds !== newIds ? data : prevChats;
                });
            } catch (err) {
                console.error('Error fetching chats:', err);
                setError(err.message || 'Failed to load chats.');
            } finally {
                setIsLoadingChats(false);
            }
        };

        fetchChats();
    }, [userUuid]);

    const fetchMessages = async () => {
        if (!selectedChat) {
            setMessages([]);
            return;
        }

        setIsLoadingMessages(true);
        try {
            const response = await fetch(`${apiBaseUrl}/chat/${selectedChat}/message/`);
            if (!response.ok) throw new Error('Failed to fetch messages');
            const data = await response.json();
            const sortedMessages = data.sort((a, b) => {
                try {
                    return uuidTime.v1(a.message_time) - uuidTime.v1(b.message_time);
                } catch (err) {
                    console.warn('Invalid message_time UUID:', a.message_time, b.message_time);
                    return 0;
                }
            });
            setMessages(sortedMessages);
            scrollToBottom();
            await fetch(`${apiBaseUrl}/chat/${selectedChat}/messages/read`, { method: 'POST' });
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError(err.message || 'Failed to load messages.');
        } finally {
            setIsLoadingMessages(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [selectedChat]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        setSelectedChat(null);
        setError(null);
        setNewMessage('');
    };

    const selectChat = (chatId) => {
        setSelectedChat(chatId);
        setError(null);
        setNewMessage('');
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage || !selectedChat || isSendingMessage || trimmedMessage.length > 1000) {
            if (trimmedMessage.length > 1000) {
                setError('Message is too long (max 1000 characters).');
            }
            return;
        }

        setIsSendingMessage(true);
        try {
            const response = await fetch(`${apiBaseUrl}/chat/${selectedChat}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid: userUuid, content: trimmedMessage }),
            });
            if (!response.ok) throw new Error('Failed to send message');
            const data = await response.json();

            const newMsg = {
                chat_id: selectedChat,
                message_time: data.message_time,
                message_id: data.message_id,
                from_user: userUuid,
                content: trimmedMessage,
                read: false,
            };

            setMessages((prev) => [...prev, newMsg]);
            setNewMessage('');
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to send message.');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const formatTime = useCallback((uuid) => {
        try {
            const timestamp = uuidTime.v1(uuid);
            const date = new Date(timestamp);
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
            }).format(date);
        } catch {
            return 'Invalid time';
        }
    }, []);

return (
    <div className="fixed bottom-4 right-4 z-50">
        {isChatOpen && (
            <div className="bg-white shadow-xl rounded-lg mb-4 w-full max-w-md sm:w-[80vw] max-h-[80vh] flex flex-col">
                <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-800 truncate">Chats: </h3>
                    <div className="flex items-center space-x-2">
                        {selectedChat && (
                            <button
                                onClick={fetchMessages}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label="Refresh messages"
                                disabled={isLoadingMessages}
                            >
                                <svg
                                    className={`w-5 h-5 ${isLoadingMessages ? 'animate-spin' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H9m-5 6H2v5h.582A8.001 8.001 0 0117.418 15H13"
                                    />
                                </svg>
                            </button>
                        )}
                        <button
                            onClick={toggleChat}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                {error && <div className="p-2 bg-red-100 text-red-600 text-sm">{error}</div>}
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                        {isLoadingChats ? (
                            <p className="p-2 text-sm text-gray-500">Loading chats...</p>
                        ) : chats.length === 0 ? (
                            <p className="p-2 text-sm text-gray-500">No chats available</p>
                        ) : (
                            chats.map((chat) => (
                                <button
                                    key={chat.chat_id}
                                    onClick={() => selectChat(chat.chat_id)}
                                    className={`w-full text-left p-2 text-sm truncate ${
                                        selectedChat === chat.chat_id
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                    aria-label={`Select chat ${chat.name}`}
                                >
                                    {chat.name}
                                </button>
                            ))
                        )}
                    </div>
                    <div className="w-2/3 flex flex-col">
                        <div className="p-2 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-800 truncate">
                                {selectedChat
                                    ? chats.find((chat) => chat.chat_id === selectedChat)?.name
                                    : 'Select a chat'}
                            </h3>
                        </div>
                        <div className="flex-1 p-2 overflow-y-auto">
                            {selectedChat ? (
                                isLoadingMessages ? (
                                    <p className="text-sm text-gray-800 text-center">Loading messages...</p>
                                ) : messages.length > 0 ? (
                                    messages.map((message) => (
                                        <div
                                            key={message.message_id}
                                            className={`p-2 mb-2 rounded-lg text-sm max-w-[75%] ${
                                                message.from_user === userUuid
                                                    ? 'bg-blue-500 text-white ml-auto'
                                                    : 'bg-gray-200 text-gray-800 mr-auto'
                                            } break-words`}
                                        >
                                            <p className="font-medium">
                                                {message.from_user === userUuid ? 'You' : 'Other'}
                                            </p>
                                            <p>{message.content}</p>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs text-gray-600">
                                                    {formatTime(message.message_time)}
                                                </p>
                                                {message.from_user === userUuid && (
                                                    <p className="text-xs text-green-500">
                                                        {message.read ? '✓ Read' : '✓ Sent'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-800 text-center">No messages yet</p>
                                )
                            ) : (
                                <p className="text-sm text-gray-800 text-center">
                                    Select a chat to view messages
                                </p>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        {selectedChat && (
                            <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className={`w-full p-2 border rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        isSendingMessage ? 'opacity-50' : ''
                                    }`}
                                    disabled={isSendingMessage}
                                    aria-label="Type a message"
                                />
                            </form>
                        )}
                    </div>
                </div>
            </div>
        )}
        <button
            onClick={toggleChat}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
        >
            <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
            </svg>
        </button>
    </div>
);



}