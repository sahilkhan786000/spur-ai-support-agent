"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessage = saveMessage;
exports.getMessages = getMessages;
exports.getLastMessage = getLastMessage;
const prisma_1 = require("../config/prisma");
function saveMessage(conversationId, sender, text) {
    return prisma_1.prisma.message.create({
        data: { conversationId, sender, text },
    });
}
function getMessages(conversationId) {
    return prisma_1.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
    });
}
/**
 * Used for session preview cards
 */
function getLastMessage(conversationId) {
    return prisma_1.prisma.message.findFirst({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
    });
}
