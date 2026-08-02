import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { env } from "../../config/env";

type ChatHistoryEntry = {
  sender: "user" | "ai";
  text: string;
};

const client = env.HF_API_KEY
  ? new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: env.HF_API_KEY,
    })
  : null;

const SYSTEM_PROMPT = `
You are LumenCare, a premium AI customer support assistant for a modern digital product company.
Your role is to help customers with orders, returns, refunds, billing, account issues, delivery questions, and product guidance.

Guidelines:
- Be warm, concise, polished, and reassuring.
- Sound like a high-end support specialist, not a robotic bot.
- When you are confident, answer directly.
- When details are missing, ask one clear follow-up question.
- If the customer requests a human escalation, acknowledge it gracefully.
- Never invent policy details or make promises you cannot verify.
- If you do not know the answer, say so clearly and suggest the next best step.

Keep replies short, human, and actionable.
`;

function toChatMessage(entry: ChatHistoryEntry): ChatCompletionMessageParam {
  return {
    role: entry.sender === "user" ? "user" : "assistant",
    content: entry.text,
  };
}

export async function generateReply(history: ChatHistoryEntry[], message: string): Promise<string> {
  if (!client) {
    return "I’m here to help. Please share your question and I’ll guide you through the best next step.";
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map(toChatMessage),
    { role: "user", content: message },
  ];

  const completion = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages,
    temperature: 0.7,
    max_tokens: 220,
  });

  const reply = completion.choices[0]?.message?.content?.trim();
  return reply || "I’m sorry, I couldn’t generate a reliable response. Please try again in a moment.";
}
