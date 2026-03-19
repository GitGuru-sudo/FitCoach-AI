"use client";

import { useState } from "react";
import { ArrowRight, Dumbbell, Flame, Sparkles } from "lucide-react";

import { useAuth } from "@/context/auth-context";

export const AuthPanel = () => {
  const { authError, signInWithEmail, signInWithGoogleProvider, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setLocalError("");

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Unable to complete authentication.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setLocalError("");

    try {
      await signInWithGoogleProvider();
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#15382f_0%,#07100f_45%,#040605_100%)] text-stone-50">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />
      <main className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
        <section className="flex flex-col justify-center">
          <p className="eyebrow">FitCoach AI</p>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            AI coaching, gamified workouts, and daily momentum in one dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            Track your workouts, build streaks, unlock badges, and get specific AI motivation
            anchored in your real performance data.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="feature-card">
              <Flame className="h-6 w-6 text-[#ff8f6b]" />
              <h2 className="mt-4 text-lg font-semibold">Streak-first design</h2>
              <p className="mt-2 text-sm text-stone-300">
                Every workout feeds points, weekly challenges, and a leaderboard that feels alive.
              </p>
            </article>
            <article className="feature-card">
              <Sparkles className="h-6 w-6 text-[#7df0c4]" />
              <h2 className="mt-4 text-lg font-semibold">Personalized AI</h2>
              <p className="mt-2 text-sm text-stone-300">
                Daily motivation and coach chat both reference your actual streak and activity mix.
              </p>
            </article>
            <article className="feature-card">
              <Dumbbell className="h-6 w-6 text-[#f0c36e]" />
              <h2 className="mt-4 text-lg font-semibold">Production-ready stack</h2>
              <p className="mt-2 text-sm text-stone-300">
                Next.js, Express, MongoDB, Firebase Auth, and OpenRouter are wired for deployment.
              </p>
            </article>
          </div>
        </section>

        <section className="flex items-center">
          <div className="glass-panel w-full max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold">
                  {mode === "signin" ? "Sign in to continue" : "Create your account"}
                </h2>
              </div>
              <button
                type="button"
                className="chip"
                onClick={() => setMode((current) => (current === "signin" ? "signup" : "signin"))}
              >
                {mode === "signin" ? "Need an account?" : "Have an account?"}
              </button>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="form-label">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="form-input"
                  placeholder="athlete@fitcoach.ai"
                />
              </label>

              <label className="block">
                <span className="form-label">Password</span>
                <input
                  required
                  minLength={6}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="form-input"
                  placeholder="Minimum 6 characters"
                />
              </label>

              {(localError || authError) && (
                <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {localError || authError}
                </p>
              )}

              <button type="submit" disabled={submitting} className="primary-button w-full">
                {submitting
                  ? "Working..."
                  : mode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4 text-sm text-stone-400">
              <div className="h-px flex-1 bg-white/10" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button type="button" onClick={handleGoogleSignIn} className="secondary-button w-full">
              Continue with Google
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-6 text-sm leading-7 text-stone-400">
              After your first login, you&apos;ll set a unique username, choose an avatar, and
              lock in your weekly goal before entering the dashboard.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
