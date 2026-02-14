'use client';
import MessageCard from './messageCard';
import Input from './Input';
import { useState, useEffect } from 'react'; // Added useEffect
import { generateNextSessionId } from './createSesssionId';
import { createClient } from "@/utils/supabase/client";

export default function MessageScreen() {
    const [messages, setMessages] = useState([
        { text: 'Hello! How can I help you today?', isAgent: true },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');

    // --- NEW: Generate ID on page load ---
    useEffect(() => {
        const initSession = async () => {
            const id = await generateNextSessionId();
            setSessionId(id);

            // Register the session in DB so it's ready
            const supabase = createClient();
            await supabase.from('chat_sessions').insert([{ id: id }]);
        };
        initSession();
    }, []);

    const sendMessage = async () => {
        if (!input.trim() || !sessionId) return; // Don't send if ID isn't ready

        const userMessage = { text: input, isAgent: false };
        setMessages((prev) => [...prev, userMessage]);

        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    sessionId: sessionId // Now this is "bufferchat001"
                }),
            });

            const data = await res.json();

            if (data.data) {
                setMessages((prev) => [...prev, { text: data.data, isAgent: true }]);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Display the Current Session ID in the Header for practice */}
            <div className="bg-white p-2 text-xs text-gray-400 border-b">
                Session: {sessionId || 'Generating...'}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <MessageCard key={index} isAgent={msg.isAgent} text={msg.text} />
                ))}
                {loading && (
                    <div className="text-sm text-gray-500 animate-pulse">
                        Assistant is thinking...
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-white">
                <Input sendMessage={sendMessage} input={input} setInput={setInput} />
            </div>
        </div>
    );
}