import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { getTodayKey } from "../utils/date.js";
import { callOpenRouter } from "../utils/openRouter.js";
import { requireCompletedProfile } from "../utils/profile.js";
import { calculateStats } from "../utils/stats.js";

const buildFallbackMotivation = ({
  streak,
  totalWorkouts,
  activity,
  gap,
  username,
  lastWorkoutDate,
  frequencySummary,
}) => {
  if (totalWorkouts === 0) {
    return `${username}, your first logged workout is the spark. Pick one 20-minute session today and make the board move.`;
  }

  if (gap > 2) {
    return `${username}, your last workout was on ${lastWorkoutDate}. You've logged ${frequencySummary}, so use ${activity.toLowerCase()} to break the ${gap}-day gap today and rebuild rhythm.`;
  }

  return `${username}, you're on a ${streak}-day streak with ${totalWorkouts} total workouts. ${activity} leads your log at ${frequencySummary}, so lock in one more focused session today and protect the streak.`;
};

export const generateMotivation = async (req, res) => {
  const user = await requireCompletedProfile(req.user.uid);
  const todayKey = getTodayKey();

  if (user.dailyMotivation?.date === todayKey && user.dailyMotivation.quote) {
    return res.json(user.dailyMotivation);
  }

  const workouts = await Workout.find({ userId: req.user.uid }).sort({ date: -1 });
  const stats = calculateStats(workouts, user.weeklyGoal, user.points);

  const prompt = `You are a fitness coach.

User stats:
- Streak: ${stats.currentStreak}
- Total workouts: ${stats.totalWorkouts}
- Most frequent activity: ${stats.mostFrequentActivity}
- Last workout date: ${stats.lastWorkoutDate ?? "No workouts yet"}
- Last workout gap: ${stats.lastWorkoutGap ?? 0} days
- Activity frequency: ${stats.activityFrequency.join(", ") || "No workouts yet"}
- Longest gap between workouts: ${stats.longestGapBetweenWorkouts} days
- Average gap between workouts: ${stats.averageGapBetweenWorkouts} days

Generate a short, powerful motivational message.
Must reference the user's real data.
Be specific and actionable.
Avoid generic phrases.`;

  let quote = "";

  try {
    quote = await callOpenRouter({
      messages: [
        {
          role: "system",
          content: "You are a fitness coach who writes vivid, specific, high-energy motivation in 1-2 sentences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
      maxTokens: 120,
    });
  } catch (error) {
    console.warn("Falling back to local motivation message", error.message);
    quote = buildFallbackMotivation({
      streak: stats.currentStreak,
      totalWorkouts: stats.totalWorkouts,
      activity: stats.mostFrequentActivity,
      gap: stats.lastWorkoutGap ?? 0,
      username: user.username,
      lastWorkoutDate: stats.lastWorkoutDate ?? "today",
      frequencySummary: stats.activityFrequency[0] || `${stats.mostFrequentActivity}: 0`,
    });
  }

  user.dailyMotivation = {
    quote,
    date: todayKey,
  };

  await user.save();

  return res.json(user.dailyMotivation);
};
