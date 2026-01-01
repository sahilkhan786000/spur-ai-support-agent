const API_BASE = "http://localhost:8000";

type SendMessageResponse = {
  reply: string;
  sessionId: string;
};

type HistoryResponse = {
  messages: {
    sender: "user" | "ai";
    text: string;
  }[];
};

type SessionsResponse = {
  sessions: {
    id: string;
    lastMessage: string;
    updatedAt: string;
  }[];
};



export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<SendMessageResponse> {
  const body = sessionId ? { message, sessionId } : { message };

  const res = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}



export async function fetchHistory(
  sessionId: string
): Promise<HistoryResponse> {
  const res = await fetch(
    `${API_BASE}/chat/history?sessionId=${sessionId}`
  );

  if (!res.ok) {
    throw new Error("Failed to load chat history");
  }

  return res.json();
}


export async function fetchSessions(): Promise<SessionsResponse> {
  const res = await fetch(`${API_BASE}/chat/sessions`);

  if (!res.ok) {
    throw new Error("Failed to load sessions");
  }

  return res.json();
}
