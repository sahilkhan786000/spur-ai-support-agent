import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  loading?: boolean;
};

export function ChatInput({ onSend, loading }: Props) {
  const [text, setText] = useState("");

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setText("");
  }

  return (
    <form
      className="chat-input"
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ask about your order, delivery, or refund..."
        disabled={loading}
      />
      <button type="submit" disabled={loading || !text.trim()}>
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
