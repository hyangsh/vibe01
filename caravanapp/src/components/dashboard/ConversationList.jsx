import React from "react";

const ConversationList = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
  currentUser,
}) => {
  return (
    <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Messages</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {conversations.map((convo) => {
            if (!currentUser) return null;

            const otherParticipant = convo.participants.find(p => p._id !== currentUser._id);
            const displayName = otherParticipant?.name || convo.reservation?.guest?.name || "Unknown User";
            const caravanName = convo.reservation?.caravan?.name || "Unknown Caravan";

            return (
              <li
                key={convo._id}
                onClick={() => onSelectConversation(convo._id)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedConversationId === convo._id ? "bg-gray-100" : ""}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {displayName}
                      </h3>
                      {convo.lastMessage && (
                        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {new Date(convo.lastMessage.createdAt).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                        <span className="font-semibold">{caravanName}:</span> {convo.lastMessage?.text || "No messages yet"}
                    </p>
                  </div>
                </div>
              </li>
            )
        })}
      </ul>
    </div>
  );
};

export default ConversationList;
