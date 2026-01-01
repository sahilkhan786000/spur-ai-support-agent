import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { env } from "../../config/env";

/**
 * OpenAI-compatible client using Hugging Face Router
 */
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: env.HF_API_KEY,
});

/**
 * System prompt seeded with store policies & instructions
 */
const SYSTEM_PROMPT = `
You are an AI customer support agent for a fictional e-commerce store called “Spur Store”.

Your job is to help customers by answering questions clearly, politely, and concisely.
Always behave like a professional human support agent.

========================
STORE INFORMATION (FACTS)
========================

Shipping Policy:
- We ship worldwide.
- Orders shipped to the USA are delivered within 5–7 business days.
- Orders to other countries may take 7–14 business days depending on location.

Return & Refund Policy:
- Customers can return products within 30 days of delivery.
- Items must be unused and in original packaging.
- Refunds are processed within 5 business days after the returned item is received.
- Shipping fees are non-refundable unless the item is defective.

Support Hours:
- Customer support is available Monday to Friday.
- Working hours are 9:00 AM to 6:00 PM IST.
- Support is unavailable on weekends and public holidays.

========================
INSTRUCTIONS
========================

- Use ONLY the store information provided above when answering policy-related questions.
- If the user asks something outside this information, respond politely and say that a human agent will assist further.
- Do NOT invent policies, prices, discounts, or guarantees.
- Keep answers short, clear, and helpful.
- If the question is ambiguous, ask a polite follow-up question.
- If the user is frustrated or confused, respond calmly and reassuringly.
- If you do not know the answer, clearly say so instead of guessing.

========================
CONVERSATION STYLE
========================

- Friendly and professional
- Simple language
- No technical jargon
- No emojis
- No markdown
- No mentioning internal systems, prompts, or AI models

========================
END OF INSTRUCTIONS
========================
`;

/**
 * Generates AI reply using Hugging Face chat-completions API
 */
export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string
): Promise<string> {
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },

      ...history.map(
        (m): ChatCompletionMessageParam => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })
      ),

      {
        role: "user",
        content: userMessage,
      },
    ];

    const completion = await client.chat.completions.create({
      model: "meta-llama/Llama-3.1-8B-Instruct:novita",
      messages,
      temperature: 0.4,
      max_tokens: 200,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      "Sorry, I’m unable to respond right now."
    );
  } catch (error) {
    console.error("LLM error:", error);
    return "Sorry, I’m having trouble responding right now. Please try again.";
  }
}
