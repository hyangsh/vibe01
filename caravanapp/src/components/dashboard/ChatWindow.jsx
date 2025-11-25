import React, { useState, useEffect, useRef } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import TimeAgo from "react-timeago";

const ChatWindow = ({ conversation, messages, onSendMessage, currentUser }) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!conversation || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting.
      </div>
    );
  }

  const handleSend = () => {
    if (inputText.trim() === "") return;
    onSendMessage(inputText);
    setInputText("");
  };

  const otherParticipant = conversation.participants.find(p => p._id !== currentUser._id);
  const displayName = otherParticipant?.name || "User";

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">{displayName}</h3>
        <p className="text-sm text-gray-500">
            Regarding: {conversation.reservation.caravan.name}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.sender === currentUser._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === currentUser._id ? "bg-indigo-500 text-white" : "bg-white"}`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-xs mt-1 ${msg.sender === currentUser._id ? "text-indigo-200" : "text-gray-400"}`}
              >
                <TimeAgo date={msg.createdAt} />
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="w-full pr-12 pl-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <button
              onClick={handleSend}
              className="p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
