"use client";

import { useEffect, useState, useCallback } from "react";
import { Copy, Check, Users, Zap, Shield, Crown, Loader2 } from "lucide-react";
import type { GameRoom } from "@/lib/game-room";

const AVATAR_COLORS = ["#00E5FF", "#FF2D78", "#39FF14", "#FFB800", "#A855F7", "#F97316", "#06B6D4", "#EC4899"];

interface LobbyScreenProps {
  room: GameRoom;
  playerId: string;
  isHost: boolean;
  onStartCountdown: () => void;
  onStartGame: () => void;
}

export function LobbyScreen({ room, playerId, isHost, onStartCountdown, onStartGame }: LobbyScreenProps) {
  const [copied, setCopied] = useState(false);
  const [countdownDisplay, setCountdownDisplay] = useState<number | null>(null);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [room.id]);

  // Handle countdown state
  useEffect(() => {
    if (room.status === "countdown" && room.countdownEndsAt) {
      const tick = () => {
        const remaining = Math.max(0, Math.ceil((room.countdownEndsAt! - Date.now()) / 1000));
        setCountdownDisplay(remaining);
        if (remaining <= 0) {
          onStartGame();
        }
      };
      tick();
      const interval = setInterval(tick, 200);
      return () => clearInterval(interval);
    } else {
      setCountdownDisplay(null);
    }
  }, [room.status, room.countdownEndsAt, onStartGame]);

  const isCountdown = room.status === "countdown";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4" style={{ background: "var(--cc-dark)" }}>
      {/* Background */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(0,229,255,0.04) 0%, transparent 60%)",
      }} />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8">
        {/* Room code card */}
        <div className="flex w-full flex-col items-center gap-3">
          <p className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
            Room Code
          </p>
          <button
            onClick={copyCode}
            className="group flex items-center gap-4 rounded-2xl border-[3px] px-8 py-5 transition-all duration-200 hover:border-[#00E5FF]"
            style={{ borderColor: "rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.06)" }}
            aria-label={`Copy room code ${room.id}`}
          >
            <span className="text-4xl font-black tracking-[0.3em]" style={{ color: "#00E5FF" }}>
              {room.id}
            </span>
            {copied ? (
              <Check className="h-6 w-6" style={{ color: "#39FF14" }} />
            ) : (
              <Copy className="h-6 w-6 transition-transform group-hover:scale-110" style={{ color: "rgba(255,255,255,0.4)" }} />
            )}
          </button>
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>
            {copied ? "Copied!" : "Share this code with other players"}
          </p>
        </div>

        {/* Player list */}
        <div className="w-full">
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" style={{ color: "#00E5FF" }} />
            <h2 className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
              Players ({room.players.length}/12)
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {room.players.map((player, i) => {
              const isMe = player.id === playerId;
              const isPlayerHost = player.id === room.hostId;
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length];

              return (
                <div
                  key={player.id}
                  className="animate-slide-in-left flex items-center gap-4 rounded-2xl border-[3px] px-5 py-4"
                  style={{
                    background: isMe ? `${color}10` : "var(--cc-card)",
                    borderColor: isMe ? `${color}40` : "rgba(255,255,255,0.06)",
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-black"
                    style={{ background: color, color: "var(--cc-dark)" }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-black" style={{ color: isMe ? color : "#fff" }}>
                        {player.name}
                      </p>
                      {isMe && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                          style={{ background: `${color}20`, color }}>
                          You
                        </span>
                      )}
                      {isPlayerHost && (
                        <Crown className="h-4 w-4" style={{ color: "#FFB800" }} />
                      )}
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {isPlayerHost ? "Host" : "Player"}
                    </p>
                  </div>

                  {/* Status dot */}
                  <div className="flex h-3 w-3 rounded-full" style={{ background: "#39FF14", boxShadow: "0 0 8px rgba(57,255,20,0.5)" }} />
                </div>
              );
            })}

            {/* Waiting for more */}
            {room.players.length < 2 && (
              <div
                className="flex items-center justify-center gap-3 rounded-2xl border-[3px] border-dashed px-5 py-6"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
              >
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: "rgba(255,255,255,0.25)" }} />
                <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Waiting for players to join...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Countdown or Start button */}
        {isCountdown && countdownDisplay !== null ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none" stroke="#00E5FF" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(countdownDisplay / 5) * 264} 264`}
                  style={{ transition: "stroke-dasharray 0.3s linear", filter: "drop-shadow(0 0 8px rgba(0,229,255,0.5))" }}
                />
              </svg>
              <span className="text-5xl font-black tabular-nums animate-countdown-pulse" style={{ color: "#00E5FF" }}>
                {countdownDisplay}
              </span>
            </div>
            <p className="text-sm font-black tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
              Game starting...
            </p>
          </div>
        ) : isHost ? (
          <button
            onClick={onStartCountdown}
            disabled={room.players.length < 1}
            className="jackbox-btn flex w-full max-w-xs items-center justify-center gap-3 rounded-2xl border-[3px] px-6 py-5 text-xl disabled:opacity-40"
            style={{ borderColor: "#39FF14", background: "rgba(57,255,20,0.1)", color: "#39FF14" }}
          >
            <Zap className="h-6 w-6" />
            Start Game
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#00E5FF" }} />
              <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                Waiting for host to start the game...
              </p>
            </div>
          </div>
        )}

        {/* Branding */}
        <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.15)" }}>
          <Shield className="h-4 w-4" />
          <span className="text-xs font-bold tracking-widest uppercase">CyberShield</span>
        </div>
      </div>
    </div>
  );
}
