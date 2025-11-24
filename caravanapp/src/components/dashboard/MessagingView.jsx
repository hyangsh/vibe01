import React, { useState, useMemo } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import {
  conversations as initialConversations,
  messages as initialMessages,
} from "./data";

const MessagingView = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState(initialMessages);
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversations[0]?.id,
  );

  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  const selectedMessages = useMemo(
    () => messages[selectedConversationId] || [],
    [messages, selectedConversationId],
  );

  return (
    <div className="bg-white shadow rounded-lg h-[calc(100vh-10rem)] flex">
      <ConversationList
        conversations={conversations}
        onSelectConversation={setSelectedConversationId}
        selectedConversationId={selectedConversationId}
      />
      <ChatWindow
        conversation={selectedConversation}
        messages={selectedMessages}
      />
    </div>
  );
};

export default MessagingView;
