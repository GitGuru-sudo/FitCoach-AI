import type { AppUser, ChatMessage, StatsPayload } from "@/types";

export const ACTIVITY_OPTIONS = ["Running", "Yoga", "Cycling", "Gym", "Swimming"] as const;

export type ActivityOption = (typeof ACTIVITY_OPTIONS)[number];
export type DashboardTab = "dashboard" | "workouts" | "ai-chat" | "rank";
export type WorkoutFilter = "All" | ActivityOption;

export const QUICK_CHAT_ACTIONS = [
  "Start Workout",
  "Adjust Intensity",
  "Recovery Tip",
] as const;

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const formatTime = (value?: string) => {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatPoints = (value: number) => new Intl.NumberFormat().format(value);

export const buildInsight = (stats: StatsPayload["stats"]) => {
  if (stats.totalWorkouts === 0) {
    return "You have a clean slate. Log one workout today to activate your streak, points, and badge system.";
  }

  if ((stats.lastWorkoutGap ?? 0) > 2) {
    return `Your biggest unlock is consistency right now. A quick ${stats.mostFrequentActivity.toLowerCase()} session today closes that ${stats.lastWorkoutGap}-day gap.`;
  }

  return `${stats.mostFrequentActivity} is your anchor activity. Use it as your reliable fallback whenever motivation dips.`;
};

export const getCaloriesEstimate = (totalWorkoutMinutes: number) =>
  Math.max(0, Math.round(totalWorkoutMinutes * 8.4));

export const getRankingTeaser = (rank: number) => {
  if (rank <= 3) {
    return "Top 1% this week";
  }

  if (rank <= 10) {
    return "Top 5% this week";
  }

  if (rank <= 25) {
    return "Top 10% this week";
  }

  return "Climbing the board";
};

export const getLeagueName = (user: AppUser) => {
  if (user.badges.length > 0) {
    return user.badges[0];
  }

  if (user.points >= 1500) {
    return "Emerald";
  }

  if (user.points >= 900) {
    return "Gold";
  }

  if (user.points >= 450) {
    return "Silver";
  }

  return "Rookie";
};

export const isCurrentUserMessage = (message: ChatMessage) => message.role === "user";
