import { prisma } from "../config/prisma";
import type { Prisma } from "@prisma/client";

export function createConversation() {
  return prisma.conversation.create({
    data: {},
  });
}

export function findConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id },
  });
}

/**
 * Used for right session panel
 * Explicit return type added to preserve TypeScript inference
 */
export function getAllConversations(): Prisma.PrismaPromise<
  {
    id: string;
    createdAt: Date;
  }[]
> {
  return prisma.conversation.findMany({
    orderBy: { createdAt: "desc" },
  });
}
