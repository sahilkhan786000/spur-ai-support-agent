"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = createConversation;
exports.findConversation = findConversation;
exports.getAllConversations = getAllConversations;
const prisma_1 = require("../config/prisma");
function createConversation() {
    return prisma_1.prisma.conversation.create({
        data: {},
    });
}
function findConversation(id) {
    return prisma_1.prisma.conversation.findUnique({
        where: { id },
    });
}
/**
 * Used for right session panel
 * Explicit return type added to preserve TypeScript inference
 */
function getAllConversations() {
    return prisma_1.prisma.conversation.findMany({
        orderBy: { createdAt: "desc" },
    });
}
