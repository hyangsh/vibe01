const ConversationRepository = require("../repositories/ConversationRepository");
const MessageRepository = require("../repositories/MessageRepository");
const ReservationRepository = require("../repositories/ReservationRepository");
const AuthorizationError = require("../core/errors/AuthorizationError");
const NotFoundError = require("../core/errors/NotFoundError");

class MessagingService {
  constructor() {
    this.conversationRepository = new ConversationRepository();
    this.messageRepository = new MessageRepository();
    this.reservationRepository = new ReservationRepository(); // To find reservation details
  }

  async getConversations(userId) {
    return await this.conversationRepository.findByUserId(userId);
  }

  async getMessages(userId, conversationId) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }
    if (!conversation.participants.includes(userId)) {
      throw new AuthorizationError("You are not a participant in this conversation.");
    }
    return await this.messageRepository.findByConversationId(conversationId);
  }

  async sendMessage(senderId, conversationId, text) {
    const conversation = await this.conversationRepository.findById(conversationId);
    if (!conversation) {
        throw new NotFoundError("Conversation not found");
    }
    if (!conversation.participants.includes(senderId)) {
        throw new AuthorizationError("You are not a participant in this conversation.");
    }

    const messageData = {
      conversation: conversationId,
      sender: senderId,
      text: text,
    };
    const newMessage = await this.messageRepository.create(messageData);
    
    // Update lastMessage in conversation
    conversation.lastMessage = newMessage._id;
    await this.conversationRepository.update(conversationId, { lastMessage: newMessage._id });

    // TODO: Implement real-time notification (e.g., WebSocket)

    return newMessage;
  }
  
  async findOrCreateConversationForReservation(reservationId, userId) {
    let conversation = await this.conversationRepository.findByReservationId(reservationId);

    if (!conversation) {
        const reservation = await this.reservationRepository.findById(reservationId);
        if (!reservation) {
            throw new NotFoundError("Reservation not found");
        }
        
        // Ensure the user is part of the reservation
        const reservationHost = reservation.caravan.host.toString();
        const reservationGuest = reservation.guest.toString();
        if (userId !== reservationHost && userId !== reservationGuest) {
            throw new AuthorizationError("You are not part of this reservation.");
        }

        conversation = await this.conversationRepository.create(reservation);
    }
    
    return conversation;
  }
}

module.exports = MessagingService;
