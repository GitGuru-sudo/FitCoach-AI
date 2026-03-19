import {
  Bike,
  Brain,
  CalendarRange,
  Dumbbell,
  Flame,
  Footprints,
  MoveRight,
  PersonStanding,
  Target,
  TimerReset,
  Trophy,
  Waves,
} from "lucide-react";
import type { FormEvent } from "react";

import {
  ACTIVITY_OPTIONS,
  formatDate,
  getCaloriesEstimate,
  getLeagueName,
  getRankingTeaser,
  type ActivityOption,
} from "@/components/dashboard-utils";
import type { AppUser, CoachTone, DailyMotivation, StatsPayload } from "@/types";

type WorkoutFormState = {
  activityType: ActivityOption;
  duration: number;
  date: string;
};

type TabDashboardProps = {
  activeUser: AppUser;
  statsPayload: StatsPayload;
  motivation: DailyMotivation | null;
  workoutForm: WorkoutFormState;
  workoutSubmitting: boolean;
  coachTone: CoachTone;
  goalDraft: number;
  insight: string;
  onWorkoutFieldChange: <K extends keyof WorkoutFormState>(
    key: K,
    value: WorkoutFormState[K],
  ) => void;
  onWorkoutSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onOpenRank: () => void;
  onOpenSettings: () => void;
};

const renderActivityIcon = (activity: string) => {
  const normalizedActivity = activity.toLowerCase();

  if (normalizedActivity.includes("cycl")) {
    return <Bike className="h-7 w-7 text-white" />;
  }

  if (normalizedActivity.includes("run")) {
    return <Footprints className="h-7 w-7 text-white" />;
  }

  if (normalizedActivity.includes("swim")) {
    return <Waves className="h-7 w-7 text-white" />;
  }

  if (normalizedActivity.includes("yoga")) {
    return <PersonStanding className="h-7 w-7 text-white" />;
  }

  return <Dumbbell className="h-7 w-7 text-white" />;
};

export const TabDashboard = ({
  activeUser,
  statsPayload,
  motivation,
  workoutForm,
  workoutSubmitting,
  coachTone,
  goalDraft,
  insight,
  onWorkoutFieldChange,
  onWorkoutSubmit,
  onOpenRank,
  onOpenSettings,
}: TabDashboardProps) => {
  const caloriesEstimate = getCaloriesEstimate(statsPayload.stats.totalWorkoutMinutes);
  const motivationQuote =
    motivation?.quote || `Today is a great day to start strong, ${activeUser.username}.`;
  const totalHours = (statsPayload.stats.totalWorkoutMinutes / 60).toFixed(
    statsPayload.stats.totalWorkoutMinutes > 0 && statsPayload.stats.totalWorkoutMinutes % 60 !== 0 ? 1 : 0,
  );
  const topActivity = statsPayload.stats.mostFrequentActivity || workoutForm.activityType;

  return (
    <section className="space-y-6">
      <div className="dashboard-highlight-panel">
        <article className="motivation-panel">
          <p className="motivation-panel-kicker">Daily motivation</p>
          <p className="motivation-panel-quote quote-clamp-two">{motivationQuote}</p>
        </article>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <article className="metric-panel">
            <Flame className="metric-panel-icon text-[#df4d4d]" />
            <p className="metric-panel-label">Current streak</p>
            <p className="metric-panel-value">{statsPayload.stats.currentStreak}</p>
            <p className="metric-panel-copy">Days strong</p>
          </article>

          <article className="metric-panel">
            <CalendarRange className="metric-panel-icon text-[#56be82]" />
            <p className="metric-panel-label">This week</p>
            <p className="metric-panel-value">{statsPayload.stats.workoutsThisWeek}</p>
            <p className="metric-panel-copy">Sessions</p>
          </article>
        </div>

        <article className="top-activity-panel mt-4">
          <div>
            <p className="top-activity-eyebrow">Top activity</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-[#202226]">{topActivity}</p>
            <p className="top-activity-copy">{totalHours} hours total</p>
          </div>

          <div className="top-activity-icon-shell">
            {renderActivityIcon(topActivity)}
          </div>
        </article>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <article className="stat-tile">
          <Target className="stat-icon text-[#bc4343]" />
          <p className="stat-label">Calories</p>
          <p className="stat-value">{caloriesEstimate} kcal</p>
        </article>

        <article className="stat-tile stat-tile-soft-red">
          <TimerReset className="stat-icon text-[#8c6b13]" />
          <p className="stat-label">Total minutes</p>
          <p className="stat-value">{statsPayload.stats.totalWorkoutMinutes}</p>
        </article>

        <article className="stat-tile">
          <CalendarRange className="stat-icon text-[#1d7a50]" />
          <p className="stat-label">Workouts</p>
          <p className="stat-value">{statsPayload.stats.totalWorkouts}</p>
        </article>

        <article className="stat-tile">
          <Trophy className="stat-icon text-[#735712]" />
          <p className="stat-label">League</p>
          <p className="stat-value">{getLeagueName(activeUser)}</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="cream-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-title">Log Workout</p>
                <p className="section-copy">
                  Every session adds points, grows your streak, and nudges your rank upward.
                </p>
              </div>
              <span className="soft-chip">+10 base points</span>
            </div>

            <form className="mt-6 space-y-5" onSubmit={onWorkoutSubmit}>
              <div>
                <span className="form-label">Workout type</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ACTIVITY_OPTIONS.map((activity) => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => onWorkoutFieldChange("activityType", activity)}
                      className={`activity-pill ${
                        workoutForm.activityType === activity ? "activity-pill-active" : ""
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="form-label">Duration</span>
                  <input
                    min={1}
                    type="number"
                    value={workoutForm.duration}
                    onChange={(event) => onWorkoutFieldChange("duration", Number(event.target.value))}
                    className="form-input"
                  />
                </label>

                <label className="block">
                  <span className="form-label">Session timing</span>
                  <input
                    type="datetime-local"
                    value={workoutForm.date}
                    onChange={(event) => onWorkoutFieldChange("date", event.target.value)}
                    className="form-input"
                  />
                </label>
              </div>

              <button type="submit" disabled={workoutSubmitting} className="primary-button w-full">
                {workoutSubmitting ? "Saving session..." : "Save Session"}
              </button>
            </form>
          </section>

          <section className="cream-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-title">Smart Insight</p>
                <p className="section-copy">
                  Today&apos;s focus is built from your consistency, frequency, and recovery rhythm.
                </p>
              </div>
              <Brain className="h-5 w-5 text-[#2f684f]" />
            </div>

            <div className="insight-card mt-5">
              <p className="text-sm uppercase tracking-[0.22em] text-[#2f684f]">Focus for today</p>
              <p className="mt-3 text-base leading-8 text-[#173126]">{insight}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="soft-chip">
                  Frequency: {statsPayload.stats.activityFrequency[0] || "No data yet"}
                </span>
                <span className="soft-chip">
                  Top activity: {statsPayload.stats.mostFrequentActivity}
                </span>
                <span className="soft-chip">
                  Gap trend: {statsPayload.stats.averageGapBetweenWorkouts} day avg
                </span>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <button type="button" onClick={onOpenRank} className="rank-teaser-card w-full text-left">
            <div className="flex items-center gap-3">
              <div className="rank-teaser-icon">
                <Trophy className="h-5 w-5 text-[#735712]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#735712]">Ranking</p>
                <p className="mt-1 text-lg font-semibold text-[#3d3415]">
                  {getRankingTeaser(statsPayload.tournament.rank)}
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between text-sm font-semibold text-[#5d4f20]">
              <span>
                #{statsPayload.tournament.rank} · {statsPayload.tournament.challenge}
              </span>
              <MoveRight className="h-4 w-4" />
            </div>
          </button>

          <section className="cream-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-title">Goal & Coach Settings</p>
                <p className="section-copy">
                  Weekly goal, coach tone, and account controls live here now.
                </p>
              </div>
              <button type="button" onClick={onOpenSettings} className="soft-chip">
                Open settings
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="detail-row">
                <span>Weekly goal</span>
                <strong>{goalDraft} sessions</strong>
              </div>
              <div className="detail-row">
                <span>Coach tone</span>
                <strong className="capitalize">{coachTone}</strong>
              </div>
              <div className="detail-row">
                <span>Last workout</span>
                <strong>
                  {statsPayload.stats.lastWorkoutDate
                    ? formatDate(statsPayload.stats.lastWorkoutDate)
                    : "No workout yet"}
                </strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
