// input.js
export default function Input({ sendMessage, input, setInput }) {
    // Handle "Enter" key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                value={input} // Bind state
                onChange={(e) => setInput(e.target.value)} // Update state
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                onClick={sendMessage}
                disabled={!input.trim()} // Prevent sending empty messages
            >
                Send
            </button>
        </div>
    );
}
