import { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../services/api";

function Chatbot({ context }) {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your medical AI assistant." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const finalMessage = `${context || ""} User question: ${userMessage}`;
      const res = await chatWithAI(finalMessage);

      setMessages(prev => [
        ...prev,
        { sender: "ai", text: res.data.reply }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "ai", text: "Error fetching response." }
      ]);
    }

    setLoading(false);
  };

  /* ✅ NEW FEATURE ADDED HERE */
  useEffect(() => {
    if (!context) return;

    const autoSendContext = async () => {
      setLoading(true);

      // Show report as user message
      setMessages(prev => [
        ...prev,
        { sender: "user", text: context }
      ]);

      try {
        const res = await chatWithAI(context);

        setMessages(prev => [
          ...prev,
          { sender: "ai", text: res.data.reply }
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          { sender: "ai", text: "Error fetching response." }
        ]);
      }

      setLoading(false);
    };

    autoSendContext();

  }, [context]);
  /* ✅ END OF NEW FEATURE */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-white shadow-lg rounded-xl">

      <div className="bg-blue-600 text-white p-4 rounded-t-xl">
        <h2 className="font-semibold">AI Medical Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
<div
  key={index}
  className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-line ${
    msg.sender === "user"
      ? "bg-blue-600 text-white self-end ml-auto"
      : "bg-gray-100 text-gray-800"
  }`}
>
  {msg.text}
</div>

        ))}

        {loading && (
          <div className="text-gray-400 text-sm">AI is typing...</div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask about your result..."
          rows={1}
          className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default Chatbot;
