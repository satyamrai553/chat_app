import { useEffect, useRef, useState } from "react";

interface Message {
    type: string;
    payload: {
        message?: string;
        roomId?: string;
    };
}

function App() {
    const [chat, setChat] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        socketRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                payload: {
                    roomId: "1234"
                }
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "chat" && data.payload.message) {
                    setChat((prev) => [...prev, data.payload.message]);
                } else if (data.type === "system") {
                    setChat((prev) => [...prev, data.message]);
                }
            } catch (error) {
                console.error("Error parsing message:", error);
                // Fallback to displaying raw message if not JSON
                setChat((prev) => [...prev, event.data]);
            }
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    function sendMessage() {
        if (!input.trim()) return;

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "chat",
                payload: {
                    message: input
                }
            }));
            setInput("");
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col items-center h-dvh bg-blue-950">
            <div className="bg-gray-700 w-96 h-4/5 overflow-y-auto p-2">
                {chat.map((message, idx) => (
                    <div key={idx} className="text-white p-1">
                        {message}
                    </div>
                ))}
            </div>
            <div className="flex w-96 mt-3">
                <input
                    type="text"
                    placeholder="message..."
                    className="h-13 text-black bg-white border-blue-500 border-4 rounded-lg w-3/4 mx-4"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-400 border-3 border-white rounded-md w-1/4"
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default App;