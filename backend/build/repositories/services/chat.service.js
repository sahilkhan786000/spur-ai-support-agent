"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChatMessage = handleChatMessage;
const conversation_repo_1 = require("../conversation.repo");
const message_repo_1 = require("../message.repo");
const llm_service_1 = require("./llm.service");
async function handleChatMessage(message, sessionId) {
    let conversationId;
    if (!sessionId) {
        const convo = await (0, conversation_repo_1.createConversation)();
        conversationId = convo.id;
    }
    else {
        const exists = await (0, conversation_repo_1.findConversation)(sessionId);
        if (!exists) {
            const convo = await (0, conversation_repo_1.createConversation)();
            conversationId = convo.id;
        }
        else {
            conversationId = sessionId;
        }
    }
    await (0, message_repo_1.saveMessage)(conversationId, "user", message);
    let reply;
    try {
        const history = await (0, message_repo_1.getMessages)(conversationId);
        const typedHistory = history.map((entry) => ({
            sender: entry.sender === "ai" ? "ai" : "user",
            text: entry.text,
        }));
        reply = await (0, llm_service_1.generateReply)(typedHistory, message);
    }
    catch (err) {
        console.error("LLM error:", err);
        reply = "Thanks for your question. A human support agent will assist you shortly.";
    }
    await (0, message_repo_1.saveMessage)(conversationId, "ai", reply);
    return { reply, sessionId: conversationId };
}
