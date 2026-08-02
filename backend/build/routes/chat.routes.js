"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_validator_1 = require("../validators/chat.validator");
const chat_service_1 = require("../repositories/services/chat.service");
const message_repo_1 = require("../repositories/message.repo");
const conversation_repo_1 = require("../repositories/conversation.repo");
const router = (0, express_1.Router)();
/**
 * Send chat message
 */
router.post("/message", async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { message, sessionId } = chat_validator_1.chatMessageSchema.parse(req.body);
        console.log("Received message:", message, "Session ID:", sessionId);
        // ✅ normalize null → undefined
        const result = await (0, chat_service_1.handleChatMessage)(message, sessionId ?? undefined);
        res.json(result);
    }
    catch {
        res.status(400).json({
            error: "Unable to process your message. Please try again.",
        });
    }
});
/**
 * Load messages for a session
 */
router.get("/history", async (req, res) => {
    const sessionId = req.query.sessionId;
    if (!sessionId)
        return res.json({ messages: [] });
    const messages = await (0, message_repo_1.getMessages)(sessionId);
    res.json({ messages });
});
/**
 * List all sessions (right panel)
 */
router.get("/sessions", async (_req, res) => {
    const conversations = await (0, conversation_repo_1.getAllConversations)();
    const sessions = await Promise.all(conversations.map(async (c) => {
        const lastMessage = await (0, message_repo_1.getLastMessage)(c.id);
        return {
            id: c.id,
            lastMessage: lastMessage?.text || "New conversation",
            updatedAt: lastMessage?.createdAt || c.createdAt,
        };
    }));
    res.json({ sessions });
});
exports.default = router;
