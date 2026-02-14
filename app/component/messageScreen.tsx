'use client';
import MessageCard from './messageCard';
import Input from './input';
import { useState } from 'react';

export default function MessageScreen() {
    // Initialize as an array with a welcome message
    const [messages, setMessages] = useState([
        { text: 'Hello! How can I help you today?', isAgent: true },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, isAgent: false };

        // 1. Add user message to UI immediately
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input; // Store it before clearing
        setInput(''); // Clear input box
        setLoading(true);

        try {
            // 2. Fetch from your Next.js API route
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput }),
            });

            const data = await res.json();
            console.log('the Response:', data.text);
            // 3. Add AI response to UI
            if (data.text) {
                setMessages((prev) => [...prev, { text: data.text, isAgent: true }]);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <MessageCard key={index} isAgent={msg.isAgent} text={msg.text} />
                ))}
                {loading && (
                    <div className="text-sm text-gray-500 animate-pulse">
                        Gemini is thinking...
                    </div>
                )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t bg-white">
                <Input sendMessage={sendMessage} input={input} setInput={setInput} />
            </div>
        </div>
    );
}
