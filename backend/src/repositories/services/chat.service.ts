import {
  createConversation,
  findConversation,
} from "../conversation.repo";
import {
  saveMessage,
  getMessages,
} from "../message.repo";
import { generateReply } from "./llm.service";

type ChatHistoryEntry = {
  sender: "user" | "ai";
  text: string;
};

export async function handleChatMessage(
  message: string,
  sessionId?: string
) {
  let conversationId: string;

  if (!sessionId) {
    const convo = await createConversation();
    conversationId = convo.id;
  } else {
    const exists = await findConversation(sessionId);
    if (!exists) {
      const convo = await createConversation();
      conversationId = convo.id;
    } else {
      conversationId = sessionId;
    }
  }

  await saveMessage(conversationId, "user", message);

  let reply: string;

  try {
    const history = await getMessages(conversationId);
    const typedHistory: ChatHistoryEntry[] = history.map((entry) => ({
      sender: entry.sender === "ai" ? "ai" : "user",
      text: entry.text,
    }));
    reply = await generateReply(typedHistory, message);
  } catch (err) {
    console.error("LLM error:", err);
    reply = "Thanks for your question. A human support agent will assist you shortly.";
  }

  await saveMessage(conversationId, "ai", reply);

  return { reply, sessionId: conversationId };
}
