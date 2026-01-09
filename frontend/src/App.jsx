import { useState, useEffect } from "react";
import Input from "./components/Input";
import Chat from "./components/Chat";

// ✅ Dynamic backend URL (local OR production)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

function App() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Load previous chat history
  useEffect(() => {
    const savedSessionId = localStorage.getItem("sessionId");

    if (!savedSessionId) return;

    setSessionId(savedSessionId);

    fetch(`${API_BASE_URL}/chat/history/${savedSessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch((err) =>
        console.error("❌ History load failed:", err)
      );
  }, []);

  const handleSendMessage = async (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId,
        }),
      });

      const data = await res.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem("sessionId", data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply },
      ]);
    } catch (err) {
      console.error("❌ Server error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Server unreachable. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-[95%] h-[90%] bg-white rounded-2xl shadow-lg flex p-4">
        <div className="flex-1 flex flex-col p-4">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">MY AI BOT</h2>
            <button
              onClick={() => {
                setMessages([]);
                setSessionId(null);
                localStorage.removeItem("sessionId");
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              New Chat
            </button>
          </div>

          {/* Chat */}
          <Chat messages={messages} isTyping={isTyping} />

          {/* Input */}
          <div className="mt-4">
            <Input onSend={handleSendMessage} disabled={isTyping} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
