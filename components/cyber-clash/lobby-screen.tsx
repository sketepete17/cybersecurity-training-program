"use client";

import { useEffect, useState } from "react";
import { Bot, User, Loader2, Sparkles } from "lucide-react";
import type { Player } from "@/lib/cyber-clash-store";
import { cn } from "@/lib/utils";

interface LobbyScreenProps {
  players: Player[];
  myPlayerId: string | null;
  countdown: number | null;
  onStart: () => void;
}

const AVATAR_COLORS = ["#00E5FF", "#FF2D78", "#39FF14", "#FFB800", "#A855F7", "#FF6B35"];

export function LobbyScreen({ players, myPlayerId, countdown, onStart }: LobbyScreenProps) {
  const [displayCountdown, setDisplayCountdown] = useState(countdown ?? 5);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (displayCountdown <= 0) {
      onStart();
      return;
    }
    const timer = setTimeout(() => setDisplayCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [displayCountdown, onStart]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8" style={{ background: "var(--cc-dark)" }}>
      {/* Background pulse */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, rgba(0,229,255,0.06) 0%, transparent 60%)",
      }} />

      <div className={cn(
        "relative z-10 w-full max-w-lg transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 flex justify-center">
            <Sparkles className="h-10 w-10 animate-float" style={{ color: "var(--cc-cyan)" }} />
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tight" style={{ color: "#fff" }}>
            GET READY
          </h2>
          <p className="mt-2 text-lg font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
            Players are locked in
          </p>
        </div>

        {/* Player list */}
        <div className="mb-10 flex flex-col gap-3">
          {players.map((player, i) => {
            const isMe = player.id === myPlayerId;
            const isBot = player.id.startsWith("bot-");
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];

            return (
              <div
                key={player.id}
                className="animate-slide-in-left flex items-center gap-4 rounded-2xl border-[3px] px-5 py-4"
                style={{
                  background: isMe ? `${color}10` : "var(--cc-card)",
                  borderColor: isMe ? color : "rgba(255,255,255,0.06)",
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {/* Avatar */}
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-black"
                  style={{
                    background: color,
                    color: "var(--cc-dark)",
                    boxShadow: `0 0 20px ${color}40`,
                  }}
                >
                  {isBot ? <Bot className="h-7 w-7" /> : <User className="h-7 w-7" />}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-lg font-black" style={{ color: isMe ? color : "#fff" }}>
                    {player.name}
                    {isMe && (
                      <span
                        className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                        style={{ background: `${color}20`, color }}
                      >
                        YOU
                      </span>
                    )}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {isBot ? "AI Opponent" : "Player"}
                  </p>
                </div>

                {/* Player number */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black"
                  style={{ background: `${color}15`, color }}
                >
                  #{i + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex h-32 w-32 items-center justify-center">
            {/* Ring */}
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="var(--cc-cyan)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(displayCountdown / 5) * 264} 264`}
                style={{ transition: "stroke-dasharray 1s linear", filter: "drop-shadow(0 0 8px rgba(0,229,255,0.5))" }}
              />
            </svg>
            <span
              className="text-6xl font-black tabular-nums animate-countdown-pulse"
              style={{ color: "var(--cc-cyan)" }}
            >
              {displayCountdown}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--cc-cyan)" }} />
            <span className="text-sm font-black uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Starting game...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
