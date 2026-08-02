import { useState } from "react";

type Props = {
  onStart: (name: string) => void;
};

export function WelcomeCard({ onStart }: Props) {
  const [name, setName] = useState("");

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;

    onStart(trimmed);
  }

  return (
    <div className="welcome-card">
      <div className="brand-badge">LumenCare AI</div>
      <h1>Premium support, beautifully simple.</h1>
      <p>
        Tell us your name and we'll connect you with a calm, intelligent support experience that feels native to any product.
      </p>

      <label className="field-label" htmlFor="customer-name">
        Your name
      </label>
      <input
        id="customer-name"
        autoFocus
        placeholder="Alex Morgan"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />

      <button onClick={handleSubmit} disabled={!name.trim()}>
        Start conversation
      </button>
    </div>
  );
}
