"use client";

import { useEffect, useState } from "react";

const LOADING_QUOTES = [
  "Preparing your fitness insights...",
  "Champions are made in moments like this...",
  "Pulling together your streak, points, and momentum...",
  "Lining up your next win with AI coaching...",
];

export const LoadingScreen = ({ label = "Loading FitCoach AI" }: { label?: string }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % LOADING_QUOTES.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#154d43_0%,#0b1816_42%,#050807_100%)] px-6 py-12 text-stone-50">
      <div className="hero-orb hero-orb-left" />
      <div className="hero-orb hero-orb-right" />
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <div className="glass-panel max-w-2xl text-center">
          <p className="eyebrow">FitCoach AI</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{label}</h1>
          <p className="loading-quote mt-8 text-lg text-stone-200">{LOADING_QUOTES[quoteIndex]}</p>
          <div className="mt-10 flex justify-center gap-3">
            <span className="h-3 w-3 animate-bounce rounded-full bg-[#f0c36e]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-[#ff8f6b] [animation-delay:200ms]" />
            <span className="h-3 w-3 animate-bounce rounded-full bg-[#7df0c4] [animation-delay:400ms]" />
          </div>
        </div>
      </div>
    </div>
  );
};
