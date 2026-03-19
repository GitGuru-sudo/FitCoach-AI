"use client";

import { AuthPanel } from "@/components/auth-panel";
import { DashboardShell } from "@/components/dashboard-shell";
import { LoadingScreen } from "@/components/loading-screen";
import { ProfileSetup } from "@/components/profile-setup";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { authError, authLoading, firebaseReady, firebaseUser, profile, profileLoading } = useAuth();

  if (!firebaseReady) {
    return (
      <div className="min-h-screen bg-[#08100e] px-6 py-10 text-stone-50">
        <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/6 p-8">
          <p className="eyebrow">Configuration required</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Add your Firebase config to continue.</h1>
          <p className="mt-4 text-base leading-8 text-stone-300">
            Set <code>NEXT_PUBLIC_FIREBASE_CONFIG</code> in{" "}
            <code>frontend/.env.local</code> and restart the dev server. The frontend reads this
            config as a JSON string.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading || (firebaseUser && profileLoading)) {
    return <LoadingScreen label="Preparing your athlete workspace" />;
  }

  if (!firebaseUser) {
    return <AuthPanel />;
  }

  if (!profile?.username || !profile.avatar) {
    return <ProfileSetup />;
  }

  return (
    <>
      {authError ? (
        <div className="fixed inset-x-0 top-0 z-50 mx-auto max-w-3xl px-4 pt-4">
          <div className="rounded-full border border-red-500/25 bg-red-500/90 px-4 py-3 text-center text-sm text-white shadow-lg">
            {authError}
          </div>
        </div>
      ) : null}
      <DashboardShell />
    </>
  );
}
