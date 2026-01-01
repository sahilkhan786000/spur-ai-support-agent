import {
  createConversation,
  findConversation,
} from "../conversation.repo";
import {
  saveMessage,
  getMessages,
} from "../message.repo";
import { generateReply } from "./llm.service";

export async function handleChatMessage(
  message: string,
  sessionId?: string
) {
  let conversationId: string;

  // 1️⃣ Ensure a valid session always exists
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

  // 2️⃣ Save user message no matter what
  await saveMessage(conversationId, "user", message);

  // 3️⃣ Generate AI reply safely
  let reply: string;

  try {
    const history = await getMessages(conversationId);
    reply = await generateReply(history, message);
  } catch (err) {
    console.error("LLM error:", err);

    // Graceful fallback (IMPORTANT)
    reply =
      "Thanks for your question. A human support agent will assist you shortly.";
  }

  // 4️⃣ Save AI reply
  await saveMessage(conversationId, "ai", reply);

  // 5️⃣ ALWAYS return sessionId
  return { reply, sessionId: conversationId };
}
