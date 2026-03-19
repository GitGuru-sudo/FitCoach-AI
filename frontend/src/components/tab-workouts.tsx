import { ArrowUpRight, Clock3, Dumbbell, Flame, Layers3, MoveRight } from "lucide-react";

import { ACTIVITY_OPTIONS, formatDateTime, type WorkoutFilter } from "@/components/dashboard-utils";
import type { StatsPayload, Workout } from "@/types";

type TabWorkoutsProps = {
  workouts: Workout[];
  filteredWorkouts: Workout[];
  workoutFilter: WorkoutFilter;
  currentPage: number;
  totalPages: number;
  isPending: boolean;
  statsPayload: StatsPayload;
  onFilterChange: (filter: WorkoutFilter) => void;
  onLoadMore: () => Promise<void>;
  onOpenDashboard: () => void;
};

export const TabWorkouts = ({
  workouts,
  filteredWorkouts,
  workoutFilter,
  currentPage,
  totalPages,
  isPending,
  statsPayload,
  onFilterChange,
  onLoadMore,
  onOpenDashboard,
}: TabWorkoutsProps) => {
  const countsByActivity = ACTIVITY_OPTIONS.map((activity) => ({
    activity,
    count: workouts.filter((workout) => workout.activityType === activity).length,
  }));

  return (
    <section className="space-y-6">
      <div className="hero-card hero-card-short">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-[#9cc7b0]">Today&apos;s focus</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {statsPayload.stats.mostFrequentActivity}
              <br />
              momentum block
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-[#d6e2d9]">
              {statsPayload.stats.totalWorkoutMinutes} minutes logged so far with{" "}
              {statsPayload.stats.workoutsThisWeek} sessions this week.
            </p>
          </div>

          <button type="button" onClick={onOpenDashboard} className="primary-button">
            Log workout
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="cream-card">
          <div className="flex items-center justify-between">
            <p className="section-title text-xl">Top discipline</p>
            <Dumbbell className="h-5 w-5 text-[#2f684f]" />
          </div>
          <p className="mt-5 text-3xl font-semibold tracking-tight text-[#17261d]">
            {statsPayload.stats.mostFrequentActivity}
          </p>
          <p className="mt-2 text-sm text-[#607164]">
            Your most repeated movement this cycle. Use it as your reliable fallback session.
          </p>
        </article>

        <article className="cream-card">
          <div className="flex items-center justify-between">
            <p className="section-title text-xl">Consistency</p>
            <Flame className="h-5 w-5 text-[#a94a3a]" />
          </div>
          <p className="mt-5 text-3xl font-semibold tracking-tight text-[#17261d]">
            {statsPayload.stats.currentStreak} days
          </p>
          <p className="mt-2 text-sm text-[#607164]">
            Your streak is alive. Adding one more entry today keeps the trend intact.
          </p>
        </article>

        <article className="cream-card">
          <div className="flex items-center justify-between">
            <p className="section-title text-xl">Loaded history</p>
            <Layers3 className="h-5 w-5 text-[#8c6b13]" />
          </div>
          <p className="mt-5 text-3xl font-semibold tracking-tight text-[#17261d]">{workouts.length}</p>
          <p className="mt-2 text-sm text-[#607164]">
            Workout rows ready to browse across {totalPages} page{totalPages === 1 ? "" : "s"}.
          </p>
        </article>
      </div>

      <section className="cream-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-title">Disciplines</p>
            <p className="section-copy">Filter the history list by activity type without losing pagination.</p>
          </div>
          <span className="soft-chip">
            {workoutFilter === "All" ? "All activities" : workoutFilter}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onFilterChange("All")}
            className={`activity-pill ${workoutFilter === "All" ? "activity-pill-active" : ""}`}
          >
            All
          </button>
          {countsByActivity.map(({ activity, count }) => (
            <button
              key={activity}
              type="button"
              onClick={() => onFilterChange(activity)}
              className={`activity-pill ${workoutFilter === activity ? "activity-pill-active" : ""}`}
            >
              {activity}
              <span className="activity-pill-count">{count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="cream-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-title">Workout History</p>
            <p className="section-copy">Most recent first with duration, session timing, and activity context.</p>
          </div>
          <span className="soft-chip">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <article key={workout._id} className="workout-row">
                <div className="workout-row-image">
                  <Dumbbell className="h-5 w-5 text-[#214632]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a7d66]">
                        {workout.activityType}
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-[#16261d]">
                        {workout.activityType} session
                      </h3>
                    </div>
                    <MoveRight className="hidden h-4 w-4 text-[#8c6b13] sm:block" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="soft-chip">
                      <Clock3 className="h-3.5 w-3.5" />
                      {workout.duration} min
                    </span>
                    <span className="soft-chip">{formatDateTime(workout.date)}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              {workoutFilter === "All"
                ? "No workouts yet. Your first logged session will show up here."
                : `No ${workoutFilter.toLowerCase()} sessions are loaded yet.`}
            </div>
          )}
        </div>

        {currentPage < totalPages ? (
          <button type="button" onClick={onLoadMore} className="secondary-button mt-6">
            {isPending ? "Loading..." : "Load more workouts"}
          </button>
        ) : null}
      </section>
    </section>
  );
};
