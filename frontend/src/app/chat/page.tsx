"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [threadId, setThreadId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initialize thread ID on component mount
    setThreadId(uuidv4());
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function sendPrompt() {
    if (!prompt.trim() || !threadId) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage,
          threadId: threadId 
        }),
      });

      const data = await res.json();
      console.log(data);

      let assistantResponse = "";
      if (data.text) {
        assistantResponse = data.text;
      } else if (data.error) {
        assistantResponse = `Error: ${data.error}`;
      } else {
        assistantResponse = "No response received";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: assistantResponse }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${(err as Error).message}` }]);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show brief feedback without alert
    }).catch(() => {
      console.error("Failed to copy");
    });
  };

  return (
    <div className={`flex flex-col h-screen ${isDark ? "bg-gray-900" : "bg-white"}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className={`text-2xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Clara</h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`px-3 py-2 rounded-lg transition-colors ${
              isDark
                ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center py-12">
              <h2 className={`text-4xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Welcome to Clara</h2>
              <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>Ask me anything. I can search the web for real-time information.</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg group relative ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : isDark
                    ? "bg-gray-700 text-gray-100 rounded-bl-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                
                {/* Copy button for assistant messages */}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyToClipboard(msg.content)}
                    className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-md text-xs ${
                      isDark
                        ? "bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-white"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-gray-900"
                    }`}
                    title="Copy message"
                  >
                    📋
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-lg rounded-bl-none ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-gray-400" : "bg-gray-400"}`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce delay-100 ${isDark ? "bg-gray-400" : "bg-gray-400"}`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce delay-200 ${isDark ? "bg-gray-400" : "bg-gray-400"}`}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              disabled={loading}
              rows={3}
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              }`}
            />
            <button
              onClick={sendPrompt}
              disabled={loading || !prompt.trim()}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
          <p className={`text-xs mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Press Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}