export type CoachTone = "balanced" | "intense" | "calm";

export type DailyMotivation = {
  quote: string;
  date: string;
};

export type AppUser = {
  _id?: string;
  userId: string;
  username: string;
  avatar: string;
  points: number;
  weeklyGoal: number;
  weeklyProgress: number;
  badges: string[];
  coachTone: CoachTone;
  dailyMotivation?: DailyMotivation;
};

export type Workout = {
  _id: string;
  userId: string;
  activityType: "Running" | "Yoga" | "Cycling" | "Gym" | "Swimming";
  duration: number;
  date: string;
  createdAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export type LeaderboardEntry = {
  _id: string;
  username: string;
  avatar: string;
  points: number;
  weeklyGoal: number;
  weeklyProgress: number;
  badges: string[];
};

export type StatsPayload = {
  stats: {
    currentStreak: number;
    workoutsThisWeek: number;
    mostFrequentActivity: string;
    totalWorkoutMinutes: number;
    totalWorkouts: number;
    lastWorkoutGap: number | null;
    lastWorkoutDate: string | null;
    longestGapBetweenWorkouts: number;
    averageGapBetweenWorkouts: number;
    activityFrequency: string[];
    badges: string[];
  };
  user: AppUser;
  leaderboard: LeaderboardEntry[];
  tournament: {
    weekOf: string;
    rank: number;
    challenge: string;
    progress: number;
    goal: number;
  };
};

export type WorkoutsPayload = {
  workouts: Workout[];
  totalPages: number;
  currentPage: number;
  total: number;
};
