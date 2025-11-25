const Message = require("../models/Message");

class MessageRepository {
  async findByConversationId(conversationId) {
    return await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
  }

  async create(messageData) {
    const newMessage = new Message(messageData);
    return await newMessage.save();
  }
}

module.exports = MessageRepository;
