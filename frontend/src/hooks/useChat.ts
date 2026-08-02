import { useEffect, useRef, useState } from "react";
import { fetchHistory, sendMessage } from "../services/chatApi";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = typeof window !== "undefined" ? localStorage.getItem("sessionId") : null;
  const slowResponseShown = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    fetchHistory(sessionId)
      .then((res) => {
        setMessages(res.messages || []);
      })
      .catch(() => {
        setMessages([]);
      });
  }, [sessionId]);

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setLoading(true);
    slowResponseShown.current = false;

    const slowTimer = window.setTimeout(() => {
      if (!slowResponseShown.current) {
        slowResponseShown.current = true;
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Thanks for your patience — I’m reviewing your request and preparing a helpful reply.",
          },
        ]);
      }
    }, 3500);

    try {
      const res = await sendMessage(trimmed, sessionId || undefined);

      if (!sessionId && res.sessionId) {
        localStorage.setItem("sessionId", res.sessionId);
      }

      setMessages((prev) => [...prev, { sender: "ai", text: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I’m having trouble reaching the support service right now. Please try again in a moment.",
        },
      ]);
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
    }
  }

  return {
    messages,
    loading,
    handleSend,
  };
}
