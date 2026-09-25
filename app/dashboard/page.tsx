"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronRight,
  Heart,
  MessageCircle,
  PenLine,
  Send,
  Sparkles,
  Sprout,
  Sun,
  TreePine,
  Waves,
  Wind,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { ActivityLogger } from "@/components/activities/activity-logger";
import { BreathingGame } from "@/components/games/breathing-game";
import { ForestGame } from "@/components/games/forest-game";
import { OceanWaves } from "@/components/games/ocean-waves";
import { ZenGarden } from "@/components/games/zen-garden";
import { MoodForm } from "@/components/mood/mood-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getAllChatSessions, type ChatSession } from "@/lib/api/chat";
import { trackMood } from "@/lib/api/mood";
import { useSession } from "@/lib/contexts/session-context";
import { cn } from "@/lib/utils";

interface Activity {
  id?: string;
  _id?: string;
  userId: string | null;
  type: string;
  name: string;
  description: string | null;
  timestamp: Date;
  duration: number | null;
  completed: boolean;
  moodScore: number | null;
  moodNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const navigation = [
  { label: "Dashboard", target: "dashboard" },
  { label: "Therapy", target: "therapy" },
  { label: "Journal", target: "journal" },
  { label: "Activities", target: "activities" },
  { label: "Insights", target: "insights" },
];

const moods = [
  { emoji: "😊", label: "Great", score: 90 },
  { emoji: "🙂", label: "Good", score: 74 },
  { emoji: "😐", label: "Okay", score: 56 },
  { emoji: "😟", label: "Anxious", score: 36 },
  { emoji: "😔", label: "Low", score: 22 },
];

const wellnessActivities = [
  {
    id: "breathing",
    title: "Breathing Practice",
    description: "Follow a guided breathing rhythm.",
    duration: "5 min",
    icon: Wind,
    tone: "bg-[#EAF0F6] text-[#31546B]",
  },
  {
    id: "forest",
    title: "Soothing Sounds",
    description: "Layer calm nature sounds with a timer.",
    duration: "5 min",
    icon: TreePine,
    tone: "bg-[#EAF3EC] text-[#23463D]",
  },
  {
    id: "waves",
    title: "Ocean Waves",
    description: "Match your breath with ambient waves.",
    duration: "5 min",
    icon: Waves,
    tone: "bg-[#EEF3F7] text-[#31546B]",
  },
  {
    id: "garden",
    title: "Zen Garden",
    description: "Create a quiet visual grounding space.",
    duration: "Open",
    icon: Sprout,
    tone: "bg-[#F4E7DA] text-[#72543D]",
  },
];

const cardClass =
  "rounded-[24px] border border-[#ECE7DE] bg-white shadow-[0_24px_70px_rgba(47,43,35,0.08)]";

const getDate = (value: Date | string | number | undefined) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getActivityKey = (activity: Activity, index: number) =>
  activity.id ||
  activity._id ||
  `${activity.type}-${activity.name}-${getDate(activity.timestamp).getTime()}-${index}`;

const getMoodLabel = (score: number | null) => {
  if (score === null) return null;
  if (score >= 80) return "Great";
  if (score >= 65) return "Good";
  if (score >= 45) return "Okay";
  if (score >= 25) return "Anxious";
  return "Low";
};

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useSession();
  const [mounted, setMounted] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showActivityLogger, setShowActivityLogger] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedWellnessActivity, setSelectedWellnessActivity] = useState<
    string | null
  >(null);
  const [assistantText, setAssistantText] = useState("");

  const firstName = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const moodEntries = activities.filter((activity) => activity.moodScore !== null);
  const latestMood = moodEntries[0]?.moodScore ?? null;
  const latestMoodLabel = getMoodLabel(latestMood);
  const completedActivities = activities.filter((activity) => activity.completed);
  const latestSession = sessions[0];
  const latestActivity = activities[0];
  const journeyItems = activities.slice(0, 5);
  const activityRecommendations = activities
    .filter((activity) => activity.type !== "mood")
    .slice(0, 4);
  const sessionRows = sessions.slice(0, 3);
  const selectedWellnessActivityDetails = wellnessActivities.find(
    (activity) => activity.id === selectedWellnessActivity
  );

  const loadActivities = useCallback(async () => {
    if (!isAuthenticated) {
      setActivities([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setActivities([]);
        return;
      }

      const response = await fetch("/api/activities/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setActivities([]);
        return;
      }

      const data = await response.json();
      setActivities(
        Array.isArray(data)
          ? data
              .map((activity) => ({
                ...activity,
                timestamp: getDate(activity.timestamp),
                createdAt: getDate(activity.createdAt),
                updatedAt: getDate(activity.updatedAt),
              }))
              .sort(
                (a, b) =>
                  getDate(b.timestamp).getTime() - getDate(a.timestamp).getTime()
              )
          : []
      );
    } catch (error) {
      console.error("Error loading activities:", error);
      setActivities([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setMounted(true);
    loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSessions([]);
      return;
    }

    getAllChatSessions()
      .then((chatSessions) =>
        setSessions(
          [...chatSessions].sort(
            (a, b) =>
              getDate(b.updatedAt).getTime() - getDate(a.updatedAt).getTime()
          )
        )
      )
      .catch((error) => console.error("Error loading therapy sessions:", error));
  }, [isAuthenticated]);

  const handleStartTherapy = () => {
    router.push("/therapy/new");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSidebarNav = (target: string) => {
    if (target === "therapy") {
      handleStartTherapy();
      return;
    }

    if (target === "journal") {
      setShowActivityLogger(true);
      return;
    }

    scrollToSection(target);
  };

  const handleMoodSelect = async (label: string, score: number) => {
    if (!isAuthenticated) {
      setShowMoodModal(true);
      return;
    }

    setSelectedMood(label);
    try {
      await trackMood({
        score,
        note: label,
      });
      loadActivities();
    } catch (error) {
      console.error("Error saving mood:", error);
      setShowMoodModal(true);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F6F2]">
        <div className="h-9 w-9 rounded-full border-2 border-[#D8D0C4] border-t-[#23463D] animate-spin" />
      </div>
    );
  }

  return (
    <div id="dashboard" className="min-h-screen scroll-mt-24 bg-[#F8F6F2] text-[#20231F]">
      <div className="mx-auto flex w-full max-w-[1480px] gap-6 px-4 pb-4 pt-24 sm:px-6 lg:px-8">
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-[260px] shrink-0 flex-col rounded-[28px] border border-[#ECE7DE] bg-white/80 p-5 shadow-[0_24px_70px_rgba(47,43,35,0.07)] backdrop-blur-xl lg:flex">
          <div className="mb-10">
            <div className="text-2xl font-semibold tracking-normal text-[#23463D]">
              Sentivra
            </div>
            <p className="mt-1 max-w-[180px] text-sm leading-5 text-[#6E6A62]">
              Your AI Mental Wellness Companion
            </p>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSidebarNav(item.target)}
                className={cn(
                  "flex h-11 w-full items-center justify-between rounded-2xl px-4 text-left text-sm font-medium text-[#615D55] transition",
                  item.target === "dashboard"
                    ? "bg-[#23463D] text-white shadow-[0_12px_24px_rgba(35,70,61,0.18)]"
                    : "hover:bg-[#F5F1EA]"
                )}
              >
                {item.label}
                {item.target === "dashboard" && <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </nav>

          <div className="mt-auto rounded-[22px] bg-[#F3EFE7] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#23463D]">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-[#20231F]">
              {isAuthenticated
                ? `${completedActivities.length} of ${activities.length} activities complete today.`
                : "Sign in to personalize your plan."}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#777168]">
              {isAuthenticated
                ? "This card updates from your logged activity."
                : "No account data is shown while signed out."}
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-24">
          <section className="mb-6 grid scroll-mt-24 items-stretch gap-6 xl:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(cardClass, "relative h-full min-h-[360px] overflow-hidden p-6 sm:p-8")}
            >
              <div className="pointer-events-none absolute right-8 top-8 h-28 w-28 rounded-full bg-[#EAF3EC]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-44 rounded-tl-full bg-[#F4E7DA]" />

              <div className="relative">
                <p className="mb-2 text-sm text-[#7A746B]">
                  {format(new Date(), "EEEE, MMMM d")}
                </p>
                <h1 className="max-w-[760px] text-3xl font-semibold leading-tight tracking-normal text-[#20231F] sm:text-4xl 2xl:text-[44px]">
                  {greeting}, {firstName}{" "}
                  <span className="inline-block align-baseline">👋</span>
                </h1>
                <p className="mt-3 text-lg text-[#6E6A62]">
                  How are you feeling today?
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      onClick={() => handleMoodSelect(mood.label, mood.score)}
                      className={cn(
                        "h-[92px] rounded-[22px] border bg-white px-3 text-center shadow-[0_12px_30px_rgba(47,43,35,0.06)] transition hover:-translate-y-0.5",
                        selectedMood === mood.label
                          ? "border-[#23463D] ring-2 ring-[#23463D]/10"
                          : "border-[#EEE8DE]"
                      )}
                    >
                      <div className="text-2xl">{mood.emoji}</div>
                      <div className="mt-2 text-sm font-medium text-[#2B2C29]">
                        {mood.label}
                      </div>
                    </button>
                  ))}
                </div>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-[#7A746B]">
                  {isAuthenticated
                    ? "Your mood check-in is saved to your account."
                    : "Sign in to save mood check-ins to your account."}
                </p>
              </div>
            </motion.div>

            <motion.div
              id="insights"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className={cn(
                cardClass,
                "flex h-full min-h-[360px] flex-col bg-[#23463D] p-6 text-white shadow-[0_28px_70px_rgba(35,70,61,0.22)] sm:p-8"
              )}
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/12">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-white/12 px-3 py-1 text-xs text-white/80">
                  AI Insight
                </span>
              </div>
              <p className="text-2xl font-medium leading-snug tracking-normal">
                {!isAuthenticated
                  ? "Sign in to see insights based on your actual check-ins and sessions."
                  : latestMoodLabel
                  ? `Your latest mood check-in is ${latestMoodLabel.toLowerCase()}.`
                  : latestActivity
                  ? `Your latest activity is ${latestActivity.name}.`
                  : "Log a mood or activity to generate a real insight here."}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/74">
                {isAuthenticated && activities.length > 0
                  ? `${completedActivities.length} of ${activities.length} activities are complete today.`
                  : "Sentivra will only summarize what you actually record."}
              </p>
              <Button
                onClick={handleStartTherapy}
                className="mt-auto h-12 w-fit rounded-full bg-white px-5 text-[#23463D] shadow-none hover:bg-[#F4F1EA]"
              >
                Start Guided Session
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </section>

          <section className="mb-6 grid scroll-mt-24 items-stretch gap-6 xl:grid-cols-2">
            <div id="therapy" className={cn(cardClass, "flex h-full min-h-[360px] scroll-mt-24 flex-col p-6 sm:p-8")}>
              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-medium text-[#23463D]">
                    Continue Therapy
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-normal text-[#20231F]">
                    {latestSession ? "Recent Therapy Session" : "No therapy session yet"}
                  </h2>
                  <p className="mt-1 text-sm text-[#7A746B]">
                    {latestSession
                      ? `${format(getDate(latestSession.updatedAt), "MMM d")} • ${
                          latestSession.messages.length
                        } messages`
                      : isAuthenticated
                      ? "Start your first conversation when you're ready."
                      : "Sign in to continue or start therapy."}
                  </p>
                </div>
                {latestSession && (
                  <span className="w-fit rounded-full bg-[#F3EFE7] px-4 py-2 text-sm text-[#615D55]">
                    Updated {format(getDate(latestSession.updatedAt), "h:mm a")}
                  </span>
                )}
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[#5D5A52]">
                {latestSession
                  ? "Your latest conversation is available to continue."
                  : "Your therapy summary will appear here after you create a session."}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                <Button
                  onClick={handleStartTherapy}
                  className="h-12 rounded-full bg-[#23463D] px-6 text-white hover:bg-[#2D574C]"
                >
                  Continue Session
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowActivityLogger(true)}
                  className="h-12 rounded-full border-[#DED8CE] bg-white px-6 text-[#23463D] hover:bg-[#F7F3ED]"
                >
                  Add a reflection
                  <PenLine className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className={cn(cardClass, "flex h-full min-h-[360px] flex-col p-6 sm:p-8")}>
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#23463D]">
                    Today&apos;s Journey
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                    A steady rhythm
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3EC] text-[#23463D]">
                  <Sun className="h-5 w-5" />
                </div>
              </div>
              {journeyItems.length > 0 ? (
                <div className="space-y-1">
                  {journeyItems.map((activity, index) => (
                    <div key={getActivityKey(activity, index)} className="grid grid-cols-[28px_1fr] gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full border",
                            activity.completed
                              ? "border-[#23463D] bg-[#23463D] text-white"
                              : "border-[#D8D0C4] bg-white text-transparent"
                          )}
                        >
                          {activity.completed && <Check className="h-4 w-4" />}
                        </div>
                        {index !== journeyItems.length - 1 && (
                          <div className="h-8 w-px bg-[#E2DCD2]" />
                        )}
                      </div>
                      <button
                        onClick={() => setShowActivityLogger(true)}
                        className="pb-5 text-left"
                      >
                        <div className="text-sm font-medium text-[#20231F]">
                          {activity.name}
                        </div>
                        <div className="mt-1 text-xs text-[#8B8479]">
                          {format(getDate(activity.timestamp), "h:mm a")}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[22px] bg-[#FBFAF7] p-5 text-sm leading-6 text-[#746E65]">
                  {isAuthenticated
                    ? "No activities logged today yet."
                    : "Sign in to see today's journey."}
                </div>
              )}
            </div>
          </section>

          <section id="activities" className="mb-6 grid scroll-mt-24 items-stretch gap-6 xl:grid-cols-[1fr_1fr]">
            <div className={cn(cardClass, "flex h-full min-h-[360px] flex-col overflow-hidden p-6 sm:p-8")}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#23463D]">
                    Wellness Activities
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                    Choose a calming tool
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowActivityLogger(true)}
                  className="rounded-full text-[#23463D] hover:bg-[#F1EDE6]"
                >
                  Log activity
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {wellnessActivities.map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => setSelectedWellnessActivity(activity.id)}
                    className="rounded-[22px] border border-[#EEE8DE] bg-[#FBFAF7] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <div
                      className={cn(
                        "mb-4 flex h-11 w-11 items-center justify-center rounded-full",
                        activity.tone
                      )}
                    >
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold tracking-normal text-[#20231F]">
                      {activity.title}
                    </h3>
                    <p className="mt-1 min-h-[40px] text-sm leading-5 text-[#746E65]">
                      {activity.description}
                    </p>
                    <p className="mt-3 text-xs text-[#8B8479]">
                      {activity.duration}
                    </p>
                  </button>
                ))}
              </div>
              {activityRecommendations.length > 0 && (
                <div className="mt-5 rounded-[22px] bg-[#FBFAF7] p-4 text-sm text-[#746E65]">
                  {activityRecommendations.length} logged activity
                  {activityRecommendations.length === 1 ? "" : "ies"} today.
                </div>
              )}
            </div>

            <div className={cn(cardClass, "flex h-full min-h-[360px] flex-col p-6 sm:p-8")}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#23463D]">
                    Recent Sessions
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                    Conversations you can return to
                  </h2>
                </div>
                {sessions.length > 0 && (
                  <span className="rounded-full bg-[#F3EFE7] px-3 py-1 text-xs text-[#736C61]">
                    {sessions.length} total
                  </span>
                )}
              </div>
              {sessionRows.length > 0 ? (
                <div className="space-y-3">
                  {sessionRows.map((session) => (
                    <button
                      key={session.sessionId}
                      onClick={handleStartTherapy}
                      className="w-full rounded-[22px] border border-[#EEE8DE] bg-[#FBFAF7] p-5 text-left transition hover:bg-white"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold tracking-normal">
                            Therapy session
                          </h3>
                          <p className="mt-1 text-sm text-[#8B8479]">
                            {format(getDate(session.updatedAt), "MMM d, h:mm a")}
                          </p>
                        </div>
                        <span className="text-sm text-[#6E6A62]">
                          {session.messages.length} messages
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[22px] bg-[#FBFAF7] p-5 text-sm leading-6 text-[#746E65]">
                  {isAuthenticated
                    ? "No therapy conversations yet."
                    : "Sign in to see your recent sessions."}
                </div>
              )}
            </div>
          </section>

        </main>
      </div>

      <button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-[#23463D] text-white shadow-[0_18px_44px_rgba(35,70,61,0.32)] transition hover:scale-105"
        aria-label="Open AI companion"
      >
        <Bot className="h-7 w-7" />
      </button>

      {showAssistant && (
        <div className="fixed inset-0 z-50 bg-[#20231F]/20 backdrop-blur-sm">
          <div className="fixed bottom-5 right-5 flex h-[620px] max-h-[calc(100vh-2.5rem)] w-[calc(100vw-2.5rem)] max-w-[430px] flex-col overflow-hidden rounded-[28px] border border-[#ECE7DE] bg-white shadow-[0_28px_90px_rgba(32,35,31,0.22)]">
            <div className="flex items-center justify-between border-b border-[#EFEAE2] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3EC] text-[#23463D]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold tracking-normal text-[#20231F]">
                    Sentivra AI
                  </h3>
                  <p className="text-xs text-[#827A70]">Here with you now</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAssistant(false)}
                className="rounded-full hover:bg-[#F3EFE7]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-[#FBFAF7] p-5">
              <div className="max-w-[85%] rounded-[22px] bg-white p-4 text-sm leading-6 text-[#57534C] shadow-sm">
                What&apos;s on your mind today?
              </div>
            </div>
            <div className="border-t border-[#EFEAE2] bg-white p-4">
              <div className="flex items-end gap-3 rounded-[22px] border border-[#E4DED4] bg-[#FBFAF7] p-2">
                <Textarea
                  value={assistantText}
                  onChange={(event) => setAssistantText(event.target.value)}
                  placeholder="What's on your mind today?"
                  className="min-h-[54px] resize-none border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
                />
                <Button
                  size="icon"
                  className="mb-1 h-10 w-10 rounded-full bg-[#23463D] text-white hover:bg-[#2D574C]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
        <DialogContent className="rounded-[24px] border-[#ECE7DE] bg-[#F8F6F2] sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="tracking-normal">
              How are you feeling?
            </DialogTitle>
            <DialogDescription>
              Move the slider to track your current mood.
            </DialogDescription>
          </DialogHeader>
          <MoodForm onSuccess={() => setShowMoodModal(false)} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={selectedWellnessActivity !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedWellnessActivity(null);
        }}
      >
        <DialogContent className="rounded-[24px] border-[#ECE7DE] bg-white sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="tracking-normal">
              {selectedWellnessActivityDetails?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedWellnessActivityDetails?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedWellnessActivity === "breathing" && <BreathingGame />}
          {selectedWellnessActivity === "forest" && <ForestGame />}
          {selectedWellnessActivity === "waves" && <OceanWaves />}
          {selectedWellnessActivity === "garden" && <ZenGarden />}
        </DialogContent>
      </Dialog>

      <ActivityLogger
        open={showActivityLogger}
        onOpenChange={setShowActivityLogger}
        onActivityLogged={loadActivities}
      />
    </div>
  );
}
