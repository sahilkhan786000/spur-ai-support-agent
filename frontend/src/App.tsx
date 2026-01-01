import { useState } from "react";
import { ChatWindow } from "./components/ChatWindow";
import { WelcomeCard } from "./components/WelcomeCard";
import "./styles/theme.css";

export default function App() {
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("userName")
  );

  function handleStart(name: string) {
    localStorage.setItem("userName", name);
    setUserName(name);
  }

  return (
    <div className="app">
      {!userName ? (
        <WelcomeCard onStart={handleStart} />
      ) : (
        <ChatWindow />
      )}
    </div>
  );
}
