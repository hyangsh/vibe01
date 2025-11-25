const Conversation = require("../models/Conversation");

class ConversationRepository {
  async findByUserId(userId) {
    return await Conversation.find({ participants: userId })
      .populate({
        path: "reservation",
        select: "caravan guest",
        populate: [
          { path: "caravan", select: "name photos" },
          { path: "guest", select: "name" },
        ],
      })
      .populate("lastMessage")
      .populate("participants", "name")
      .sort({ updatedAt: -1 });
  }

  async findByReservationId(reservationId) {
    return await Conversation.findOne({ reservation: reservationId });
  }

  async findById(id) {
    return await Conversation.findById(id);
  }


  async create(reservation) {
    const conversationData = {
      reservation: reservation._id,
      participants: [reservation.guest, reservation.caravan.host],
    };
    const newConversation = new Conversation(conversationData);
    return await newConversation.save();
  }

  async update(id, data) {
    return await Conversation.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = ConversationRepository;
