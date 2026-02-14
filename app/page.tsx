'use client';
import HistoryScreen from './component/historyScreen';
import MessageScreen from './component/messageScreen';

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-gray-50">
      {/* Sidebar - fixed width */}
      <div className="w-36 border-r bg-white h-full">
        <HistoryScreen />
      </div>

      {/* Main Chat Area - fills remaining space */}
      <div className="flex-1 flex flex-col h-full">
        <MessageScreen />
      </div>
    </main>
  );
}
