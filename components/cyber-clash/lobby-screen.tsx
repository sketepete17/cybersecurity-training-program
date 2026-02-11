"use client";

import { useEffect, useState } from "react";
import { Users, Bot, User, Loader2 } from "lucide-react";
import type { Player } from "@/lib/cyber-clash-store";
import { cn } from "@/lib/utils";

interface LobbyScreenProps {
  players: Player[];
  myPlayerId: string | null;
  countdown: number | null;
  onStart: () => void;
}

export function LobbyScreen({ players, myPlayerId, countdown, onStart }: LobbyScreenProps) {
  const [displayCountdown, setDisplayCountdown] = useState(countdown ?? 5);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  useEffect(() => {
    if (displayCountdown <= 0) {
      onStart();
      return;
    }
    const timer = setTimeout(() => {
      setDisplayCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [displayCountdown, onStart]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background pulse */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(0,255,136,0.3) 0%, transparent 50%)",
      }} />

      <div className={cn(
        "w-full max-w-lg text-center transition-all duration-700",
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ff88]/10 border-2 border-[#00ff88]/30">
              <Users className="h-8 w-8 text-[#00ff88]" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-foreground tracking-tight">
            GAME LOBBY
          </h2>
          <p className="mt-2 text-muted-foreground font-medium">
            Players are joining...
          </p>
        </div>

        {/* Player cards */}
        <div className="mb-8 flex flex-col gap-3">
          {players.map((player, i) => {
            const isMe = player.id === myPlayerId;
            const isBot = player.id.startsWith("bot-");
            return (
              <div
                key={player.id}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-all duration-500",
                  isMe
                    ? "border-[#00ff88] bg-[#00ff88]/5 shadow-[0_0_20px_rgba(0,255,136,0.1)]"
                    : "border-border bg-card"
                )}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl font-black text-lg",
                  isMe ? "bg-[#00ff88] text-[#0a0e14]" : "bg-secondary text-foreground"
                )}>
                  {isBot ? <Bot className="h-6 w-6" /> : <User className="h-6 w-6" />}
                </div>
                <div className="flex-1 text-left">
                  <p className={cn(
                    "font-bold text-lg",
                    isMe ? "text-[#00ff88]" : "text-foreground"
                  )}>
                    {player.name}
                    {isMe && (
                      <span className="ml-2 text-xs font-bold uppercase tracking-wider text-[#00ff88] opacity-70">
                        (You)
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isBot ? "AI Opponent" : "Player"}
                  </p>
                </div>
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-black",
                  isMe ? "bg-[#00ff88]/20 text-[#00ff88]" : "bg-secondary text-muted-foreground"
                )}>
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-28 w-28 items-center justify-center">
            {/* Circular countdown ring */}
            <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-border"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-[#00ff88]"
                strokeDasharray={`${(displayCountdown / 5) * 283} 283`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s linear" }}
              />
            </svg>
            <span className="text-5xl font-black text-foreground">
              {displayCountdown}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-semibold text-sm uppercase tracking-wider">
              Game starting...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
