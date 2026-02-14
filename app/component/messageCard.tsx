'use client';
import React from 'react';

// Added props so we can actually pass text to it
export default function MessageCard({
    isAgent,
    text,
}: {
    isAgent: boolean;
    text: string;
}) {
    return (
        <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'}`}>
            <div
                className={`max-w-[70%] p-3 rounded-lg ${isAgent
                    ? 'bg-white border text-gray-800'
                    : 'bg-blue-600 text-white shadow-md'
                    }`}
            >
                <p className="text-sm font-semibold mb-1">
                    {isAgent ? 'AI Agent' : 'You'}
                </p>
                <p>{text}</p>
            </div>
        </div>
    );
}
