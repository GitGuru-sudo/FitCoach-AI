import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { getEndOfDay, getStartOfDay, getWeekWindow, isSameWeekAsToday } from "../utils/date.js";
import { requireCompletedProfile } from "../utils/profile.js";
import { calculateStats } from "../utils/stats.js";

export const createWorkout = async (req, res) => {
  const { activityType, duration, date } = req.body;
  const userId = req.user.uid;

  if (!activityType || !duration || !date) {
    return res.status(400).json({ message: "Activity type, duration, and date are required" });
  }

  const user = await requireCompletedProfile(userId);
  const workoutDate = new Date(date);

  if (Number.isNaN(workoutDate.getTime())) {
    return res.status(400).json({ message: "Invalid workout date" });
  }

  const workoutDayStart = getStartOfDay(workoutDate);
  const workoutDayEnd = getEndOfDay(workoutDate);
  const previousDayStart = new Date(workoutDayStart);
  previousDayStart.setDate(previousDayStart.getDate() - 1);
  const previousDayEnd = getEndOfDay(previousDayStart);

  const [hasWorkoutToday, hasWorkoutPreviousDay] = await Promise.all([
    Workout.exists({
      userId,
      date: { $gte: workoutDayStart, $lte: workoutDayEnd },
    }),
    Workout.exists({
      userId,
      date: { $gte: previousDayStart, $lte: previousDayEnd },
    }),
  ]);

  const streakBonus = !hasWorkoutToday && hasWorkoutPreviousDay ? 5 : 0;

  const workout = await Workout.create({
    userId,
    activityType,
    duration: Number(duration),
    date: workoutDate,
  });

  const currentWeek = getWeekWindow(new Date());
  const weeklyProgress = await Workout.countDocuments({
    userId,
    date: { $gte: currentWeek.start, $lte: currentWeek.end },
  });

  let awardedPoints = 10 + streakBonus;

  if (
    isSameWeekAsToday(workoutDate) &&
    weeklyProgress >= user.weeklyGoal &&
    user.weeklyGoalAwardedWeek !== currentWeek.key
  ) {
    awardedPoints += 50;
    user.weeklyGoalAwardedWeek = currentWeek.key;
  }

  user.points += awardedPoints;
  user.weeklyProgress = weeklyProgress;

  const workouts = await Workout.find({ userId }).sort({ date: -1 });
  const stats = calculateStats(workouts, user.weeklyGoal, user.points);
  user.badges = stats.badges;

  await user.save();

  res.status(201).json({
    workout,
    awardedPoints,
    user: {
      points: user.points,
      weeklyGoal: user.weeklyGoal,
      weeklyProgress: user.weeklyProgress,
      badges: user.badges,
    },
  });
};

export const getWorkouts = async (req, res) => {
  await requireCompletedProfile(req.user.uid);

  const page = Number.parseInt(req.query.page, 10) || 1;
  const limit = Number.parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [workouts, total] = await Promise.all([
    Workout.find({ userId: req.user.uid }).sort({ date: -1 }).skip(skip).limit(limit),
    Workout.countDocuments({ userId: req.user.uid }),
  ]);

  res.json({
    workouts,
    totalPages: Math.ceil(total / limit) || 1,
    currentPage: page,
    total,
  });
};
