"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGameRoom } from "@/hooks/use-game-room";
import { JoinScreen } from "@/components/cyber-clash/join-screen";
import { LobbyScreen } from "@/components/cyber-clash/lobby-screen";
import { GameScreen } from "@/components/cyber-clash/game-screen";
import { GameOverScreen } from "@/components/cyber-clash/game-over-screen";
import { LogOut } from "lucide-react";

const SESSION_KEY_ROOM = "cybershield_roomId";
const SESSION_KEY_PLAYER = "cybershield_playerId";

function getSessionValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export default function CyberShieldPage() {
  const [roomId, setRoomId] = useState<string | null>(() => getSessionValue(SESSION_KEY_ROOM));
  const [playerId, setPlayerId] = useState<string | null>(() => getSessionValue(SESSION_KEY_PLAYER));
  // Persist roomId and playerId to sessionStorage
  useEffect(() => {
    try {
      if (roomId) {
        sessionStorage.setItem(SESSION_KEY_ROOM, roomId);
      } else {
        sessionStorage.removeItem(SESSION_KEY_ROOM);
      }
      if (playerId) {
        sessionStorage.setItem(SESSION_KEY_PLAYER, playerId);
      } else {
        sessionStorage.removeItem(SESSION_KEY_PLAYER);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, [roomId, playerId]);

  const { room, error, sendAction, departedPlayers, dismissDeparted } = useGameRoom({
    roomId,
    playerId,
    enabled: !!roomId && !!playerId,
  });

  // If we restored from session but room no longer exists, clear state and go to join
  useEffect(() => {
    if (error && roomId && playerId) {
      setRoomId(null);
      setPlayerId(null);
    }
  }, [error, roomId, playerId]);

  // Auto-dismiss departure toasts after 4 seconds
  useEffect(() => {
    if (departedPlayers.length === 0) return;
    const timers = departedPlayers.map((d) =>
      setTimeout(() => dismissDeparted(d.id), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [departedPlayers, dismissDeparted]);

  const isHost = room ? room.hostId === playerId : false;

  const handleCreated = useCallback((newRoomId: string, newPlayerId: string) => {
    setRoomId(newRoomId);
    setPlayerId(newPlayerId);
  }, []);

  const handleJoined = useCallback((newRoomId: string, newPlayerId: string) => {
    setRoomId(newRoomId);
    setPlayerId(newPlayerId);
  }, []);

  const handleStartCountdown = useCallback(() => {
    sendAction("start_countdown");
  }, [sendAction]);

  const handleStartGame = useCallback(() => {
    sendAction("start_game");
  }, [sendAction]);

  const handleAnswer = useCallback(
    (answer: number) => {
      if (!room) return;
      sendAction("submit_answer", {
        questionIndex: room.currentQuestion,
        answer,
      });
    },
    [sendAction, room]
  );

  const handleBattleSubmit = useCallback(
    (password: string) => {
      if (!room) return;
      sendAction("battle_submit", {
        questionIndex: room.currentQuestion,
        password,
      });
    },
    [sendAction, room]
  );

  const handleShowResults = useCallback(() => {
    sendAction("show_results");
  }, [sendAction]);

  const handleNextQuestion = useCallback(() => {
    sendAction("next_question");
  }, [sendAction]);

  // Safety net: if stuck on showing_results for too long and we're host, auto-advance
  const staleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (staleTimerRef.current) { clearTimeout(staleTimerRef.current); staleTimerRef.current = null; }
    if (room?.status === "showing_results" && isHost) {
      staleTimerRef.current = setTimeout(() => {
        sendAction("next_question");
      }, 12000);
    }
    return () => { if (staleTimerRef.current) clearTimeout(staleTimerRef.current); };
  }, [room?.status, room?.currentQuestion, isHost, sendAction]);

  const handlePlayAgain = useCallback(() => {
    sendAction("reset");
  }, [sendAction]);

  const handleLeave = useCallback(async () => {
    await sendAction("leave");
    setRoomId(null);
    setPlayerId(null);
    try {
      sessionStorage.removeItem(SESSION_KEY_ROOM);
      sessionStorage.removeItem(SESSION_KEY_PLAYER);
    } catch {
      // ignore
    }
  }, [sendAction]);

  // No room yet -- show join screen
  if (!room || !roomId || !playerId) {
    return (
      <main id="main-content" className="min-h-dvh" style={{ background: "var(--cc-dark)" }}>
        <JoinScreen onCreated={handleCreated} onJoined={handleJoined} />
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-dvh" style={{ background: "var(--cc-dark)" }}>
      {/* Waiting / Countdown */}
      {(room.status === "waiting" || room.status === "countdown") && (
        <LobbyScreen
          room={room}
          playerId={playerId}
          isHost={isHost}
          onStartCountdown={handleStartCountdown}
          onStartGame={handleStartGame}
        />
      )}

      {/* Playing / Showing Results */}
      {(room.status === "playing" || room.status === "showing_results") && (
        <GameScreen
          room={room}
          playerId={playerId}
          isHost={isHost}
          onAnswer={handleAnswer}
          onBattleSubmit={handleBattleSubmit}
          onShowResults={handleShowResults}
          onNextQuestion={handleNextQuestion}
        />
      )}

      {/* Game Over */}
      {room.status === "game_over" && (
        <GameOverScreen
          players={room.players}
          myPlayerId={playerId}
          isHost={isHost}
          onPlayAgain={handlePlayAgain}
          onLeave={handleLeave}
        />
      )}

      {/* Player departure toasts */}
      {departedPlayers.length > 0 && (
        <div className="fixed top-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 sm:top-6">
          {departedPlayers.map((d) => (
            <div
              key={d.id}
              className="animate-pop-in flex items-center gap-3 rounded-2xl border-[3px] px-4 py-3 shadow-2xl sm:px-5 sm:py-4"
              style={{
                background: "rgba(11,15,26,0.97)",
                borderColor: "rgba(255,45,120,0.4)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 0 30px rgba(255,45,120,0.15), 0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(255,45,120,0.15)" }}>
                <LogOut className="h-4 w-4" style={{ color: "#FF2D78" }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black" style={{ color: "#fff" }}>
                  <span style={{ color: "#FF2D78" }}>{d.name}</span>{" left the game"}
                </p>
                <p className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>Player disconnected</p>
              </div>
              <button
                onClick={() => dismissDeparted(d.id)}
                className="shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider transition-all duration-200 hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
                aria-label={`Dismiss notification for ${d.name}`}
              >
                OK
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
