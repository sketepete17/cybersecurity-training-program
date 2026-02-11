"use client";

import { useReducer, useCallback } from "react";
import { gameReducer, getInitialState } from "@/lib/cyber-clash-store";
import { JoinScreen } from "@/components/cyber-clash/join-screen";
import { LobbyScreen } from "@/components/cyber-clash/lobby-screen";
import { GameScreen } from "@/components/cyber-clash/game-screen";
import { GameOverScreen } from "@/components/cyber-clash/game-over-screen";

export default function CyberClashPage() {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  const handleJoin = useCallback((name: string) => {
    dispatch({ type: "JOIN_GAME", name });
  }, []);

  const handleStart = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const handleAnswer = useCallback((answer: "phishing" | "legitimate") => {
    dispatch({ type: "SUBMIT_ANSWER", answer });
  }, []);

  const handleReveal = useCallback(() => {
    dispatch({ type: "REVEAL_RESULT" });
  }, []);

  const handleNext = useCallback(() => {
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const handleTick = useCallback(() => {
    dispatch({ type: "TICK" });
  }, []);

  const handlePlayAgain = useCallback(() => {
    dispatch({ type: "PLAY_AGAIN" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {state.screen === "join" && (
        <JoinScreen onJoin={handleJoin} />
      )}
      {state.screen === "lobby" && (
        <LobbyScreen
          players={state.players}
          myPlayerId={state.myPlayerId}
          countdown={state.gameStartCountdown}
          onStart={handleStart}
        />
      )}
      {state.screen === "playing" && (
        <GameScreen
          state={state}
          onAnswer={handleAnswer}
          onReveal={handleReveal}
          onNext={handleNext}
          onTick={handleTick}
        />
      )}
      {state.screen === "gameover" && (
        <GameOverScreen
          players={state.players}
          myPlayerId={state.myPlayerId}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </main>
  );
}
