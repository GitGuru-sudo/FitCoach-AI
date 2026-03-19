"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { Check } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { UPLOADED_AVATARS, getAllowedAvatar } from "@/lib/avatar-presets";
import type { CoachTone } from "@/types";

export const ProfileSetup = () => {
  const { saveProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(getAllowedAvatar());
  const [weeklyGoal, setWeeklyGoal] = useState(4);
  const [coachTone, setCoachTone] = useState<CoachTone>("balanced");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await saveProfile({
        username,
        avatar: selectedAvatar,
        weeklyGoal,
        coachTone,
      });
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#193f37_0%,#0a1211_50%,#050706_100%)] px-6 py-10 text-stone-50">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />
      <div className="mx-auto grid min-h-[85vh] max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="glass-panel flex flex-col justify-between">
          <div>
            <p className="eyebrow">First-time setup</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Build the profile your streak will grow from.
            </h1>
            <p className="mt-5 text-base leading-8 text-stone-300">
              Choose a globally unique username, pick one of the uploaded avatars, and set a
              weekly target that feels ambitious but sustainable.
            </p>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm uppercase tracking-[0.28em] text-stone-400">Your plan</p>
            <ul className="mt-4 space-y-3 text-sm text-stone-200">
              <li>10 points for every workout you log</li>
              <li>5-point streak bonus on consecutive days</li>
              <li>50-point weekly goal completion bonus</li>
            </ul>
          </div>
        </section>

        <form className="glass-panel" onSubmit={handleSave}>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="eyebrow">Avatar</p>
              <div className="mt-5 flex items-center gap-4">
                <img
                  src={selectedAvatar}
                  alt="Selected avatar"
                  className="h-24 w-24 rounded-[28px] object-cover"
                />
                <p className="max-w-xs text-sm leading-7 text-stone-300">
                  Only the uploaded app avatars are available here.
                </p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {UPLOADED_AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`relative overflow-hidden rounded-[26px] border p-2 ${
                      selectedAvatar === avatar
                        ? "border-[#7df0c4] bg-white/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <img src={avatar} alt="Preset avatar" className="h-full w-full rounded-[18px]" />
                    {selectedAvatar === avatar ? (
                      <span className="absolute right-3 top-3 rounded-full bg-[#7df0c4] p-1 text-black">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="form-label">Unique username</span>
                <input
                  required
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="form-input"
                  placeholder="fit_with_saksh"
                />
              </label>

              <label className="block">
                <span className="form-label">Weekly goal</span>
                <input
                  required
                  min={1}
                  max={14}
                  type="number"
                  value={weeklyGoal}
                  onChange={(event) => setWeeklyGoal(Number(event.target.value))}
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

              {error ? (
                <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </p>
              ) : null}

              <button type="submit" disabled={saving} className="primary-button w-full">
                {saving ? "Saving profile..." : "Enter Dashboard"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
