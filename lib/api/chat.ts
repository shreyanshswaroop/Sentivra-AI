export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
    analysis?: {
      emotionalState: string;
      themes: string[];
      riskLevel: number;
      recommendedApproach: string;
      progressIndicators: string[];
    };
  };
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse {
  message: string;
  response?: string;
  analysis?: {
    emotionalState: string;
    themes: string[];
    riskLevel: number;
    recommendedApproach: string;
    progressIndicators: string[];
  };
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
  };
}

// ============================================================
// BACKEND CONFIG (commented out until backend is ready)
// ============================================================
// const API_BASE =
//   process.env.BACKEND_API_URL ||
//   "https://ai-therapist-agent-backend.onrender.com";

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("token");
//   return {
//     "Content-Type": "application/json",
//     Authorization: token ? `Bearer ${token}` : "",
//   };
// };
// ============================================================

// ============================================================
// MOCK: In-memory session store (remove when backend is ready)
// ============================================================
let mockSessions: ChatSession[] = [];
// ============================================================

export const createChatSession = async (): Promise<string> => {
  // ---- MOCK IMPLEMENTATION ----
  const sessionId = `session-${Date.now()}`;
  const newSession: ChatSession = {
    sessionId,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockSessions = [newSession, ...mockSessions];
  return sessionId;

  // ---- BACKEND IMPLEMENTATION (uncomment when ready) ----
  // try {
  //   const response = await fetch(`${API_BASE}/chat/sessions`, {
  //     method: "POST",
  //     headers: getAuthHeaders(),
  //   });
  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.error || "Failed to create chat session");
  //   }
  //   const data = await response.json();
  //   return data.sessionId;
  // } catch (error) {
  //   console.error("Error creating chat session:", error);
  //   throw error;
  // }
};

export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ApiResponse> => {
  // ---- MOCK IMPLEMENTATION (uses Anthropic API directly) ----
  const session = mockSessions.find((s) => s.sessionId === sessionId);

  const history =
    session?.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })) || [];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system:
        "You are a compassionate AI therapist named Aura. Provide supportive, empathetic responses. Keep responses concise and warm. Never diagnose or prescribe medication. Encourage professional help when the situation is serious.",
      messages: [...history, { role: "user", content: message }],
    }),
  });

  const data = await response.json();
  const replyContent =
    data.content?.[0]?.text ||
    "I'm here to support you. Could you tell me more about what's on your mind?";

  if (session) {
    session.messages.push({ role: "user", content: message, timestamp: new Date() });
    session.messages.push({ role: "assistant", content: replyContent, timestamp: new Date() });
    session.updatedAt = new Date();
  }

  return {
    message: replyContent,
    response: replyContent,
    metadata: { technique: "supportive", goal: "Provide support", progress: [] },
  };

  // ---- BACKEND IMPLEMENTATION (uncomment when ready) ----
  // try {
  //   const response = await fetch(
  //     `${API_BASE}/chat/sessions/${sessionId}/messages`,
  //     {
  //       method: "POST",
  //       headers: getAuthHeaders(),
  //       body: JSON.stringify({ message }),
  //     }
  //   );
  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.error || "Failed to send message");
  //   }
  //   return await response.json();
  // } catch (error) {
  //   console.error("Error sending chat message:", error);
  //   throw error;
  // }
};

export const getChatHistory = async (
  sessionId: string
): Promise<ChatMessage[]> => {
  // ---- MOCK IMPLEMENTATION ----
  const session = mockSessions.find((s) => s.sessionId === sessionId);
  return session?.messages || [];

  // ---- BACKEND IMPLEMENTATION (uncomment when ready) ----
  // try {
  //   const response = await fetch(
  //     `${API_BASE}/chat/sessions/${sessionId}/history`,
  //     { headers: getAuthHeaders() }
  //   );
  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.error || "Failed to fetch chat history");
  //   }
  //   const data = await response.json();
  //   if (!Array.isArray(data)) throw new Error("Invalid chat history format");
  //   return data.map((msg: any) => ({
  //     role: msg.role,
  //     content: msg.content,
  //     timestamp: new Date(msg.timestamp),
  //     metadata: msg.metadata,
  //   }));
  // } catch (error) {
  //   console.error("Error fetching chat history:", error);
  //   throw error;
  // }
};

export const getAllChatSessions = async (): Promise<ChatSession[]> => {
  // ---- MOCK IMPLEMENTATION ----
  return mockSessions;

  // ---- BACKEND IMPLEMENTATION (uncomment when ready) ----
  // try {
  //   const token = localStorage.getItem("token");
  //   if (!token) return [];
  //   const response = await fetch(`${API_BASE}/chat/sessions`, {
  //     headers: getAuthHeaders(),
  //   });
  //   if (!response.ok) {
  //     const error = await response.json();
  //     throw new Error(error.error || "Failed to fetch chat sessions");
  //   }
  //   const data = await response.json();
  //   return data.map((session: any) => {
  //     const createdAt = new Date(session.createdAt || Date.now());
  //     const updatedAt = new Date(session.updatedAt || Date.now());
  //     return {
  //       ...session,
  //       createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
  //       updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
  //       messages: (session.messages || []).map((msg: any) => ({
  //         ...msg,
  //         timestamp: new Date(msg.timestamp || Date.now()),
  //       })),
  //     };
  //   });
  // } catch (error) {
  //   console.error("Error fetching chat sessions:", error);
  //   throw error;
  // }
};