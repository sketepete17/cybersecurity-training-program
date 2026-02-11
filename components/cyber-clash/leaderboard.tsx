"use client";

import { Trophy, TrendingUp, Bot, User } from "lucide-react";
import type { Player } from "@/lib/cyber-clash-store";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  players: Player[];
  myPlayerId: string | null;
  compact?: boolean;
}

export function Leaderboard({ players, myPlayerId, compact = false }: LeaderboardProps) {
  const sorted = [...players].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.joinOrder - b.joinOrder;
  });

  return (
    <div className={cn(
      "rounded-2xl border-2 border-border bg-card overflow-hidden",
      compact ? "w-full" : "w-full"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b-2 border-border px-5 py-3 bg-secondary/30">
        <Trophy className="h-5 w-5 text-[#ffcc00]" />
        <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
          Leaderboard
        </h3>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {sorted.map((player, index) => {
          const isMe = player.id === myPlayerId;
          const isBot = player.id.startsWith("bot-");
          const rank = index + 1;

          return (
            <div
              key={player.id}
              className={cn(
                "flex items-center gap-3 px-5 py-3 transition-all duration-300",
                index < sorted.length - 1 && "border-b border-border/50",
                isMe && "bg-[#00ff88]/5"
              )}
            >
              {/* Rank */}
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black",
                rank === 1 && "bg-[#ffcc00]/20 text-[#ffcc00]",
                rank === 2 && "bg-muted text-muted-foreground",
                rank === 3 && "bg-[#cd7f32]/20 text-[#cd7f32]",
                rank > 3 && "bg-secondary text-muted-foreground"
              )}>
                {rank}
              </div>

              {/* Avatar */}
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                isMe ? "bg-[#00ff88]/20" : "bg-secondary"
              )}>
                {isBot ? (
                  <Bot className={cn("h-4 w-4", isMe ? "text-[#00ff88]" : "text-muted-foreground")} />
                ) : (
                  <User className={cn("h-4 w-4", isMe ? "text-[#00ff88]" : "text-muted-foreground")} />
                )}
              </div>

              {/* Name */}
              <span className={cn(
                "flex-1 truncate font-bold text-sm",
                isMe ? "text-[#00ff88]" : "text-foreground"
              )}>
                {player.name}
                {isMe && !compact && (
                  <span className="ml-1 text-xs opacity-60">(You)</span>
                )}
              </span>

              {/* Score */}
              <div className="flex items-center gap-1">
                <TrendingUp className={cn(
                  "h-3.5 w-3.5",
                  isMe ? "text-[#00ff88]" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "font-black text-sm tabular-nums",
                  isMe ? "text-[#00ff88]" : "text-foreground"
                )}>
                  {player.score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
