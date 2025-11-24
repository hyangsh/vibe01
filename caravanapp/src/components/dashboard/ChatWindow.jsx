import React, { useState } from "react";
import { PaperAirplaneIcon, TagIcon } from "@heroicons/react/24/solid";
import { savedReplies } from "./data";

const ChatWindow = ({ conversation, messages }) => {
  const [inputText, setInputText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting.
      </div>
    );
  }

  const handleSend = () => {
    if (inputText.trim() === "") return;
    // Logic to send message would go here
    console.log("Sending:", inputText);
    setInputText("");
  };

  const handleInsertReply = (text) => {
    setInputText((prev) => (prev ? `${prev} ${text}` : text));
    setShowReplies(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">{conversation.guest.name}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.from === "host" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.from === "host" ? "bg-indigo-500 text-white" : "bg-white"}`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-xs mt-1 ${msg.from === "host" ? "text-indigo-200" : "text-gray-400"}`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
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
            className="w-full pr-24 pl-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="p-2 text-gray-500 hover:text-indigo-600"
              >
                <TagIcon className="w-5 h-5" />
              </button>
              {showReplies && (
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border rounded-lg shadow-lg">
                  <ul>
                    {savedReplies.map((reply) => (
                      <li
                        key={reply.id}
                        onClick={() => handleInsertReply(reply.text)}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <strong>{reply.title}</strong>
                        <p className="text-xs text-gray-500 truncate">
                          {reply.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
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
