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
    <div className="chat-window">
      <header className="chat-header">
        <div className="agent-profile">
          <div className="avatar">L</div>
          <div>
            <div className="agent-name">LumenCare AI</div>
            <div className="agent-status">Online - ready to help</div>
          </div>
        </div>

        <div className="header-actions">
          <button className="ghost-btn" onClick={() => setShowSessions((prev) => !prev)}>
            Recent
          </button>
          <button className="ghost-btn" onClick={goHome}>Restart</button>
          <button className="ghost-btn" onClick={() => window.location.reload()}>Close</button>
        </div>
      </header>

      {showSessions && <SessionHistory onClose={() => setShowSessions(false)} />}

      <div className="message-list">
        {messages.length === 0 && !loading ? (
          <div className="empty-state">
            <p>Hi {userName}.</p>
            <p>Ask anything about orders, returns, billing, or product support.</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={`${message.sender}-${index}`} message={message} />
          ))
        )}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} loading={loading} />
    </div>
  );
}
