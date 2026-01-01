import { useState } from "react";

type Props = {
  onStart: (name: string) => void;
};

export function WelcomeCard({ onStart }: Props) {
  const [name, setName] = useState("");

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;

  
    localStorage.setItem("userName", trimmed);

    onStart(trimmed);
  }

  return (
    <div className = "WelcomeCardContainer">
    <div className="welcome-card">
      <h1>Welcome to Support</h1>
      <p>
        Please tell us your name to start the conversation.
      </p>

      <input
        autoFocus
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
      >
        Start Chat
      </button>
    </div>
    </div>
  );
}
