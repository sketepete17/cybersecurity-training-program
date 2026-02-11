"use client";

import { useEffect, useState, useMemo } from "react";
import { Trophy, RotateCcw, Crown, Bot, User, Star, Medal, Sparkles } from "lucide-react";
import type { Player } from "@/lib/cyber-clash-store";
import { cn } from "@/lib/utils";

interface GameOverScreenProps {
  players: Player[];
  myPlayerId: string | null;
  onPlayAgain: () => void;
}

const AVATAR_COLORS = ["#00E5FF", "#FF2D78", "#39FF14", "#FFB800", "#A855F7", "#FF6B35"];
const RANK_COLORS = ["#FFB800", "#A0AEC0", "#CD7F32"];

function ConfettiPiece({ delay, color, left }: { delay: number; color: string; left: number }) {
  return (
    <div
      className="pointer-events-none absolute top-0 h-3 w-3 rounded-sm"
      style={{
        left: `${left}%`,
        background: color,
        animation: `confetti-fall ${2 + Math.random() * 2}s linear ${delay}s infinite`,
        opacity: 0.7,
      }}
    />
  );
}

export function GameOverScreen({ players, myPlayerId, onPlayAgain }: GameOverScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setShowPlayers(true), 500);
    return () => clearTimeout(t);
  }, []);

  const winner = players[0];
  const isWinner = winner?.id === myPlayerId;
  const myPlayer = players.find((p) => p.id === myPlayerId);
  const myRank = players.findIndex((p) => p.id === myPlayerId) + 1;

  const confettiPieces = useMemo(() => {
    const pieces = [];
    const colors = ["#00E5FF", "#FF2D78", "#39FF14", "#FFB800", "#A855F7"];
    for (let i = 0; i < 30; i++) {
      pieces.push({
        delay: Math.random() * 3,
        color: colors[i % colors.length],
        left: Math.random() * 100,
      });
    }
    return pieces;
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8" style={{ background: "var(--cc-dark)" }}>
      {/* Confetti */}
      {isWinner && confettiPieces.map((piece, i) => (
        <ConfettiPiece key={i} {...piece} />
      ))}

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: isWinner
          ? "radial-gradient(ellipse at 50% 30%, rgba(255,184,0,0.08) 0%, transparent 50%)"
          : "radial-gradient(ellipse at 50% 30%, rgba(0,229,255,0.06) 0%, transparent 50%)",
      }} />

      <div className={cn(
        "relative z-10 w-full max-w-lg transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Trophy / Result */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div
                className="flex h-28 w-28 items-center justify-center rounded-[2rem]"
                style={{
                  background: isWinner ? "var(--cc-amber)" : "var(--cc-card)",
                  border: isWinner ? "none" : "3px solid rgba(255,255,255,0.08)",
                  boxShadow: isWinner ? "0 0 60px rgba(255,184,0,0.4)" : "none",
                }}
              >
                {isWinner ? (
                  <Crown className="h-14 w-14" style={{ color: "var(--cc-dark)" }} />
                ) : (
                  <Trophy className="h-14 w-14" style={{ color: "var(--cc-amber)" }} />
                )}
              </div>
              {isWinner && (
                <>
                  <Star className="absolute -top-3 -left-3 h-7 w-7 animate-float" style={{ color: "var(--cc-amber)", animationDelay: "0s" }} />
                  <Star className="absolute -top-1 -right-4 h-5 w-5 animate-float" style={{ color: "var(--cc-cyan)", animationDelay: "0.5s" }} />
                  <Sparkles className="absolute -bottom-2 left-1/2 h-5 w-5 animate-float" style={{ color: "var(--cc-magenta)", animationDelay: "1s" }} />
                </>
              )}
            </div>
          </div>

          <h2 className="text-6xl font-black uppercase tracking-tighter" style={{ color: "#fff" }}>
            GAME
            <br />
            <span style={{ color: isWinner ? "var(--cc-amber)" : "var(--cc-cyan)" }}>OVER</span>
          </h2>

          {isWinner ? (
            <p className="mt-3 text-xl font-black uppercase tracking-wider" style={{ color: "var(--cc-amber)" }}>
              You are the champion!
            </p>
          ) : (
            <p className="mt-3 text-lg font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
              You placed <span className="font-black" style={{ color: "var(--cc-cyan)" }}>#{myRank}</span> with{" "}
              <span className="font-black" style={{ color: "#fff" }}>{myPlayer?.score ?? 0}</span> points
            </p>
          )}
        </div>

        {/* Final Standings */}
        <div
          className={cn(
            "mb-8 overflow-hidden rounded-3xl border-[3px] transition-all duration-700",
            showPlayers ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
          style={{
            background: "var(--cc-card)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: "3px solid rgba(255,255,255,0.06)" }}
          >
            <Medal className="h-5 w-5" style={{ color: "var(--cc-amber)" }} />
            <h3 className="text-xs font-black uppercase tracking-[0.15em]" style={{ color: "#fff" }}>
              Final Standings
            </h3>
          </div>

          <div className="flex flex-col">
            {players.map((player, index) => {
              const isMe = player.id === myPlayerId;
              const isBot = player.id.startsWith("bot-");
              const rank = index + 1;
              const color = AVATAR_COLORS[players.indexOf(player) % AVATAR_COLORS.length];
              const rankColor = RANK_COLORS[index] ?? "rgba(255,255,255,0.3)";

              return (
                <div
                  key={player.id}
                  className="flex items-center gap-4 px-6 py-4 transition-all duration-500"
                  style={{
                    background: rank === 1 ? "rgba(255,184,0,0.04)" : isMe ? `${color}06` : "transparent",
                    borderBottom: index < players.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    transitionDelay: showPlayers ? `${index * 100}ms` : "0ms",
                    opacity: showPlayers ? 1 : 0,
                    transform: showPlayers ? "translateX(0)" : "translateX(-20px)",
                  }}
                >
                  {/* Rank */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                    style={{
                      background: rank <= 3 ? `${rankColor}20` : "rgba(255,255,255,0.04)",
                      color: rank <= 3 ? rankColor : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {rank === 1 ? <Crown className="h-5 w-5" /> : `#${rank}`}
                  </div>

                  {/* Avatar */}
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: `${color}15` }}
                  >
                    {isBot ? (
                      <Bot className="h-5 w-5" style={{ color }} />
                    ) : (
                      <User className="h-5 w-5" style={{ color }} />
                    )}
                  </div>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black" style={{ color: isMe ? color : "#fff" }}>
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
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p
                      className="text-xl font-black tabular-nums"
                      style={{ color: rank === 1 ? "var(--cc-amber)" : isMe ? color : "#fff" }}
                    >
                      {player.score}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                      pts
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="jackbox-btn flex items-center justify-center gap-3 rounded-2xl px-6 py-5 text-xl"
            style={{
              background: "var(--cc-cyan)",
              color: "var(--cc-dark)",
              boxShadow: "0 4px 30px rgba(0,229,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <RotateCcw className="h-6 w-6" />
            PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
}
