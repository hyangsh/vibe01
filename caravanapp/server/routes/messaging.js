const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const MessagingService = require("../services/MessagingService");

const messagingService = new MessagingService();

// @route   GET api/messaging
// @desc    Get all conversations for the current user
// @access  Private
router.get("/", auth, async (req, res) => {
    try {
        const conversations = await messagingService.getConversations(req.user.id);
        res.json(conversations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/messaging/:conversationId/messages
// @desc    Get all messages for a conversation
// @access  Private
router.get("/:conversationId/messages", auth, async (req, res) => {
    try {
        const messages = await messagingService.getMessages(req.user.id, req.params.conversationId);
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/messaging/:conversationId/messages
// @desc    Send a new message
// @access  Private
router.post("/:conversationId/messages", auth, async (req, res) => {
    try {
        const { text } = req.body;
        const newMessage = await messagingService.sendMessage(req.user.id, req.params.conversationId, text);
        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   POST api/messaging/reservations/:reservationId
// @desc    Find or create a conversation for a reservation
// @access  Private
router.post("/reservations/:reservationId", auth, async (req, res) => {
    try {
        const conversation = await messagingService.findOrCreateConversationForReservation(req.params.reservationId, req.user.id);
        res.json(conversation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
