import { prisma } from "../config/prisma";

export function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string
) {
  return prisma.message.create({
    data: { conversationId, sender, text },
  });
}

export function getMessages(conversationId: string) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * Used for session preview cards
 */
export function getLastMessage(conversationId: string) {
  return prisma.message.findFirst({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
  });
}
