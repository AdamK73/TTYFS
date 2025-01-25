"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface UserData {
    name: string;
    age: number;
    occupation: string;
    interests: string[];
    lifeGoals: string;
}

interface ChatState {
    stage: 'initial';
    questionIndex: number;
    chatCount: number;
}

export const BasicChat: React.FC<{ userData: UserData }> = ({ userData }) => {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatState, setChatState] = useState<ChatState>({ stage: 'initial', questionIndex: 0, chatCount: 0 });
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [typingText, setTypingText] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, typingText, scrollToBottom]);

    useEffect(() => {
        if (chatState.stage === 'initial') {
            handleSend();
        }
    }, [chatState.stage]);

    const typeMessage = async (message: string) => {
        for (let i = 0; i <= message.length; i++) {
            setTypingText(message.slice(0, i));
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        setTypingText('');
        return message;
    };

    const handleSend = async (userMessage?: string) => {
        if (isLoading) return;
        setIsLoading(true);
        setError(null);

        const newMessages = [...messages];
        if (userMessage) {
            newMessages.push({ role: 'user', content: userMessage, timestamp: new Date() });
            setMessages(newMessages);
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    userData: userData,
                    chatState: chatState,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch response');
            }

            const data = await response.json();
            for (const content of data.messages) {
                const typedMessage = await typeMessage(content);
                setMessages(prev => [...prev, { role: 'assistant', content: typedMessage, timestamp: new Date() }]);
            }
            setChatState(data.chatState);

            if (data.showDialog) {
                setShowDialog(true);
                setAnalysis(data.analysis);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };

    const handleContinueChat = () => {
        setShowDialog(false);
    };

    const handleAnalyze = async () => {
        setShowDialog(false);
        setIsLoading(true);

        router.push('/home');

        try {
            const userDataForAnalysis = {
                ...userData,
                birthYear: new Date().getFullYear() - userData.age,
                chatHistory: messages.map(m => m.content)
            };
            console.log("Analysis data:", userDataForAnalysis);

        } catch (error) {
            console.error("Error analyzing chat:", error);
            setError("Failed to analyze the chat. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessages = () => {
        let currentRole: 'user' | 'assistant' | null = null;
        let messageGroup: Message[] = [];
        const messageElements: JSX.Element[] = [];

        messages.forEach((message, index) => {
            if (message.role !== currentRole && messageGroup.length > 0) {
                messageElements.push(renderMessageGroup(messageGroup, index));
                messageGroup = [];
            }
            messageGroup.push(message);
            currentRole = message.role;

            if (index === messages.length - 1) {
                messageElements.push(renderMessageGroup(messageGroup, index + 1));
            }
        });

        return messageElements;
    };

    const renderMessageGroup = (group: Message[], key: number) => (
        <div key={key} className={`mb-4 ${group[0].role === 'user' ? 'items-end' : 'items-start'}`}>
            {group.map((message, messageIndex) => (
                <div
                    key={messageIndex}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                >
                    <div
                        className={`p-3 rounded-lg max-w-fit ${
                            message.role === 'user'
                                ? 'bg-blue-500 text-[#E4EAF0]'
                                : 'bg-gray-100 text-[#484E57] '
                        }`}
                    >
                        {message.content}
                        {messageIndex === group.length - 1 && (
                            <div className={`text-[11px] mt-1 ${message.role === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                                {formatTime(message.timestamp)}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-full min-h-3/4 min-w-full max-w-2xl mx-auto rounded-lg overflow-hidden bg-gray-100/40">
            <ScrollArea className="flex-grow p-2">
                {renderMessages()}
                {typingText && (
                    <div className="flex justify-start mb-2">
                        <div className="p-3 rounded-lg max-w-fit bg-gray-100 text-gray-800">
                            {typingText}
                            <span className="animate-pulse">|</span>
                        </div>
                    </div>
                )}
                {isLoading && !typingText && (
                    <div className="flex items-center justify-center my-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
                {error && (
                    <div className="text-red-500 text-center my-2">
                        {error}
                    </div>
                )}
                <div ref={bottomRef} />
            </ScrollArea>
            <div className="p-4 bg-white">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (input.trim()) handleSend(input);
                    }}
                    className="flex items-center space-x-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-grow text-[16px]"
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} className="flex items-center justify-center">
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Analyze or Continue?</DialogTitle>
                        <DialogDescription>
                            Would you like to analyze the conversation so far or continue chatting?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={handleContinueChat}>Continue Chatting</Button>
                        <Button onClick={handleAnalyze} variant="outline">Analyze Conversation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};