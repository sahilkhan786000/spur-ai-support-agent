import { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { SessionHistory } from "./SessionHistory";

export function ChatWindow() {
  const { messages, loading, handleSend } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showSessions, setShowSessions] = useState(false);

  const userName = localStorage.getItem("userName") || "Customer";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function goHome() {
    localStorage.removeItem("userName");
    localStorage.removeItem("sessionId");
    window.location.reload();
  }

  return (
    <div className="chat-layout">
      {/* LEFT: Chat Window */}
      <div className="chat-container">
        <header className="chat-header">
          <div>
            🪐 Spur AI Support
            <div className="subtle">Talking with {userName}</div>
          </div>

          <div className="header-actions">
            <button
              className="hamburger"
              onClick={() => setShowSessions(true)}
            >
              ☰
            </button>
            <button className="home-btn" onClick={goHome}>
              Home
            </button>
          </div>
        </header>

        <div className="messages">
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              sender={m.sender}
              text={m.text}
              label={m.sender === "user" ? userName : "AI"}
            />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={handleSend} disabled={loading} />
      </div>

      {/* RIGHT: Session Panel */}
      <div className={`session-wrapper ${showSessions ? "open" : ""}`}>
        <SessionHistory onClose={() => setShowSessions(false)} />
      </div>
    </div>
  );
}
