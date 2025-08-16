
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chat } from '@/ai/flows/chatbot-flow';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMessages([
                { role: 'model', content: 'Hello! I am SmartSetu-Bot. How can I help you today?' }
            ]);
        }
    }, [isOpen]);
    
    useEffect(() => {
        // Scroll to the bottom when a new message is added
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat({
                history: messages,
                message: input,
            });
            const botMessage: Message = { role: 'model', content: response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed bottom-24 right-4 z-50 w-full max-w-sm"
                    >
                        <Card className="h-[60vh] flex flex-col shadow-2xl">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Bot className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-lg">SmartSetu-Bot</CardTitle>
                                </div>
                                <Button variant="ghost" size="icon" onClick={toggleChat}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                                    <div className="space-y-4">
                                        {messages.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                                    }`}
                                            >
                                                {message.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                                <div
                                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                        }`}
                                                >
                                                    <p className="text-sm">{message.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex items-end gap-2 justify-start">
                                                <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                                                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted flex items-center">
                                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter>
                                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type a message..."
                                        disabled={isLoading}
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
            >
                <Button
                    onClick={toggleChat}
                    className="fixed bottom-4 right-4 z-50 h-16 w-16 rounded-full shadow-lg"
                    size="icon"
                >
                    {isOpen ? <X className="h-8 w-8" /> : <Bot className="h-8 w-8" />}
                    <span className="sr-only">Toggle Chat</span>
                </Button>
            </motion.div>
        </>
    );
}
