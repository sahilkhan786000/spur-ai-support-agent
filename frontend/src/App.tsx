import { useState, useEffect } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { WelcomeCard } from "./components/WelcomeCard";
import "./styles/theme.css";

export default function App() {
  const [userName, setUserName] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userName");
  });
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      try {
        const data = e.data;
        if (!data || data.type !== "init") return;
        if (data.userName) {
          localStorage.setItem("userName", data.userName);
          setUserName(data.userName);
        }
        if (data.open === true) setIsOpen(true);
        if (data.open === false) setIsOpen(false);
      } catch (err) {
        // ignore malformed messages
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  function handleStart(name: string) {
    localStorage.setItem("userName", name);
    setUserName(name);
  }

  return (
    <div className="app-shell">
      <button className="floating-launcher" onClick={() => setIsOpen((prev) => !prev)}>
        <span className="launcher-icon">?</span>
        <span>{isOpen ? "Close help" : "Need help?"}</span>
      </button>

      {isOpen && (
        <div className="support-popup">
          {!userName ? (
            <WelcomeCard onStart={handleStart} />
          ) : (
            <ChatWindow />
          )}
        </div>
      )}
    </div>
  );
}
