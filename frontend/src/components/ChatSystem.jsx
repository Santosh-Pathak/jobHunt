import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, Phone, Video, MoreVertical, Search, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useTheme } from '../contexts/ThemeContext';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import io from 'socket.io-client';

const ChatSystem = () => {
    const { isDark } = useTheme();
    const { user } = useSelector(store => store.auth);
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to chat server');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from chat server');
        });

        newSocket.on('receive_message', (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation._id);
            socket?.emit('join_room', activeConversation._id);
        }
    }, [activeConversation, socket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await fetch('/api/v1/messages/conversations', {
                credentials: 'include'
            });
            const data = await response.json();
            setConversations(data.conversations);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const response = await fetch(`/api/v1/messages/conversation/${conversationId}/messages`, {
                credentials: 'include'
            });
            const data = await response.json();
            setMessages(data.messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !activeConversation) return;

        const messageData = {
            conversationId: activeConversation._id,
            content: newMessage,
            sender: user._id,
            recipient: activeConversation.participants.find(p => p._id !== user._id)._id,
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch('/api/v1/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                setMessages(prev => [...prev, messageData]);
                setNewMessage('');
                socket?.emit('send_message', {
                    roomId: activeConversation._id,
                    ...messageData
                });
            }
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Failed to send message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const filteredConversations = conversations.filter(conv =>
        conv.participants.some(p => 
            p._id !== user._id && 
            (p.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <div className={`h-screen flex ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Conversations Sidebar */}
            <div className={`w-80 border-r ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <ScrollArea className="h-[calc(100vh-120px)]">
                    <div className="p-2">
                        {filteredConversations.map((conversation) => {
                            const otherParticipant = conversation.participants.find(p => p._id !== user._id);
                            return (
                                <motion.div
                                    key={conversation._id}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-3 rounded-lg cursor-pointer mb-2 ${
                                        activeConversation?._id === conversation._id
                                            ? isDark ? 'bg-gray-700' : 'bg-blue-50'
                                            : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => setActiveConversation(conversation)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={otherParticipant?.profile?.profilePhoto} />
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium truncate">
                                                    {otherParticipant?.fullName}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {conversation.lastMessageAt && 
                                                        new Date(conversation.lastMessageAt).toLocaleDateString()
                                                    }
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conversation.lastMessage?.content || 'No messages yet'}
                                            </p>
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <Badge className="bg-blue-500 text-white">
                                                {conversation.unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className={`p-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage 
                                            src={activeConversation.participants.find(p => p._id !== user._id)?.profile?.profilePhoto} 
                                        />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">
                                            {activeConversation.participants.find(p => p._id !== user._id)?.fullName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {isConnected ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Video className="h-4 w-4" />
                                    </Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div className="space-y-2">
                                                <Button variant="ghost" className="w-full justify-start">
                                                    View Profile
                                                </Button>
                                                <Button variant="ghost" className="w-full justify-start">
                                                    Block User
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.sender === user._id
                                                    ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                                                    : isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                                            }`}>
                                                <p className="text-sm">{message.content}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.sender === user._id ? 'text-blue-100' : 'text-gray-500'
                                                }`}>
                                                    {new Date(message.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className={`p-4 border-t ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <Input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    className="flex-1"
                                />
                                <Button variant="ghost" size="icon">
                                    <Smile className="h-4 w-4" />
                                </Button>
                                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500 mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-gray-400">
                                Choose a conversation from the sidebar to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSystem;
