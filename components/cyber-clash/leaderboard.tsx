"use client";

import { Trophy, TrendingUp, Crown } from "lucide-react";
import type { Player } from "@/lib/game-room";

interface LeaderboardProps {
  players: Player[];
  myPlayerId: string;
  compact?: boolean;
}

const RANK_COLORS = ["#FFB800", "#A0AEC0", "#CD7F32"];
const AVATAR_COLORS = ["#00E5FF", "#FF2D78", "#39FF14", "#FFB800", "#A855F7", "#F97316", "#06B6D4", "#EC4899"];

export function Leaderboard({ players, myPlayerId, compact = false }: LeaderboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div
      className="overflow-hidden rounded-3xl border-[3px]"
      style={{ background: "var(--cc-card)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)" }}>
        <Trophy className="h-5 w-5" style={{ color: "#FFB800" }} />
        <h3 className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: "#fff" }}>Leaderboard</h3>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {sorted.map((player, index) => {
          const isMe = player.id === myPlayerId;
          const rank = index + 1;
          const originalIdx = players.findIndex((p) => p.id === player.id);
          const color = AVATAR_COLORS[originalIdx % AVATAR_COLORS.length];
          const rankColor = RANK_COLORS[index] ?? "rgba(255,255,255,0.3)";

          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 px-5 transition-all duration-300 ${compact ? "py-2.5" : "py-3"}`}
              style={{
                background: isMe ? `${color}08` : "transparent",
                borderBottom: index < sorted.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
              }}
            >
              {/* Rank */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                style={{
                  background: rank <= 3 ? `${rankColor}20` : "rgba(255,255,255,0.04)",
                  color: rank <= 3 ? rankColor : "rgba(255,255,255,0.3)",
                }}
              >
                {rank === 1 ? <Crown className="h-4 w-4" /> : rank}
              </div>

              {/* Avatar */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                style={{ background: `${color}20`, color }}
              >
                {player.name.charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <span className="flex-1 truncate text-sm font-bold" style={{ color: isMe ? color : "#fff" }}>
                {player.name}
                {isMe && !compact && (
                  <span className="ml-1 text-[10px] opacity-50">(You)</span>
                )}
              </span>

              {/* Streak */}
              {player.streak >= 2 && (
                <span className="text-[10px] font-black" style={{ color: "#FFB800" }}>
                  {player.streak}x
                </span>
              )}

              {/* Score */}
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" style={{ color: isMe ? color : "rgba(255,255,255,0.3)" }} />
                <span className="text-sm font-black tabular-nums" style={{ color: isMe ? color : "#fff" }}>
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
