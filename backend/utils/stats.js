import { getDateKey, getDayDifference, getTodayKey, getWeekWindow } from "./date.js";

const getBadgeList = ({ totalWorkouts, currentStreak, weeklyProgress, weeklyGoal, totalWorkoutMinutes, points }) => {
  const badges = [];

  if (totalWorkouts >= 1) {
    badges.push("Beginner");
  }

  if (currentStreak >= 5 || weeklyProgress >= weeklyGoal) {
    badges.push("Consistent");
  }

  if (totalWorkoutMinutes >= 600 || points >= 200) {
    badges.push("Beast Mode");
  }

  return badges;
};

export const calculateStats = (workouts, weeklyGoal, points = 0) => {
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalWorkouts = sortedWorkouts.length;
  const totalWorkoutMinutes = sortedWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const frequencyMap = sortedWorkouts.reduce((map, workout) => {
    map[workout.activityType] = (map[workout.activityType] || 0) + 1;
    return map;
  }, {});

  const mostFrequentActivity =
    Object.entries(frequencyMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "No workouts yet";

  const { start: weekStart, end: weekEnd } = getWeekWindow(new Date());
  const workoutsThisWeek = sortedWorkouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= weekStart && workoutDate <= weekEnd;
  }).length;

  const uniqueWorkoutDays = [...new Set(sortedWorkouts.map((workout) => getDateKey(workout.date)))];
  const latestWorkoutDay = uniqueWorkoutDays[0];

  let currentStreak = 0;

  if (latestWorkoutDay) {
    const todayKey = getTodayKey();
    const todayGap = getDayDifference(todayKey, latestWorkoutDay);

    if (todayGap <= 1) {
      currentStreak = 1;

      for (let index = 1; index < uniqueWorkoutDays.length; index += 1) {
        const previousDay = uniqueWorkoutDays[index - 1];
        const currentDay = uniqueWorkoutDays[index];

        if (getDayDifference(previousDay, currentDay) === 1) {
          currentStreak += 1;
        } else {
          break;
        }
      }
    }
  }

  const lastWorkoutGap = latestWorkoutDay ? getDayDifference(getTodayKey(), latestWorkoutDay) : null;
  const gapValues = uniqueWorkoutDays
    .slice(0, -1)
    .map((day, index) => getDayDifference(day, uniqueWorkoutDays[index + 1]));
  const longestGapBetweenWorkouts = gapValues.length > 0 ? Math.max(...gapValues) - 1 : 0;
  const averageGapBetweenWorkouts =
    gapValues.length > 0
      ? Number(
          (gapValues.reduce((sum, gap) => sum + Math.max(gap - 1, 0), 0) / gapValues.length).toFixed(1),
        )
      : 0;
  const activityFrequency = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .map(([activity, count]) => `${activity}: ${count}`);
  const badges = getBadgeList({
    totalWorkouts,
    currentStreak,
    weeklyProgress: workoutsThisWeek,
    weeklyGoal,
    totalWorkoutMinutes,
    points,
  });

  return {
    currentStreak,
    workoutsThisWeek,
    mostFrequentActivity,
    totalWorkoutMinutes,
    totalWorkouts,
    lastWorkoutGap,
    lastWorkoutDate: latestWorkoutDay || null,
    longestGapBetweenWorkouts,
    averageGapBetweenWorkouts,
    activityFrequency,
    badges,
  };
};
