import { useState } from "react";

export default function Input({ onSend, disabled }) {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        placeholder="Type a message..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        disabled={disabled}
        className="flex-1 px-4 py-3 rounded-xl border outline-none disabled:bg-gray-100"
      />

      <button
        onClick={sendMessage}
        disabled={disabled}
        className="px-5 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
