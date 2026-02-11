"use client";

import { useState } from "react";
import { ShieldAlert, Zap, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface JoinScreenProps {
  onJoin: (name: string) => void;
}

export function JoinScreen({ onJoin }: JoinScreenProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isHovering, setIsHovering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your player name to join!");
      return;
    }
    if (trimmed.length > 20) {
      setError("Name must be 20 characters or less");
      return;
    }
    setError("");
    onJoin(trimmed);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* Floating particles */}
      <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-[#00ff88] opacity-20 animate-pulse" />
      <div className="absolute top-40 right-[15%] w-3 h-3 rounded-full bg-[#ff4466] opacity-15 animate-pulse" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-32 left-[20%] w-2 h-2 rounded-full bg-[#ffcc00] opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-48 right-[25%] w-2 h-2 rounded-full bg-[#00ff88] opacity-15 animate-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Logo / Title area */}
      <div className="mb-12 text-center relative z-10">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[#00ff88] shadow-[0_0_60px_rgba(0,255,136,0.3)]">
              <ShieldAlert className="h-12 w-12 text-[#0a0e14]" />
            </div>
            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#ff4466] animate-pulse" />
          </div>
        </div>
        <h1 className="text-6xl font-black tracking-tight text-foreground mb-2 leading-none">
          CYBER
          <span className="text-[#00ff88]"> CLASH</span>
        </h1>
        <p className="text-xl font-bold text-[#00ff88] tracking-widest uppercase mt-3">
          Phish or Legit?
        </p>
        <p className="mt-4 text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
          Read suspicious emails. Spot the phishing attacks. Outscore your opponents. Learn to protect yourself.
        </p>
      </div>

      {/* Join Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl border-2 border-border bg-card p-8 shadow-2xl shadow-[#00ff88]/5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label htmlFor="player-name" className="mb-2 block text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Player Name
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
                  "w-full rounded-2xl border-2 bg-background px-5 py-4 text-lg font-bold text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200",
                  error
                    ? "border-[#ff4466] focus:border-[#ff4466] focus:shadow-[0_0_20px_rgba(255,68,102,0.15)]"
                    : "border-border focus:border-[#00ff88] focus:shadow-[0_0_20px_rgba(0,255,136,0.15)]"
                )}
                autoComplete="off"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm font-semibold text-[#ff4466]" role="alert">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-[#00ff88] px-6 py-5 text-xl font-black uppercase tracking-wider text-[#0a0e14] transition-all duration-200 hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className={cn(
                "h-6 w-6 transition-transform duration-200",
                isHovering && "rotate-12 scale-110"
              )} />
              Join Game
              <ChevronRight className={cn(
                "h-6 w-6 transition-transform duration-200",
                isHovering && "translate-x-1"
              )} />
            </button>
          </form>
        </div>

        {/* Feature pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {[
            { icon: Users, label: "Multiplayer" },
            { icon: Zap, label: "Real-time" },
            { icon: ShieldAlert, label: "7 Rounds" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
            >
              <Icon className="h-4 w-4 text-[#00ff88]" />
              <span className="text-sm font-semibold text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
