import { Router } from "express";
import { chatMessageSchema } from "../validators/chat.validator";
import { handleChatMessage } from "../repositories/services/chat.service";
import { getMessages, getLastMessage } from "../repositories/message.repo";
import { getAllConversations } from "../repositories/conversation.repo";


const router = Router();

/**
 * Send chat message
 */
router.post("/message", async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { message, sessionId } = chatMessageSchema.parse(req.body);
    console.log("Received message:", message, "Session ID:", sessionId);
    // ✅ normalize null → undefined
    const result = await handleChatMessage(
      message,
      sessionId ?? undefined
    );

    res.json(result);
  } catch {
    res.status(400).json({
      error: "Unable to process your message. Please try again.",
    });
  }
});

/**
 * Load messages for a session
 */
router.get("/history", async (req, res) => {
  const sessionId = req.query.sessionId as string | undefined;
  if (!sessionId) return res.json({ messages: [] });

  const messages = await getMessages(sessionId);
  res.json({ messages });
});

/**
 * List all sessions (right panel)
 */
router.get("/sessions", async (_req, res) => {
  const conversations = await getAllConversations();

  const sessions = await Promise.all(
    conversations.map(async (c) => {
      const lastMessage = await getLastMessage(c.id);
      return {
        id: c.id,
        lastMessage: lastMessage?.text || "New conversation",
        updatedAt: lastMessage?.createdAt || c.createdAt,
      };
    })
  );

  res.json({ sessions });
});

export default router;
