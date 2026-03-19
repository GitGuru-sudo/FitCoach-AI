import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { getWeekWindow } from "../utils/date.js";
import { requireCompletedProfile } from "../utils/profile.js";
import { calculateStats } from "../utils/stats.js";

export const getStats = async (req, res) => {
  const user = await requireCompletedProfile(req.user.uid);

  const workouts = await Workout.find({ userId: req.user.uid }).sort({ date: -1 });
  const stats = calculateStats(workouts, user.weeklyGoal, user.points);
  const currentWeek = getWeekWindow(new Date());

  if (user.weeklyProgress !== stats.workoutsThisWeek) {
    user.weeklyProgress = stats.workoutsThisWeek;
    user.badges = stats.badges;
    await user.save();
  }

  const leaderboard = await User.find({
    username: { $exists: true, $ne: "" },
  })
    .sort({ points: -1, updatedAt: 1 })
    .limit(10)
    .select("username avatar points weeklyGoal weeklyProgress badges");

  const rank = (await User.countDocuments({ points: { $gt: user.points } })) + 1;

  res.json({
    stats,
    user: {
      username: user.username,
      avatar: user.avatar,
      points: user.points,
      weeklyGoal: user.weeklyGoal,
      weeklyProgress: user.weeklyProgress,
      badges: user.badges,
      coachTone: user.coachTone,
      dailyMotivation: user.dailyMotivation,
    },
    leaderboard,
    tournament: {
      weekOf: currentWeek.key,
      rank,
      challenge: `Complete ${user.weeklyGoal} workouts this week`,
      progress: user.weeklyProgress,
      goal: user.weeklyGoal,
    },
  });
};
