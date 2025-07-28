'use client';

import { useState, useEffect, useRef } from 'react';
import { validate as isUuid } from 'uuid';

export default function Chat({ userUuid }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSendingMessage, setIsSendingMessage] = useState(false);
    const [newChatName, setNewChatName] = useState('');
    const [newChatParticipants, setNewChatParticipants] = useState('');
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    const messagesEndRef = useRef(null);

    const apiBaseUrl = 'http://localhost:10101';

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
            setError(null);
            try {
                const response = await fetch(`${apiBaseUrl}/chat/${encodeURIComponent(userUuid)}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch chats: ${response.statusText}`);
                }
                const data = await response.json();
                setChats(data);
            } catch (err) {
                console.error('Error fetching chats:', err);
                setError(err.message || 'Failed to load chats. Please try again later.');
            } finally {
                setIsLoadingChats(false);
            }
        };

        fetchChats();
    }, [userUuid]);

    useEffect(() => {
        if (!selectedChat) {
            setMessages([]);
            return;
        }

        const fetchMessages = async () => {
            setIsLoadingMessages(true);
            setError(null);
            try {
                const response = await fetch(`${apiBaseUrl}/chat/${selectedChat}/message/`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch messages: ${response.statusText}`);
                }
                const data = await response.json();
                const sortedMessages = data.sort((a, b) =>
                    new Date(a.message_time).getTime() - new Date(b.message_time).getTime()
                );
                setMessages(sortedMessages);
                scrollToBottom();

                await fetch(`${apiBaseUrl}/chat/${selectedChat}/messages/read`, { method: 'POST' });
            } catch (err) {
                console.error('Error fetching messages:', err);
                setError(err.message || 'Failed to load messages. Please try again.');
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchMessages();
    }, [selectedChat]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        if (isChatOpen) {
            setSelectedChat(null);
            setError(null);
            setNewChatName('');
            setNewChatParticipants('');
        }
    };

    const selectChat = (chatId) => {
        setSelectedChat(chatId);
        setError(null);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat || isSendingMessage) return;

        setIsSendingMessage(true);
        try {
            const response = await fetch(`${apiBaseUrl}/chat/${selectedChat}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uuid: userUuid, content: newMessage.trim() }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
            }
            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    chat_id: selectedChat,
                    message_time: data.message_time,
                    message_id: data.message_id,
                    from_user: userUuid,
                    content: newMessage.trim(),
                    read: false,
                },
            ]);
            setNewMessage('');
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error('Error sending message:', err);
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSendingMessage(false);
        }
    };

    const handleCreateChat = async (e) => {
        e.preventDefault();
        if (!newChatName.trim() || !newChatParticipants.trim() || isCreatingChat) return;

        const participants = newChatParticipants
            .split(',')
            .map(id => id.trim())
            .filter(id => id);

        if (participants.length < 2 || !participants.every(id => isUuid(id))) {
            setError('At least two valid participant UUIDs are required, separated by commas.');
            return;
        }

        if (!participants.includes(userUuid)) {
            participants.push(userUuid);
        }

        setIsCreatingChat(true);
        try {
            const response = await fetch(`${apiBaseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newChatName.trim(), participants }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to create chat: ${response.statusText}`);
            }
            const data = await response.json();

            const newChat = {
                chat_id: data.chat_id,
                name: newChatName.trim(),
                participants,
                created_at: new Date().toISOString(),
            };

            setChats((prev) => [...prev, newChat]);
            setNewChatName('');
            setNewChatParticipants('');
            setSelectedChat(data.chat_id);
            setError(null);
        } catch (err) {
            console.error('Error creating chat:', err);
            setError(err.message || 'Failed to create chat. Please try again.');
        } finally {
            setIsCreatingChat(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return isNaN(date.getTime())
            ? 'Invalid time'
            : new Intl.DateTimeFormat('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
              }).format(date);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isChatOpen && (
                <div className="bg-white shadow-xl rounded-lg mb-4 w-96 max-h-[32rem] overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-800">Chats</h3>
                        <button onClick={toggleChat} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>

                    {error && (
                        <div className="p-2 bg-red-100 text-red-600 text-sm">{error}</div>
                    )}

                    <div className="p-2 border-b border-gray-200">
                        <form onSubmit={handleCreateChat} className="flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Chat name"
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isCreatingChat}
                            />
                            <input
                                type="text"
                                placeholder="Participant UUIDs (comma-separated)"
                                value={newChatParticipants}
                                onChange={(e) => setNewChatParticipants(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isCreatingChat}
                            />
                            <button
                                type="submit"
                                className={`p-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors ${isCreatingChat ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isCreatingChat}
                            >
                                {isCreatingChat ? 'Creating...' : 'Create Chat'}
                            </button>
                        </form>
                    </div>

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
                                        className={`w-full text-left p-2 text-sm truncate ${selectedChat === chat.chat_id
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'hover:bg-gray-100 text-gray-600'
                                            }`}
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
                                        <p className="text-sm text-gray-500 text-center">Loading messages...</p>
                                    ) : messages.length > 0 ? (
                                        messages.map((message) => (
                                            <div
                                                key={message.message_id}
                                                className={`p-2 mb-2 rounded-lg text-sm ${message.from_user === userUuid
                                                    ? 'bg-blue-100 text-blue-800 ml-4'
                                                    : 'bg-gray-100 text-gray-600 mr-4'
                                                    }`}
                                            >
                                                <p className="font-medium">
                                                    {message.from_user === userUuid ? 'You' : 'Other'}
                                                </p>
                                                <p>{message.content}</p>
                                                <p className="text-xs text-gray-400">
                                                    {formatTime(message.message_time)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center">No messages yet</p>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500 text-center">
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
                                        className={`w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSendingMessage ? 'opacity-50' : ''}`}
                                        disabled={isSendingMessage}
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
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
