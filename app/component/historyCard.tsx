'use client';

interface HistoryCardProps {
    title: string;
    lastMessage: string;
    time: string;
    isActive?: boolean;
}

export default function HistoryCard({
    title,
    lastMessage,
    time,
    isActive,
}: HistoryCardProps) {
    return (
        <div
            className={`
      group flex flex-col gap-1 p-3 rounded-xl cursor-pointer transition-all duration-200
      ${isActive
                    ? 'bg-blue-50 border-blue-100 shadow-sm'
                    : 'hover:bg-gray-100 border-transparent'
                }
      border
    `}
        >
            <div className="flex justify-between items-start">
                <h3
                    className={`text-sm font-medium truncate w-40 ${isActive ? 'text-blue-700' : 'text-gray-900'
                        }`}
                >
                    {title}
                </h3>
                <span className="text-[10px] text-gray-400 font-medium uppercase">
                    {time}
                </span>
            </div>

            <p className="text-xs text-gray-500 truncate line-clamp-1">
                {lastMessage}
            </p>

            {/* Subtle "dots" menu that appears on hover */}
            <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-gray-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
    