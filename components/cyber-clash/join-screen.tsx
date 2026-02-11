"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Zap, Users, ChevronRight, Fish, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface JoinScreenProps {
  onJoin: (name: string) => void;
}

const PLAYER_COLORS = [
  "bg-[var(--cc-cyan)]",
  "bg-[var(--cc-magenta)]",
  "bg-[var(--cc-lime)]",
  "bg-[var(--cc-amber)]",
];

export function JoinScreen({ onJoin }: JoinScreenProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("You need a name to play!");
      return;
    }
    if (trimmed.length > 20) {
      setError("Keep it under 20 characters");
      return;
    }
    setError("");
    onJoin(trimmed);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8" style={{ background: "var(--cc-dark)" }}>
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />
        {/* Glow orbs */}
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full opacity-20" style={{ background: "radial-gradient(circle, var(--cc-cyan), transparent 70%)" }} />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full opacity-15" style={{ background: "radial-gradient(circle, var(--cc-magenta), transparent 70%)" }} />
        {/* Floating icons */}
        <Fish className="absolute top-[15%] left-[8%] h-8 w-8 animate-float opacity-10" style={{ color: "var(--cc-magenta)", animationDelay: "0s" }} />
        <ShieldCheck className="absolute top-[25%] right-[12%] h-6 w-6 animate-float opacity-10" style={{ color: "var(--cc-lime)", animationDelay: "1s" }} />
        <ShieldAlert className="absolute bottom-[20%] left-[15%] h-7 w-7 animate-float opacity-10" style={{ color: "var(--cc-cyan)", animationDelay: "0.5s" }} />
        <Zap className="absolute bottom-[30%] right-[8%] h-6 w-6 animate-float opacity-10" style={{ color: "var(--cc-amber)", animationDelay: "1.5s" }} />
      </div>

      {/* Main content */}
      <div className={cn(
        "relative z-10 flex w-full max-w-md flex-col items-center transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Logo / Icon */}
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-6">
            <div
              className="flex h-28 w-28 items-center justify-center rounded-[2rem] animate-glow-pulse"
              style={{ background: "var(--cc-cyan)", boxShadow: "0 0 60px rgba(0,229,255,0.3)" }}
            >
              <ShieldAlert className="h-14 w-14" style={{ color: "var(--cc-dark)" }} />
            </div>
            {/* Notification dot */}
            <div
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black animate-bounce-in"
              style={{ background: "var(--cc-magenta)", color: "#fff", animationDelay: "0.3s" }}
            >
              !
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-1 text-center text-7xl font-black uppercase leading-none tracking-tighter" style={{ color: "#fff" }}>
            CYBER
            <br />
            <span style={{ color: "var(--cc-cyan)" }}>CLASH</span>
          </h1>

          {/* Subtitle badge */}
          <div
            className="mt-4 rounded-full px-6 py-2 text-sm font-black uppercase tracking-[0.2em]"
            style={{
              background: "rgba(0,229,255,0.1)",
              border: "2px solid rgba(0,229,255,0.3)",
              color: "var(--cc-cyan)",
            }}
          >
            Phish or Legit?
          </div>

          <p className="mt-5 max-w-sm text-center text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Read suspicious emails. Spot the scams. Beat your opponents. Learn to protect yourself from cyber threats.
          </p>
        </div>

        {/* Join Card */}
        <div
          className="jackbox-card w-full p-8"
          style={{
            background: "var(--cc-card)",
            borderColor: "rgba(0,229,255,0.15)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="player-name" className="mb-2 block text-xs font-black uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                Your Player Name
              </label>
              <input
                id="player-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Enter your handle..."
                maxLength={20}
                className={cn(
                  "w-full rounded-2xl border-[3px] px-5 py-4 text-lg font-bold outline-none transition-all duration-200",
                  error ? "border-[var(--cc-magenta)]" : "border-transparent focus:border-[var(--cc-cyan)]"
                )}
                style={{
                  background: "var(--cc-card-light)",
                  color: "#fff",
                }}
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm font-bold" style={{ color: "var(--cc-magenta)" }} role="alert">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="jackbox-btn group flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-5 text-xl"
              style={{
                background: "var(--cc-cyan)",
                color: "var(--cc-dark)",
                boxShadow: "0 4px 30px rgba(0,229,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              <Zap className="h-6 w-6 transition-transform duration-200 group-hover:rotate-12" />
              JOIN GAME
              <ChevronRight className="h-6 w-6 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </form>
        </div>

        {/* Feature chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Users, label: "Multiplayer", color: "var(--cc-cyan)" },
            { icon: Zap, label: "Real-time", color: "var(--cc-amber)" },
            { icon: ShieldAlert, label: "7 Rounds", color: "var(--cc-lime)" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Fake player avatars */}
        <div className="mt-6 flex items-center gap-1">
          {PLAYER_COLORS.map((bgClass, i) => (
            <div
              key={i}
              className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-black", bgClass)}
              style={{ color: "var(--cc-dark)", marginLeft: i > 0 ? "-6px" : "0", animationDelay: `${i * 0.1}s` }}
            >
              {i + 1}
            </div>
          ))}
          <span className="ml-2 text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
            players waiting...
          </span>
        </div>
      </div>
    </div>
  );
}
