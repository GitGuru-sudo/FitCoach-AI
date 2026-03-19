"use client";
/* eslint-disable @next/next/no-img-element */

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import {
  ChevronDown,
  Check,
  ChartColumnBig,
  Copy,
  Crown,
  Dumbbell,
  MessageCircleMore,
  Sparkles,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";

import { LoadingScreen } from "@/components/loading-screen";
import { TabAiChat } from "@/components/tab-ai-chat";
import { TabDashboard } from "@/components/tab-dashboard";
import { TabRank } from "@/components/tab-rank";
import { TabWorkouts } from "@/components/tab-workouts";
import {
  buildInsight,
  formatPoints,
  type ActivityOption,
  type DashboardTab,
  type WorkoutFilter,
} from "@/components/dashboard-utils";
import { useAuth } from "@/context/auth-context";
import { apiFetch } from "@/lib/api";
import { UPLOADED_AVATARS, getAllowedAvatar } from "@/lib/avatar-presets";
import type {
  AppUser,
  ChatMessage,
  CoachTone,
  DailyMotivation,
  StatsPayload,
  WorkoutsPayload,
} from "@/types";

type WorkoutFormState = {
  activityType: ActivityOption;
  duration: number;
  date: string;
};

const getSessionTimingValue = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 16);
};

const NAV_ITEMS: Array<{
  id: DashboardTab;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "dashboard", label: "Dashboard", icon: ChartColumnBig },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "ai-chat", label: "AI Cat", icon: MessageCircleMore },
  { id: "rank", label: "Rank", icon: Trophy },
];

export const DashboardShell = () => {
  const { firebaseUser, profile, refreshProfile, saveProfile, signOutUser } = useAuth();
  const [statsPayload, setStatsPayload] = useState<StatsPayload | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutsPayload["workouts"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [motivation, setMotivation] = useState<DailyMotivation | null>(profile?.dailyMotivation || null);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [workoutSubmitting, setWorkoutSubmitting] = useState(false);
  const [chatSubmitting, setChatSubmitting] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [workoutFilter, setWorkoutFilter] = useState<WorkoutFilter>("All");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [workoutForm, setWorkoutForm] = useState<WorkoutFormState>({
    activityType: "Running",
    duration: 30,
    date: getSessionTimingValue(),
  });
  const [chatInput, setChatInput] = useState("");
  const [profileNameDraft, setProfileNameDraft] = useState(profile?.username || "");
  const [avatarDraft, setAvatarDraft] = useState(getAllowedAvatar(profile?.avatar));
  const [coachTone, setCoachTone] = useState<CoachTone>(profile?.coachTone || "balanced");
  const [goalDraft, setGoalDraft] = useState(profile?.weeklyGoal || 5);
  const [isPending, startUiTransition] = useTransition();
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const fetchToken = useCallback(async () => {
    if (!firebaseUser) {
      throw new Error("Authentication required");
    }

    return firebaseUser.getIdToken();
  }, [firebaseUser]);

  const hydrateDashboard = useCallback(async () => {
    const token = await fetchToken();
    setDashboardError("");

    const [statsResponse, workoutsResponse, chatResponse, motivationResponse] = await Promise.all([
      apiFetch<StatsPayload>("/stats", { token }),
      apiFetch<WorkoutsPayload>("/workouts?page=1&limit=6", { token }),
      apiFetch<{ messages: ChatMessage[] }>("/chat/history", { token }),
      apiFetch<DailyMotivation>("/ai/motivation", { method: "POST", token }),
    ]);

    startTransition(() => {
      setStatsPayload(statsResponse);
      setWorkouts(workoutsResponse.workouts);
      setCurrentPage(workoutsResponse.currentPage);
      setTotalPages(workoutsResponse.totalPages);
      setChatMessages(chatResponse.messages);
      setMotivation(motivationResponse);
      setCoachTone(statsResponse.user.coachTone);
      setGoalDraft(statsResponse.user.weeklyGoal);
    });
  }, [fetchToken]);

  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    setDashboardLoading(true);

    hydrateDashboard()
      .catch((error) => {
        setDashboardError(
          error instanceof Error ? error.message : "Unable to load your dashboard right now.",
        );
      })
      .finally(() => {
        setDashboardLoading(false);
      });
  }, [firebaseUser, hydrateDashboard]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setProfileNameDraft(profile.username);
    setAvatarDraft(getAllowedAvatar(profile.avatar));
    setCoachTone(profile.coachTone);
    setGoalDraft(profile.weeklyGoal);
  }, [profile]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setInviteLink(`${window.location.origin}/?invite=${encodeURIComponent(profileNameDraft.trim() || "friend")}`);
  }, [profileNameDraft]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleWorkoutFieldChange = <K extends keyof WorkoutFormState>(
    key: K,
    value: WorkoutFormState[K],
  ) => {
    setWorkoutForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleWorkoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWorkoutSubmitting(true);
    setDashboardError("");

    try {
      const token = await fetchToken();
      await apiFetch("/workouts", {
        method: "POST",
        token,
        body: workoutForm,
      });
      setWorkoutForm((current) => ({
        ...current,
        duration: 30,
        date: getSessionTimingValue(),
      }));
      await hydrateDashboard();
      await refreshProfile();
      setWorkoutFilter("All");
      setActiveTab("workouts");
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Unable to save workout.");
    } finally {
      setWorkoutSubmitting(false);
    }
  };

  const loadMoreWorkouts = async () => {
    if (currentPage >= totalPages) {
      return;
    }

    try {
      const token = await fetchToken();
      const nextPage = currentPage + 1;
      const response = await apiFetch<WorkoutsPayload>(`/workouts?page=${nextPage}&limit=6`, {
        token,
      });

      startUiTransition(() => {
        setWorkouts((current) => [...current, ...response.workouts]);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      });
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Unable to load more workouts.");
    }
  };

  const sendChatMessage = useCallback(
    async (message: string) => {
      const trimmedMessage = message.trim();

      if (!trimmedMessage) {
        return;
      }

      const optimisticMessage: ChatMessage = {
        role: "user",
        content: trimmedMessage,
        createdAt: new Date().toISOString(),
      };

      setChatSubmitting(true);
      setDashboardError("");
      setChatMessages((current) => [...current, optimisticMessage]);
      setChatInput("");

      try {
        const token = await fetchToken();
        const response = await apiFetch<{ messages: ChatMessage[] }>("/chat", {
          method: "POST",
          token,
          body: {
            message: trimmedMessage,
            coachTone,
          },
        });
        startUiTransition(() => {
          setChatMessages(response.messages);
        });
      } catch (error) {
        setDashboardError(error instanceof Error ? error.message : "Unable to send chat message.");
        setChatMessages((current) => current.filter((entry) => entry !== optimisticMessage));
        setChatInput(trimmedMessage);
      } finally {
        setChatSubmitting(false);
      }
    },
    [coachTone, fetchToken],
  );

  const handleChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendChatMessage(chatInput);
  };

  const handleSettingsSave = async () => {
    if (!profile) {
      return;
    }

    if (!profileNameDraft.trim()) {
      setDashboardError("Please enter a profile name.");
      return;
    }

    setSettingsSaving(true);
    setDashboardError("");

    try {
      await saveProfile({
        username: profileNameDraft.trim(),
        avatar: avatarDraft,
        weeklyGoal: goalDraft,
        coachTone,
      });
      await hydrateDashboard();
      setIsSettingsOpen(false);
    } catch (error) {
      setDashboardError(error instanceof Error ? error.message : "Unable to update your settings.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleCopyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setInviteCopied(true);
      window.setTimeout(() => setInviteCopied(false), 2000);
    } catch {
      setDashboardError("Unable to copy the invite link right now.");
    }
  };

  if (dashboardLoading) {
    return <LoadingScreen label="Loading your coaching dashboard" />;
  }

  if (!statsPayload || !profile) {
    return (
      <div className="min-h-screen px-6 py-10 text-[#1b2b20]">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-red-500/20 bg-[#fff5f3] p-8 shadow-[0_24px_70px_rgba(161,77,55,0.08)]">
          <h1 className="text-3xl font-semibold">Dashboard unavailable</h1>
          <p className="mt-3 text-[#6c5147]">
            {dashboardError || "We couldn't load your workspace. Please refresh and try again."}
          </p>
        </div>
      </div>
    );
  }

  const activeUser = statsPayload.user as AppUser;
  const progressPercent = Math.min(
    100,
    Math.round((statsPayload.user.weeklyProgress / Math.max(statsPayload.user.weeklyGoal, 1)) * 100),
  );
  const insight = buildInsight(statsPayload.stats);
  const filteredWorkouts =
    workoutFilter === "All"
      ? workouts
      : workouts.filter((workout) => workout.activityType === workoutFilter);

  return (
    <div className="fit-app-shell">
      <div className="fit-background-orb fit-background-orb-left" />
      <div className="fit-background-orb fit-background-orb-right" />

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-36 pt-5 sm:px-6 lg:px-8">
        <header className="dashboard-header">
          <div ref={profileMenuRef} className="relative flex min-w-0 items-center gap-3 sm:gap-4">
            <button
              type="button"
              className="avatar-trigger"
              onClick={() => setIsProfileMenuOpen((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
              aria-label="Open profile menu"
            >
              <img src={getAllowedAvatar(activeUser.avatar)} alt="Profile avatar" className="header-avatar" />
              <ChevronDown className="h-4 w-4 text-white/75" />
            </button>
            <div className="min-w-0">
              <p className="eyebrow text-[#97d8af]">Athlete dashboard</p>
              <h1 className="truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {activeUser.username}
              </h1>
              <p className="truncate text-sm font-medium text-[#59d18d] sm:text-base">
                {formatPoints(activeUser.points)} pts
              </p>
            </div>

            {isProfileMenuOpen ? (
              <div className="profile-menu" role="menu">
                <button
                  type="button"
                  className="profile-menu-item"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsSettingsOpen(true);
                  }}
                  role="menuitem"
                >
                  Profile
                </button>
                <button
                  type="button"
                  className="profile-menu-item profile-menu-item-danger"
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    await signOutUser();
                  }}
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button type="button" className="upgrade-button" onClick={() => setIsSubscriptionOpen(true)}>
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </header>

        {dashboardError ? <div className="error-banner mt-4">{dashboardError}</div> : null}

        <main className="mt-6 flex-1">
          {activeTab === "dashboard" ? (
            <TabDashboard
              activeUser={activeUser}
              statsPayload={statsPayload}
              motivation={motivation}
              workoutForm={workoutForm}
              workoutSubmitting={workoutSubmitting}
              coachTone={coachTone}
              goalDraft={goalDraft}
              insight={insight}
              onWorkoutFieldChange={handleWorkoutFieldChange}
              onWorkoutSubmit={handleWorkoutSubmit}
              onOpenRank={() => setActiveTab("rank")}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          ) : null}

          {activeTab === "workouts" ? (
            <TabWorkouts
              workouts={workouts}
              filteredWorkouts={filteredWorkouts}
              workoutFilter={workoutFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              isPending={isPending}
              statsPayload={statsPayload}
              onFilterChange={setWorkoutFilter}
              onLoadMore={loadMoreWorkouts}
              onOpenDashboard={() => setActiveTab("dashboard")}
            />
          ) : null}

          {activeTab === "ai-chat" ? (
            <TabAiChat
              chatMessages={chatMessages}
              chatInput={chatInput}
              chatSubmitting={chatSubmitting}
              coachTone={coachTone}
              onChatInputChange={setChatInput}
              onChatSubmit={handleChatSubmit}
              onQuickAction={sendChatMessage}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          ) : null}

          {activeTab === "rank" ? (
            <TabRank
              activeUser={activeUser}
              statsPayload={statsPayload}
              progressPercent={progressPercent}
            />
          ) : null}
        </main>

        <nav className="bottom-nav-shell" aria-label="Dashboard tabs">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;

            return (
              <button
                key={item.id}
                type="button"
                className={`bottom-nav-item ${isActive ? "bottom-nav-item-active" : ""}`}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {isSettingsOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="modal-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[#6f7a61]">Profile</p>
                <h2 id="settings-title" className="mt-2 text-2xl font-semibold text-[#17261d]">
                  Edit profile
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#617064]">
                  Update your photo, name, invite link, and coach preferences from one place.
                </p>
              </div>
              <button
                type="button"
                className="header-icon-button"
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Close settings"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <span className="form-label">Profile photo</span>
                  <div className="flex items-center gap-4">
                    <img
                      src={getAllowedAvatar(avatarDraft)}
                      alt="Profile preview"
                      className="h-[5.5rem] w-[5.5rem] rounded-[26px] object-cover"
                    />
                    <p className="max-w-xs text-sm leading-7 text-[#617064]">
                      Only the uploaded app avatars are available for profile selection.
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {UPLOADED_AVATARS.map((avatar) => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setAvatarDraft(avatar)}
                        className={`relative overflow-hidden rounded-[22px] border p-2 ${
                          avatarDraft === avatar
                            ? "border-[#6fcc8e] bg-[#edf5ee]"
                            : "border-[#dfd5c4] bg-white"
                        }`}
                      >
                        <img src={avatar} alt="Preset avatar" className="h-full w-full rounded-[16px]" />
                        {avatarDraft === avatar ? (
                          <span className="absolute right-2 top-2 rounded-full bg-[#6fcc8e] p-1 text-[#10211c]">
                            <Check className="h-3 w-3" />
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="form-label">Name</span>
                    <input
                      required
                      value={profileNameDraft}
                      onChange={(event) => setProfileNameDraft(event.target.value)}
                      className="form-input"
                      placeholder="Your display name"
                    />
                  </label>

                  <div>
                    <span className="form-label">Invite friend link</span>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        readOnly
                        value={inviteLink}
                        className="form-input flex-1"
                      />
                      <button type="button" onClick={handleCopyInviteLink} className="primary-button sm:min-w-[140px]">
                        <Copy className="h-4 w-4" />
                        {inviteCopied ? "Copied" : "Copy link"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="form-label">Weekly goal</span>
                <input
                  min={1}
                  max={14}
                  type="number"
                  value={goalDraft}
                  onChange={(event) => setGoalDraft(Number(event.target.value))}
                  className="form-input"
                />
              </label>

              <label className="block">
                <span className="form-label">Coach tone</span>
                <select
                  value={coachTone}
                  onChange={(event) => setCoachTone(event.target.value as CoachTone)}
                  className="form-input"
                >
                  <option value="balanced">Balanced</option>
                  <option value="intense">Intense</option>
                  <option value="calm">Calm</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={handleSettingsSave} className="primary-button flex-1">
                {settingsSaving ? "Saving..." : "Save settings"}
              </button>
              <button type="button" onClick={signOutUser} className="secondary-button flex-1">
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isSubscriptionOpen ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="subscription-title">
          <div className="modal-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[#6f7a61]">Upgrade options</p>
                <h2 id="subscription-title" className="mt-2 text-2xl font-semibold text-[#17261d]">
                  Pick your coaching tier
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#617064]">
                  Billing can come later, but the UI is ready for a premium path today.
                </p>
              </div>
              <button
                type="button"
                className="header-icon-button"
                onClick={() => setIsSubscriptionOpen(false)}
                aria-label="Close subscription plans"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="plan-card plan-card-base">
                <p className="plan-tier">Basic</p>
                <p className="plan-price">
                  $5<span>/month</span>
                </p>
                <p className="plan-copy">
                  Workout logging, streak tracking, daily motivation, leaderboard access, and AI chat history.
                </p>
              </article>

              <article className="plan-card plan-card-pro">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#17301f]">
                  <Crown className="h-3.5 w-3.5" />
                  Pro
                </div>
                <p className="plan-price mt-4">
                  $10<span>/month</span>
                </p>
                <p className="plan-copy text-[#253822]">
                  Everything in Basic plus premium coach modes, richer insight cards, and future plan automation.
                </p>
              </article>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
