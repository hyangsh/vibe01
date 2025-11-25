const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { asyncHandler } = require("../core/asyncHandler");
const MessagingService = require("../services/MessagingService");

const messagingService = new MessagingService();

// @route   GET api/messaging
// @desc    Get all conversations for the current user
// @access  Private
router.get("/", auth, asyncHandler(async (req, res) => {
    const conversations = await messagingService.getConversations(req.user.id);
    res.json(conversations);
}));

// @route   GET api/messaging/:conversationId/messages
// @desc    Get all messages for a conversation
// @access  Private
router.get("/:conversationId/messages", auth, asyncHandler(async (req, res) => {
    const messages = await messagingService.getMessages(req.user.id, req.params.conversationId);
    res.json(messages);
}));

// @route   POST api/messaging/:conversationId/messages
// @desc    Send a new message
// @access  Private
router.post("/:conversationId/messages", auth, asyncHandler(async (req, res) => {
    const { text } = req.body;
    const newMessage = await messagingService.sendMessage(req.user.id, req.params.conversationId, text);
    res.status(201).json(newMessage);
}));

// @route   POST api/messaging/reservations/:reservationId
// @desc    Find or create a conversation for a reservation
// @access  Private
router.post("/reservations/:reservationId", auth, asyncHandler(async (req, res) => {
    const conversation = await messagingService.findOrCreateConversationForReservation(req.params.reservationId, req.user.id);
    res.json(conversation);
}));

module.exports = router;
