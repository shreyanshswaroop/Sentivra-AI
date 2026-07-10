"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  X,
  Trophy,
  Star,
  Clock,
  Smile,
  PlusCircle,
  MessageSquare,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BreathingGame } from "@/components/games/breathing-game";
import { ZenGarden } from "@/components/games/zen-garden";
import { ForestGame } from "@/components/games/forest-game";
import { OceanWaves } from "@/components/games/ocean-waves";
import { Badge } from "@/components/ui/badge";
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  ChatMessage,
  getAllChatSessions,
  ChatSession,
} from "@/lib/api/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface SuggestedQuestion {
  id: string;
  text: string;
}

interface StressPrompt {
  trigger: string;
  activity: {
    type: "breathing" | "garden" | "forest" | "waves";
    title: string;
    description: string;
  };
}

interface ApiResponse {
  message: string;
  metadata: {
    technique: string;
    goal: string;
    progress: any[];
  };
}

const SUGGESTED_QUESTIONS = [
  { text: "How can I manage my anxiety better?" },
  { text: "I've been feeling overwhelmed lately" },
  { text: "Can we talk about improving sleep?" },
  { text: "I need help with work-life balance" },
];

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const COMPLETION_THRESHOLD = 5;

export default function TherapyPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stressPrompt, setStressPrompt] = useState<StressPrompt | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [isChatPaused, setIsChatPaused] = useState(false);
  const [showNFTCelebration, setShowNFTCelebration] = useState(false);
  const [isCompletingSession, setIsCompletingSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(
    params.sessionId as string
  );
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const handleNewSession = async () => {
    try {
      setIsLoading(true);
      const newSessionId = await createChatSession();
      console.log("New session created:", newSessionId);

      // Update sessions list immediately
      const newSession: ChatSession = {
        sessionId: newSessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Update all state in one go
      setSessions((prev) => [newSession, ...prev]);
      setSessionId(newSessionId);
      setMessages([]);

      // Update URL without refresh
      window.history.pushState({}, "", `/therapy/${newSessionId}`);

      // Force a re-render of the chat area
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to create new session:", error);
      setIsLoading(false);
    }
  };

  // Initialize chat session and load history
  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        if (!sessionId || sessionId === "new") {
          console.log("Creating new chat session...");
          const newSessionId = await createChatSession();
          console.log("New session created:", newSessionId);
          setSessionId(newSessionId);
          window.history.pushState({}, "", `/therapy/${newSessionId}`);
        } else {
          console.log("Loading existing chat session:", sessionId);
          try {
            const history = await getChatHistory(sessionId);
            console.log("Loaded chat history:", history);
            if (Array.isArray(history)) {
              const formattedHistory = history.map((msg) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              }));
              console.log("Formatted history:", formattedHistory);
              setMessages(formattedHistory);
            } else {
              console.error("History is not an array:", history);
              setMessages([]);
            }
          } catch (historyError) {
            console.error("Error loading chat history:", historyError);
            setMessages([]);
          }
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        setMessages([
          {
            role: "assistant",
            content:
              "I apologize, but I'm having trouble loading the chat session. Please try refreshing the page.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [sessionId]);

  // Load all chat sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const allSessions = await getAllChatSessions();
        setSessions(allSessions);
      } catch (error) {
        console.error("Failed to load sessions:", error);
      }
    };

    loadSessions();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    const currentMessage = message.trim();
    console.log("Current message:", currentMessage);
    console.log("Session ID:", sessionId);
    console.log("Is typing:", isTyping);
    console.log("Is chat paused:", isChatPaused);

    if (!currentMessage || isTyping || isChatPaused || !sessionId) {
      console.log("Submission blocked:", {
        noMessage: !currentMessage,
        isTyping,
        isChatPaused,
        noSessionId: !sessionId,
      });
      return;
    }

    setMessage("");
    setIsTyping(true);

    try {
      // Add user message
      const userMessage: ChatMessage = {
        role: "user",
        content: currentMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Check for stress signals
      const stressCheck = detectStressSignals(currentMessage);
      if (stressCheck) {
        setStressPrompt(stressCheck);
        setIsTyping(false);
        return;
      }

      console.log("Sending message to API...");
      // Send message to API
      const response = await sendChatMessage(sessionId, currentMessage);
      console.log("Raw API response:", response);

      // Parse the response if it's a string
      const aiResponse =
        typeof response === "string" ? JSON.parse(response) : response;
      console.log("Parsed AI response:", aiResponse);

      // Add AI response with metadata
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          aiResponse.response ||
          aiResponse.message ||
          "I'm here to support you. Could you tell me more about what's on your mind?",
        timestamp: new Date(),
        metadata: {
          analysis: aiResponse.analysis || {
            emotionalState: "neutral",
            riskLevel: 0,
            themes: [],
            recommendedApproach: "supportive",
            progressIndicators: [],
          },
          technique: aiResponse.metadata?.technique || "supportive",
          goal: aiResponse.metadata?.currentGoal || "Provide support",
          progress: aiResponse.metadata?.progress || {
            emotionalState: "neutral",
            riskLevel: 0,
          },
        },
      };

      console.log("Created assistant message:", assistantMessage);

      // Add the message immediately
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      scrollToBottom();
    } catch (error) {
      console.error("Error in chat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const detectStressSignals = (message: string): StressPrompt | null => {
    const stressKeywords = [
      "stress",
      "anxiety",
      "worried",
      "panic",
      "overwhelmed",
      "nervous",
      "tense",
      "pressure",
      "can't cope",
      "exhausted",
    ];

    const lowercaseMsg = message.toLowerCase();
    const foundKeyword = stressKeywords.find((keyword) =>
      lowercaseMsg.includes(keyword)
    );

    if (foundKeyword) {
      const activities = [
        {
          type: "breathing" as const,
          title: "Breathing Exercise",
          description:
            "Follow calming breathing exercises with visual guidance",
        },
        {
          type: "garden" as const,
          title: "Zen Garden",
          description: "Create and maintain your digital peaceful space",
        },
        {
          type: "forest" as const,
          title: "Mindful Forest",
          description: "Take a peaceful walk through a virtual forest",
        },
        {
          type: "waves" as const,
          title: "Ocean Waves",
          description: "Match your breath with gentle ocean waves",
        },
      ];

      return {
        trigger: foundKeyword,
        activity: activities[Math.floor(Math.random() * activities.length)],
      };
    }

    return null;
  };

  const handleSuggestedQuestion = async (text: string) => {
    if (!sessionId) {
      const newSessionId = await createChatSession();
      setSessionId(newSessionId);
      router.push(`/therapy/${newSessionId}`);
    }

    setMessage(text);
    setTimeout(() => {
      const event = new Event("submit") as unknown as React.FormEvent;
      handleSubmit(event);
    }, 0);
  };

  const handleCompleteSession = async () => {
    if (isCompletingSession) return;
    setIsCompletingSession(true);
    try {
      setShowNFTCelebration(true);
    } catch (error) {
      console.error("Error completing session:", error);
    } finally {
      setIsCompletingSession(false);
    }
  };

  const handleSessionSelect = async (selectedSessionId: string) => {
    if (selectedSessionId === sessionId) return;

    try {
      setIsLoading(true);
      const history = await getChatHistory(selectedSessionId);
      if (Array.isArray(history)) {
        const formattedHistory = history.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedHistory);
        setSessionId(selectedSessionId);
        window.history.pushState({}, "", `/therapy/${selectedSessionId}`);
      }
    } catch (error) {
      console.error("Failed to load session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const activeSession = sessions.find(
    (session) => session.sessionId === sessionId
  );
  const activeSessionTitle =
    activeSession?.messages[0]?.content?.slice(0, 48) || "Reflection session";
  const lastSessionUpdate = activeSession?.updatedAt
    ? (() => {
        try {
          const date = new Date(activeSession.updatedAt);
          return isNaN(date.getTime())
            ? "Live now"
            : formatDistanceToNow(date, { addSuffix: true });
        } catch (error) {
          return "Live now";
        }
      })()
    : "Live now";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fffaf0_0%,#f7f3ea_100%)] px-3 pb-4 pt-20 dark:bg-[linear-gradient(180deg,#070706_0%,#11110f_100%)] sm:px-5">
      <div className="relative mx-auto flex h-[calc(100vh-6rem)] max-w-7xl gap-4 lg:gap-5">
        {/* Sidebar with chat history */}
        <aside className="hidden w-[315px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.60] bg-white/[0.35] shadow-[0_18px_60px_rgba(31,29,24,0.12),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-[28px] dark:border-white/[0.08] dark:bg-[#0f100f] dark:shadow-[0_18px_60px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.06)] lg:flex">
          <div className="border-b border-white/[0.45] bg-white/20 p-5 dark:border-white/[0.06] dark:bg-transparent">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Air sessions
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-normal">
                  Chat Sessions
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNewSession}
                className="h-9 w-9 rounded-full border border-white/[0.70] bg-white/[0.45] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl hover:bg-primary hover:text-primary-foreground dark:border-white/[0.10] dark:bg-white/[0.05] dark:hover:bg-white/[0.10]"
                disabled={isLoading}
                aria-label="Create session"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              className="h-11 w-full justify-start gap-2 rounded-xl bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 dark:border dark:border-white/[0.10] dark:bg-[#181917] dark:text-foreground dark:hover:bg-[#20211f]"
              onClick={handleNewSession}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              New Session
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-2 p-3">
              {sessions.map((session) => (
                <button
                  key={session.sessionId}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-2xl transition-all",
                    session.sessionId === sessionId
                      ? "border-white/[0.70] bg-white/[0.42] shadow-[0_10px_30px_rgba(31,29,24,0.10),inset_0_1px_0_rgba(255,255,255,0.78)] dark:border-white/[0.14] dark:bg-[#20211f] dark:shadow-[0_10px_30px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "border-white/20 bg-white/[0.12] hover:border-white/[0.60] hover:bg-white/[0.35] dark:border-white/[0.06] dark:bg-[#171816] dark:hover:border-white/[0.12] dark:hover:bg-[#20211f]"
                  )}
                  onClick={() => handleSessionSelect(session.sessionId)}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.55] text-foreground shadow-sm ring-1 ring-white/[0.70] backdrop-blur-xl dark:bg-black/30 dark:ring-white/[0.10]">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <span className="truncate font-medium">
                      {session.messages[0]?.content.slice(0, 30) || "New Chat"}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-muted-foreground">
                    {session.messages[session.messages.length - 1]?.content ||
                      "No messages yet"}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>
                      {session.messages.length} messages
                    </span>
                    <span className="truncate">
                      {(() => {
                        try {
                          const date = new Date(session.updatedAt);
                          if (isNaN(date.getTime())) {
                            return "Just now";
                          }
                          return formatDistanceToNow(date, {
                            addSuffix: true,
                          });
                        } catch (error) {
                          return "Just now";
                        }
                      })()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Main chat area */}
        <main className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.65] bg-white/[0.50] shadow-[0_18px_60px_rgba(31,29,24,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-[28px] dark:border-white/[0.08] dark:bg-[#11120f] dark:shadow-[0_18px_60px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.06)]">
          {/* Chat header */}
          <div className="px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1f3d3a] text-white shadow-sm">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-background" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-base font-semibold tracking-normal sm:text-lg">
                      AI Therapist
                    </h2>
                    <Badge className="rounded-full bg-[#e9f5ef] text-[#245447] hover:bg-[#e9f5ef] dark:bg-[#163c35] dark:text-[#d9fff3] dark:hover:bg-[#163c35]">
                      <Wifi className="mr-1 h-3 w-3" />
                      On air
                    </Badge>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {activeSessionTitle} • {messages.length} messages •{" "}
                    {lastSessionUpdate}
                  </p>
                </div>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-white/[0.70] bg-white/[0.36] px-3 py-2 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl dark:border-white/[0.10] dark:bg-black/25 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] md:flex">
                <ShieldCheck className="h-4 w-4 text-[#245447]" />
                Private session
              </div>
            </div>
          </div>

          {messages.length === 0 ? (
            // Welcome screen with suggested questions
            <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6">
              <div className="mx-auto flex min-h-full max-w-3xl flex-col justify-center space-y-8">
                <div className="space-y-4 text-center">
                  <div className="relative inline-flex flex-col items-center">
                    <div className="relative mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#1f3d3a] text-white shadow-sm">
                      <Sparkles className="h-6 w-6" />
                      <motion.div
                        className="absolute inset-0 rounded-full ring-8 ring-[#a4d4c5]/25"
                        initial="initial"
                        animate="animate"
                        variants={glowAnimation}
                      />
                    </div>
                    <h1 className="text-3xl font-semibold tracking-normal sm:text-4xl">
                      Start a calmer conversation.
                    </h1>
                    <p className="mt-2 text-base text-muted-foreground">
                      Pick a prompt or write what is present for you right now.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((q, index) => (
                    <motion.div
                      key={q.text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <Button
                        variant="outline"
                        className="h-auto min-h-20 w-full justify-start rounded-xl border-black/10 bg-white px-5 py-4 text-left text-sm leading-relaxed hover:border-[#245447]/30 hover:bg-[#f6fbf8] dark:border-white/[0.08] dark:bg-[#1a1b18] dark:text-foreground dark:hover:border-white/[0.16] dark:hover:bg-[#20211f]"
                        onClick={() => handleSuggestedQuestion(q.text)}
                      >
                        {q.text}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Chat messages
            <div className="flex-1 overflow-y-auto scroll-smooth px-4 py-6 sm:px-6">
              <div className="mx-auto max-w-4xl space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.timestamp.toISOString()}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex gap-3",
                        msg.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.role === "assistant" && (
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f3d3a] text-white shadow-sm">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "min-w-0 max-w-[86%] rounded-2xl border px-4 py-3 shadow-sm sm:max-w-[72%]",
                          msg.role === "assistant"
                            ? "rounded-tl-md border-black/10 bg-white text-foreground dark:border-white/[0.08] dark:bg-[#1a1b18]"
                            : "rounded-tr-md border-[#1f3d3a] bg-[#1f3d3a] text-white"
                        )}
                      >
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              msg.role === "user" && "text-white"
                            )}
                          >
                              {msg.role === "assistant"
                                ? "AI Therapist"
                                : "You"}
                          </p>
                          {msg.metadata?.technique && (
                            <Badge
                              variant="secondary"
                              className="rounded-full text-xs"
                            >
                                {msg.metadata.technique}
                            </Badge>
                          )}
                        </div>
                        <div
                          className={cn(
                            "prose prose-sm max-w-none leading-relaxed dark:prose-invert",
                            msg.role === "user" &&
                              "prose-p:text-white prose-strong:text-white"
                          )}
                        >
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                        {msg.metadata?.goal && (
                          <p className="mt-3 border-t border-black/10 pt-2 text-xs text-muted-foreground">
                            Goal: {msg.metadata.goal}
                          </p>
                        )}
                      </div>
                      {msg.role === "user" && (
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffb084] text-[#1f1b16] shadow-sm">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f3d3a] text-white shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                    <div className="rounded-2xl rounded-tl-md border border-black/10 bg-white px-4 py-3 shadow-sm dark:border-white/[0.08] dark:bg-[#1a1b18]">
                      <p className="text-sm font-semibold">AI Therapist</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-3 sm:p-4">
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border border-white/[0.70] bg-white/[0.42] p-2 shadow-[0_12px_36px_rgba(31,29,24,0.10),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl transition-all focus-within:border-[#245447]/35 focus-within:ring-4 focus-within:ring-[#a4d4c5]/20 dark:border-white/[0.10] dark:bg-[#070807] dark:shadow-[0_12px_36px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <div className="relative flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isChatPaused
                      ? "Complete the activity to continue..."
                      : "Ask me anything..."
                  }
                  className={cn(
                    "max-h-[180px] min-h-[48px] w-full resize-none border-0 bg-transparent p-3 pr-2 text-base leading-relaxed",
                    "focus:outline-none focus:ring-0",
                    "placeholder:text-muted-foreground/70",
                    (isTyping || isChatPaused) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                  rows={1}
                  disabled={isTyping || isChatPaused}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className={cn(
                  "mb-1 h-10 w-10 shrink-0 rounded-full bg-[#1f3d3a] text-white shadow-sm transition-all hover:bg-[#28524e]",
                  (isTyping || isChatPaused || !message.trim()) &&
                    "cursor-not-allowed opacity-45"
                )}
                disabled={isTyping || isChatPaused || !message.trim()}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-2 hidden text-center text-xs text-muted-foreground sm:block">
              Press <kbd className="rounded bg-muted px-2 py-0.5">Enter</kbd>{" "}
              to send,{" "}
              <kbd className="ml-1 rounded bg-muted px-2 py-0.5">
                Shift + Enter
              </kbd>{" "}
              for new line
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
