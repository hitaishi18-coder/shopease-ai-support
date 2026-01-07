import { useEffect, useRef } from "react";

function Chat({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-[70%] px-4 py-2 rounded-xl text-sm ${
            msg.sender === "user"
              ? "ml-auto bg-blue-600 text-white"
              : "mr-auto bg-gray-200 text-gray-800"
          }`}
        >
          {msg.text}
        </div>
      ))}

      {isTyping && (
        <div className="text-sm text-gray-500 italic">
          Agent is typing...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default Chat;
