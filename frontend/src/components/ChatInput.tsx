import { useState } from "react";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (msg: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState("");

  function send() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="input-bar">
      <input
        value={text}
        disabled={disabled}
        placeholder="Ask the universe..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
      />
      <button disabled={disabled} onClick={send}>
        Send
      </button>
    </div>
  );
}
