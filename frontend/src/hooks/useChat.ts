import { useEffect, useRef, useState } from "react";
import { sendMessage, fetchHistory } from "../services/chatApi";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sessionId = localStorage.getItem("sessionId");


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

   
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: trimmed },
    ]);

    setLoading(true);
    slowResponseShown.current = false;


    const slowTimer = setTimeout(() => {
      if (!slowResponseShown.current) {
        slowResponseShown.current = true;
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "Thanks for your patience — I’m checking this for you.",
          },
        ]);
      }
    }, 4000);

    try {
      const res = await sendMessage(trimmed, sessionId || undefined);

   
      if (!sessionId && res.sessionId) {
        localStorage.setItem("sessionId", res.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Sorry, something went wrong. Please try again in a moment.",
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
