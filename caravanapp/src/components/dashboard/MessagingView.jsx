import React, { useState, useEffect, useMemo } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { getConversations, getMessages, sendMessage, getMe } from "../../utils/api";

const MessagingView = ({ preselectedConversationId }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // Store messages per conversationId
  const [selectedConversationId, setSelectedConversationId] = useState(preselectedConversationId || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [convRes, userRes] = await Promise.all([
            getConversations(),
            getMe()
        ]);
        
        setConversations(convRes.data);
        setCurrentUser(userRes.data);

        if (convRes.data.length > 0 && !selectedConversationId) {
          setSelectedConversationId(convRes.data[0]._id);
        }
      } catch (err) {
        setError("Failed to fetch initial data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (preselectedConversationId) {
        setSelectedConversationId(preselectedConversationId);
    }
  }, [preselectedConversationId]);

  useEffect(() => {
    if (!selectedConversationId) return;

    const fetchMessages = async () => {
      // Don't refetch if we already have messages
      if (messages[selectedConversationId]) return;

      try {
        const { data } = await getMessages(selectedConversationId);
        setMessages((prev) => ({ ...prev, [selectedConversationId]: data }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        // Handle message fetch error specifically if needed
      }
    };
    fetchMessages();
  }, [selectedConversationId, messages]);

  const handleSendMessage = async (text) => {
    if (!selectedConversationId) return;

    try {
      const { data: newMessage } = await sendMessage(selectedConversationId, text);
      setMessages((prev) => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
      }));
       // Move the conversation to the top
      setConversations(prev => {
        const conv = prev.find(c => c._id === selectedConversationId);
        if (!conv) return prev;
        const otherConvs = prev.filter(c => c._id !== selectedConversationId);
        conv.lastMessage = newMessage;
        return [conv, ...otherConvs];
      });

    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const selectedConversation = useMemo(
    () => conversations.find((c) => c._id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  const selectedMessages = useMemo(
    () => messages[selectedConversationId] || [],
    [messages, selectedConversationId],
  );

  if (loading) return <p>Loading conversations...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white shadow rounded-lg h-[calc(100vh-10rem)] flex">
      <ConversationList
        conversations={conversations}
        onSelectConversation={setSelectedConversationId}
        selectedConversationId={selectedConversationId}
        currentUser={currentUser}
      />
      <ChatWindow
        conversation={selectedConversation}
        messages={selectedMessages}
        onSendMessage={handleSendMessage}
        currentUser={currentUser}
      />
    </div>
  );
};
export default MessagingView;
