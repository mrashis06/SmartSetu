
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, X, Send, Loader2, Sparkles, CornerDownLeft, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { chat } from '@/ai/flows/chatbot-flow';
import { Logo } from './logo';
import { useLanguage } from '@/context/language-context';

type Message = {
    role: 'user' | 'model';
    content: string;
};

const ChatIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

export function Chatbot() {
    const { t } = useLanguage();

    const introPrompts = [
        t('chatbot.prompt1'),
        t('chatbot.prompt2'),
        t('chatbot.prompt3'),
        t('chatbot.prompt4')
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const dragControls = useDragControls();

    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTo({
                    top: scrollAreaRef.current.scrollHeight,
                    behavior: 'smooth',
                });
            }
        }, 100);
    }, []);

    const startNewChat = useCallback(() => {
        setMessages([
            { role: 'model', content: t('chatbot.welcomeMessage') }
        ]);
        scrollToBottom();
    }, [scrollToBottom, t]);

    useEffect(() => {
        if (isOpen) {
            startNewChat();
        }
    }, [isOpen, startNewChat]);

    const handleSendMessage = async (messageContent?: string) => {
        const currentMessage = messageContent || input;
        if (!currentMessage.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: currentMessage };
        setMessages(prev => [...prev, userMessage]);
        if (!messageContent) {
            setInput('');
        }
        setIsLoading(true);
        scrollToBottom();

        try {
            const response = await chat({
                history: messages,
                message: currentMessage,
            });
            const botMessage: Message = { role: 'model', content: response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = { role: 'model', content: t('chatbot.errorMessage') };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const WelcomeScreen = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <Logo className="h-10 w-auto mb-4" />
            <h2 className="text-2xl font-bold font-serif text-foreground">{t('chatbot.welcomeTitle')}</h2>
            <div className="grid grid-cols-2 gap-3 mt-8 w-full">
                {introPrompts.map((prompt, i) => (
                    <Button
                        key={i}
                        variant="outline"
                        className="h-auto text-left py-2 px-3 justify-between"
                        onClick={() => handleSendMessage(prompt)}
                    >
                        <p className="text-sm font-normal text-foreground/80">{prompt}</p>
                        <CornerDownLeft className="h-4 w-4 text-muted-foreground" />
                    </Button>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        drag
                        dragListener={false}
                        dragControls={dragControls}
                        dragMomentum={false}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="fixed bottom-24 right-4 z-50 w-full max-w-sm"
                    >
                        <Card className="h-[70vh] flex flex-col shadow-2xl bg-secondary/80 backdrop-blur-sm">
                            <CardHeader
                                onPointerDown={(e) => dragControls.start(e)}
                                className="flex flex-row items-center justify-between border-b cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                    <p className="font-semibold text-lg">SmartSetu-Bot</p>
                                </div>
                                <div className="flex items-center">
                                    <GripVertical className="h-6 w-6 text-muted-foreground" />
                                    <Button variant="ghost" size="icon" onClick={toggleChat} className="cursor-pointer">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-0">
                                <ScrollArea className="h-full" ref={scrollAreaRef}>
                                    {messages.length <= 1 ? (
                                        <WelcomeScreen />
                                    ) : (
                                        <div className="space-y-6 p-4">
                                            {messages.slice(1).map((message, index) => (
                                                <div
                                                    key={index}
                                                    className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {message.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                                                    <div
                                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${message.role === 'user'
                                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                                            : 'bg-background rounded-bl-none'
                                                            }`}
                                                    >
                                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {isLoading && (
                                                <div className="flex items-start gap-3 justify-start">
                                                    <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                                                    <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-background rounded-bl-none flex items-center space-x-2">
                                                        <span className="h-2 w-2 bg-primary/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                                        <span className="h-2 w-2 bg-primary/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                                        <span className="h-2 w-2 bg-primary/50 rounded-full animate-pulse"></span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </ScrollArea>
                            </CardContent>
                            <div className="p-4 border-t">
                                <form onSubmit={handleFormSubmit} className="flex w-full items-center space-x-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={t('chatbot.inputPlaceholder')}
                                        disabled={isLoading}
                                        className="h-12 text-base"
                                    />
                                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-12 w-12">
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </form>
                            </div>
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
                    className="fixed bottom-4 right-4 z-50 h-16 w-16 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-br from-[hsl(var(--light-green))] to-[hsl(var(--primary))] text-foreground/80"
                    size="icon"
                >
                    <AnimatePresence>
                        <motion.div
                            key={isOpen ? 'close' : 'open'}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 45 }}
                            transition={{ duration: 0.3 }}
                        >
                            {isOpen ? <X className="h-8 w-8" /> : <ChatIcon className="h-8 w-8" />}
                        </motion.div>
                    </AnimatePresence>
                    <span className="sr-only">{t('chatbot.toggleChat')}</span>
                </Button>
            </motion.div>
        </>
    );
}
