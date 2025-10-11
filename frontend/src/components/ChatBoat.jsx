import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { FaComments, FaCircle } from "react-icons/fa";
import { toast } from "sonner";
import { Send, X } from "lucide-react";
import axios from "axios";
import './ChatBot.css';

// Gemini API integration
const GEMINI_MODEL = "gemini-2.0-flash-lite-001";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent`;
const JOB_HUNT_SYSTEM_PROMPT = `You are job Hunt AI, created by jobHunt Technologies in India. 
You help job seekers and recruiters connect. IMPORTANT: Keep all responses extremely brief (1-2 short sentences max).
Never use bullet points or lists. Never write more than 150 characters in a response.
Focus only on the most essential information in a conversational tone.
You assist with job searches, resume tips, interview prep, and connecting recruiters with candidates.`;

const ChatBot = () => {
    const [chatBotOpen, setChatBotOpen] = useState(false);
    const [conversationHistory, setConversationHistory] = useState([
        { role: "system", content: JOB_HUNT_SYSTEM_PROMPT }
    ]);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi there! How can I help you today?" },
        { sender: "bot", text: "I can answer questions about jobs and career growth." },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([
        "Job Opportunities",
        "Application Tips",
        "Interview Prep",
        "Resume Help",
        "Salary Advice",
        "Career Growth",
    ]);

    const messagesEndRef = useRef(null);
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    const toGeminiContents = (historyArray) => {
        // Prepend system prompt as first user message for v1 generateContent
        const contents = [{ role: 'user', parts: [{ text: JOB_HUNT_SYSTEM_PROMPT }] }];
        for (const item of historyArray) {
            if (item.role === 'system') continue;
            const role = item.role === 'assistant' ? 'model' : 'user';
            contents.push({ role, parts: [{ text: item.content }] });
        }
        return contents;
    };

    const listAvailableModels = async () => {
        try {
            const response = await axios.get(
                `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 10000,
                }
            );
            console.log("Available models:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error listing models:", error);
            return null;
        }
    };

    const generateGeminiResponse = async (userInput) => {
        try {
            const updatedHistory = [
                ...conversationHistory,
                { role: "user", content: userInput }
            ];

            const payload = {
                contents: toGeminiContents(updatedHistory),
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 120
                }
            };

            const response = await axios.post(
                `${GEMINI_API_URL}?key=${API_KEY}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 15000,
                }
            );

            const candidates = response?.data?.candidates;
            const aiResponse = candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";

            setConversationHistory([
                ...updatedHistory,
                { role: "assistant", content: aiResponse }
            ]);

            return aiResponse;
        } catch (error) {
            console.error("Gemini Error:", error?.response?.data || error?.message || error);
            
            if (error?.response?.status === 404) {
                console.log("Model not found, listing available models...");
                await listAvailableModels();
            }
            
            return "Sorry, I couldn't process that. Please try again.";
        }
    };

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, { sender: "user", text: message }]);
        setNewMessage("");
        setLoading(true);

        try {
            const botResponse = await generateGeminiResponse(message);
            simulateTypingEffect(botResponse);
        } catch (error) {
            toast.error("Connection error");
            setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I couldn't connect. Try again later." }]);
            setLoading(false);
        }
    };

    const simulateTypingEffect = (fullMessage) => {
        const words = fullMessage.split(" ");
        let currentMessage = "";
        let index = 0;

        setMessages((prev) => [...prev, { sender: "bot", text: "..." }]);

        const typingInterval = setInterval(() => {
            if (index < words.length) {
                currentMessage += (index > 0 ? " " : "") + words[index];
                index++;

                setMessages((prev) =>
                    prev.map((msg, idx) =>
                        idx === prev.length - 1
                            ? { sender: "bot", text: currentMessage }
                            : msg
                    )
                );
            } else {
                clearInterval(typingInterval);
                setLoading(false);
            }
        }, 50);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const shouldShowCategories = messages.length === 2 && messages[0].sender === "bot" && messages[1].sender === "bot";

    return (
        <div className="fixed bottom-4 right-4 z-50">
            { chatBotOpen ? (
                <Card className="w-72 max-w-xs p-3 flex flex-col space-y-3 shadow-lg bg-gradient-to-br from-[#00040A] to-[#001636] border border-blue-600 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <h2 className="font-bold text-sm text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                Hire Hub AI
                            </h2>
                            <FaCircle className="text-green-500 text-xs" />
                        </div>
                        <Button
                            variant="ghost"
                            onClick={ () => setChatBotOpen(false) }
                            className="text-blue-500 hover:text-white hover:bg-gray-500 p-1 h-8 w-8"
                        >
                            <X size={ 16 } />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-md p-2 max-h-56">
                        { messages.map((message, index) => (
                            <div
                                key={ index }
                                className={ `flex ${message.sender === "user" ? "justify-end" : "justify-start"}` }
                            >
                                <div
                                    className={ `p-2 rounded-lg max-w-full text-sm ${message.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-700 text-white"
                                        }` }
                                >
                                    { message.text }
                                </div>
                            </div>
                        )) }
                        { loading && (
                            <div className="flex justify-start ml-1">
                                <div className="loader"></div>
                            </div>
                        ) }
                        <div ref={ messagesEndRef } />
                    </div>
                    { shouldShowCategories && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            { categories.map((category, idx) => (
                                <Button
                                    key={ idx }
                                    className="bg-blue-400 hover:bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs"
                                    onClick={ () => handleSendMessage(category) }
                                >
                                    { category }
                                </Button>
                            )) }
                        </div>
                    ) }
                    <div className="flex items-center space-x-1 mt-2">
                        <Input
                            placeholder="Type a message..."
                            value={ newMessage }
                            onChange={ (e) => setNewMessage(e.target.value) }
                            onKeyPress={ (e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage(newMessage);
                                }
                            } }
                            className="flex-1 border-blue-300 bg-transparent text-white text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 h-8"
                        />
                        <Button
                            onClick={ () => handleSendMessage(newMessage) }
                            className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8 p-1"
                            disabled={ loading }
                        >
                            <Send size={ 16 } />
                        </Button>
                    </div>
                </Card>
            ) : (
                <Button
                    onClick={ () => setChatBotOpen(true) }
                    className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 bounce"
                >
                    <FaComments className="text-lg" />
                    <span className="text-sm">ASK ME</span>
                </Button>
            ) }
        </div>
    );
};

export default ChatBot;