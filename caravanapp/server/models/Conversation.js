const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
    unique: true, // One conversation per reservation
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
}, { timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
