'use client';
import HistoryCard from './historyCard';

export default function HistoryScreen() {
    const mockChats = [
        {
            id: 1,
            title: 'Next.js Setup Help',
            last: 'How do I install Tailwind?',
            time: '2m ago',
            active: true,
        },
        {
            id: 2,
            title: 'Dinner Recipes',
            last: 'Italian pasta with garlic...',
            time: '1h ago',
            active: false,
        },
        {
            id: 3,
            title: 'Workout Plan',
            last: '3 sets of pushups...',
            time: 'Yesterday',
            active: false,
        },
    ];

    return (
        <div className="flex flex-col h-full bg-white p-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-800 text-lg">Chats</h2>
                <button className="p-1 hover:bg-gray-100 rounded-lg text-blue-600">
                    {/* New Chat Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14m-7-7v14" />
                    </svg>
                </button>
            </div>

            <div className="space-y-1 overflow-y-auto">
                {mockChats.map((chat) => (
                    <HistoryCard
                        key={chat.id}
                        title={chat.title}
                        lastMessage={chat.last}
                        time={chat.time}
                        isActive={chat.active}
                    />
                ))}
            </div>
        </div>
    );
}
