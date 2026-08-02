import { useEffect, useState } from "react";
import { fetchSessions } from "../services/chatApi";

type Session = {
  id: string;
  lastMessage: string;
  updatedAt: string;
};

type Props = {
  onClose?: () => void;
};

export function SessionHistory({ onClose }: Props) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions()
      .then((res) => {
        setSessions(res.sessions);
      })
      .finally(() => setLoading(false));
  }, []);

  function openSession(id: string) {
    localStorage.setItem("sessionId", id);
    onClose?.();
    window.location.reload();
  }

  return (
    <div className="session-panel">
      <div className="session-header">
        <h3>Recent conversations</h3>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      {loading && <div className="session-empty subtle">Loading conversations...</div>}

      {!loading && sessions.length === 0 && <div className="session-empty subtle">No previous conversations</div>}

      {!loading &&
        sessions.map((session) => (
          <div key={session.id} className="session-card" onClick={() => openSession(session.id)}>
            <span className="preview">{session.lastMessage}</span>
            <span className="arrow">?</span>
          </div>
        ))}
    </div>
  );
}
