import React from "react";

const ConversationList = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
}) => {
  return (
    <div className="w-1/3 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {conversations.map((convo) => (
          <li
            key={convo.id}
            onClick={() => onSelectConversation(convo.id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedConversationId === convo.id ? "bg-gray-100" : ""}`}
          >
            <div className="flex items-center space-x-4">
              <img
                className="w-10 h-10 rounded-full"
                src={convo.guest.avatar}
                alt={convo.guest.name}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">
                    {convo.guest.name}
                  </h3>
                  <p className="text-xs text-gray-500">{convo.timestamp}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {convo.lastMessage}
                </p>
              </div>
              {convo.unread > 0 && (
                <div className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  {convo.unread}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConversationList;
