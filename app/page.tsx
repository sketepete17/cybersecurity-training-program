"use client";

import { useState, useCallback } from "react";
import { useGameRoom } from "@/hooks/use-game-room";
import { JoinScreen } from "@/components/cyber-clash/join-screen";
import { LobbyScreen } from "@/components/cyber-clash/lobby-screen";
import { GameScreen } from "@/components/cyber-clash/game-screen";
import { GameOverScreen } from "@/components/cyber-clash/game-over-screen";

export default function CyberShieldPage() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const { room, sendAction } = useGameRoom({
    roomId,
    playerId,
    enabled: !!roomId && !!playerId,
  });

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
    (isPhishing: boolean) => {
      if (!room) return;
      sendAction("submit_answer", {
        questionIndex: room.currentQuestion,
        answer: isPhishing,
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

  const handlePlayAgain = useCallback(() => {
    sendAction("reset");
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
        />
      )}
    </main>
  );
}
