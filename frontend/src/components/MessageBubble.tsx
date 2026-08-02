export function MessageBubble({ message }: { message: { sender: "user" | "ai"; text: string } }) {
  const isUser = message.sender === "user";

  return (
    <div className={`message-row ${isUser ? "user-row" : "ai-row"}`}>
      <div className={`bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        {message.text}
      </div>
    </div>
  );
}
