/* eslint-disable @next/next/no-img-element */

import { Crown, Medal, TrendingUp, Trophy } from "lucide-react";

import { formatPoints, getLeagueName } from "@/components/dashboard-utils";
import { getAllowedAvatar } from "@/lib/avatar-presets";
import type { AppUser, LeaderboardEntry, StatsPayload } from "@/types";

type TabRankProps = {
  activeUser: AppUser;
  statsPayload: StatsPayload;
  progressPercent: number;
};

const isSameUser = (entry: LeaderboardEntry, user: AppUser) =>
  Boolean(user._id && entry._id === user._id) || entry.username === user.username;

export const TabRank = ({ activeUser, statsPayload, progressPercent }: TabRankProps) => {
  const leaderboard = [...statsPayload.leaderboard].sort((left, right) => right.points - left.points);
  const podium = leaderboard.slice(0, 3);
  const currentUserVisible = leaderboard.some((entry) => isSameUser(entry, activeUser));

  return (
    <section className="space-y-6">
      <div className="hero-card">
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="eyebrow text-[#9cc7b0]">Current standing</p>
            <div className="mt-4 flex items-end gap-3 text-white">
              <h2 className="text-6xl font-semibold tracking-tight">#{statsPayload.tournament.rank}</h2>
              <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-[#d7e7dc]">
                <TrendingUp className="h-4 w-4" />
                On the rise
              </span>
            </div>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#d5e1d8]">
              {statsPayload.tournament.challenge} with {statsPayload.tournament.progress} of{" "}
              {statsPayload.tournament.goal} sessions complete this week.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="hero-side-card min-h-[132px]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8fa699]">Total XP</p>
              <p className="mt-4 text-3xl font-semibold text-white">{formatPoints(activeUser.points)}</p>
            </div>

            <div className="hero-side-card min-h-[132px]">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8fa699]">League</p>
              <p className="mt-4 text-3xl font-semibold text-white">{getLeagueName(activeUser)}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="cream-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-title">Tournament progress</p>
            <p className="section-copy">{statsPayload.tournament.challenge}</p>
          </div>
          <span className="soft-chip">
            Week of{" "}
            {new Date(statsPayload.tournament.weekOf).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="progress-rail progress-rail-cream mt-5">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <p className="mt-3 text-sm leading-7 text-[#607164]">
          {statsPayload.tournament.progress} / {statsPayload.tournament.goal} workouts complete.
        </p>
      </section>

      <section className="cream-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-title">Top Performers</p>
            <p className="section-copy">The podium is powered by live user points.</p>
          </div>
          <Crown className="h-5 w-5 text-[#8c6b13]" />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 md:items-end">
          {podium.map((entry, index) => {
            const rank = index + 1;
            const classes =
              rank === 1
                ? "podium-card podium-card-first"
                : rank === 2
                  ? "podium-card podium-card-second"
                  : "podium-card podium-card-third";

            return (
              <article key={entry._id} className={classes}>
                <img src={getAllowedAvatar(entry.avatar)} alt={entry.username} className="podium-avatar" />
                <div className="mt-4 flex items-center justify-center gap-2">
                  {rank === 1 ? <Crown className="h-4 w-4" /> : <Medal className="h-4 w-4" />}
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                    {rank === 1 ? "Champion" : `${rank} place`}
                  </span>
                </div>
                <p className="mt-3 text-xl font-semibold">{entry.username}</p>
                <p className="mt-1 text-sm opacity-80">{formatPoints(entry.points)} pts</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="cream-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-title">Global Rankings</p>
            <p className="section-copy">Current user points stay highlighted, even outside the visible top list.</p>
          </div>
          <Trophy className="h-5 w-5 text-[#8c6b13]" />
        </div>

        <div className="mt-6 space-y-3">
          {!currentUserVisible ? (
            <article className="ranking-row ranking-row-current">
              <div className="ranking-rank">#{statsPayload.tournament.rank}</div>
              <img src={getAllowedAvatar(activeUser.avatar)} alt="Profile avatar" className="ranking-avatar" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#173126]">You</p>
                <p className="text-sm text-[#4f6659]">{getLeagueName(activeUser)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#173126]">{formatPoints(activeUser.points)} pts</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#69826d]">Current</p>
              </div>
            </article>
          ) : null}

          {leaderboard.map((entry, index) => {
            const current = isSameUser(entry, activeUser);

            return (
              <article
                key={entry._id}
                className={`ranking-row ${current ? "ranking-row-current" : ""}`}
              >
                <div className="ranking-rank">#{index + 1}</div>
                <img src={getAllowedAvatar(entry.avatar)} alt={entry.username} className="ranking-avatar" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[#173126]">
                    {current ? "You" : entry.username}
                  </p>
                  <p className="text-sm text-[#4f6659]">
                    {entry.weeklyProgress}/{entry.weeklyGoal} weekly goal
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#173126]">{formatPoints(entry.points)} pts</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#69826d]">
                    {entry.badges[0] || "Rising"}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
};
