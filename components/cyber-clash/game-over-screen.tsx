"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, RotateCcw, ArrowLeft, Crown, Bot, User, Star } from "lucide-react";
import Link from "next/link";
import type { Player } from "@/lib/cyber-clash-store";
import { cn } from "@/lib/utils";

interface GameOverScreenProps {
  players: Player[];
  myPlayerId: string | null;
  onPlayAgain: () => void;
}

export function GameOverScreen({ players, myPlayerId, onPlayAgain }: GameOverScreenProps) {
  const [animateIn, setAnimateIn] = useState(false);
  const [showPlayers, setShowPlayers] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
    const t = setTimeout(() => setShowPlayers(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Players are already sorted by score
  const winner = players[0];
  const isWinner = winner?.id === myPlayerId;
  const myPlayer = players.find((p) => p.id === myPlayerId);
  const myRank = players.findIndex((p) => p.id === myPlayerId) + 1;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background celebration */}
      {isWinner && (
        <>
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,204,0,0.5) 0%, transparent 40%), radial-gradient(circle at 70% 80%, rgba(0,255,136,0.5) 0%, transparent 40%)",
          }} />
        </>
      )}

      <div className={cn(
        "w-full max-w-lg text-center transition-all duration-700",
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Trophy / Result */}
        <div className="mb-8">
          <div className="mb-6 flex justify-center">
            <div className={cn(
              "relative flex h-24 w-24 items-center justify-center rounded-3xl",
              isWinner
                ? "bg-[#ffcc00] shadow-[0_0_60px_rgba(255,204,0,0.3)]"
                : "bg-card border-2 border-border"
            )}>
              {isWinner ? (
                <Crown className="h-12 w-12 text-[#0a0e14]" />
              ) : (
                <Trophy className="h-12 w-12 text-[#ffcc00]" />
              )}
              {isWinner && (
                <>
                  <Star className="absolute -top-2 -left-2 h-6 w-6 text-[#ffcc00] animate-pulse" />
                  <Star className="absolute -top-1 -right-3 h-5 w-5 text-[#ffcc00] animate-pulse" style={{ animationDelay: "0.3s" }} />
                  <Star className="absolute -bottom-2 left-1/2 h-4 w-4 text-[#ffcc00] animate-pulse" style={{ animationDelay: "0.6s" }} />
                </>
              )}
            </div>
          </div>

          <h2 className="text-5xl font-black tracking-tight text-foreground mb-2">
            GAME OVER
          </h2>

          {isWinner ? (
            <p className="text-xl font-bold text-[#ffcc00]">
              You won! Champion of Cyber Clash!
            </p>
          ) : (
            <p className="text-lg font-bold text-muted-foreground">
              You placed <span className="text-[#00ff88] font-black">#{myRank}</span> with{" "}
              <span className="text-foreground font-black">{myPlayer?.score ?? 0}</span> points
            </p>
          )}
        </div>

        {/* Final Standings */}
        <div className={cn(
          "mb-8 overflow-hidden rounded-2xl border-2 border-border bg-card transition-all duration-700 delay-300",
          showPlayers ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center gap-3 border-b-2 border-border bg-secondary/30 px-5 py-3">
            <Medal className="h-5 w-5 text-[#ffcc00]" />
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              Final Standings
            </h3>
          </div>

          <div className="flex flex-col">
            {players.map((player, index) => {
              const isMe = player.id === myPlayerId;
              const isBot = player.id.startsWith("bot-");
              const rank = index + 1;
              const isTop = rank === 1;

              return (
                <div
                  key={player.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 transition-all duration-500",
                    index < players.length - 1 && "border-b border-border/50",
                    isMe && "bg-[#00ff88]/5",
                    isTop && "bg-[#ffcc00]/5"
                  )}
                  style={{
                    transitionDelay: showPlayers ? `${index * 100}ms` : "0ms",
                    opacity: showPlayers ? 1 : 0,
                    transform: showPlayers ? "translateX(0)" : "translateX(-20px)",
                  }}
                >
                  {/* Rank badge */}
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black",
                    rank === 1 && "bg-[#ffcc00]/20 text-[#ffcc00]",
                    rank === 2 && "bg-muted text-foreground",
                    rank === 3 && "bg-[#cd7f32]/20 text-[#cd7f32]",
                    rank > 3 && "bg-secondary text-muted-foreground"
                  )}>
                    {rank === 1 ? <Crown className="h-5 w-5" /> : `#${rank}`}
                  </div>

                  {/* Player avatar */}
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    isMe ? "bg-[#00ff88]/20" : "bg-secondary"
                  )}>
                    {isBot ? (
                      <Bot className={cn("h-5 w-5", isMe ? "text-[#00ff88]" : "text-muted-foreground")} />
                    ) : (
                      <User className={cn("h-5 w-5", isMe ? "text-[#00ff88]" : "text-foreground")} />
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-bold truncate",
                      isMe ? "text-[#00ff88]" : "text-foreground"
                    )}>
                      {player.name}
                      {isMe && <span className="ml-1 text-xs opacity-60">(You)</span>}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className={cn(
                      "text-lg font-black tabular-nums",
                      rank === 1 ? "text-[#ffcc00]" : isMe ? "text-[#00ff88]" : "text-foreground"
                    )}>
                      {player.score}
                    </p>
                    <p className="text-xs text-muted-foreground">pts</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-3 rounded-2xl bg-[#00ff88] px-6 py-5 text-xl font-black uppercase tracking-wider text-[#0a0e14] transition-all duration-200 hover:shadow-[0_0_40px_rgba(0,255,136,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="h-6 w-6" />
            Play Again
          </button>
          <Link
            href="/ctf"
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card px-6 py-4 text-sm font-bold uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:border-[#00ff88]/30 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Training
          </Link>
        </div>
      </div>
    </div>
  );
}
