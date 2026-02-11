"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Mail,
  Clock,
  Fish,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronRight,
  AlertTriangle,
  Lock,
} from "lucide-react";
import type { GameRoom } from "@/lib/game-room";
import { Leaderboard } from "./leaderboard";

interface GameScreenProps {
  room: GameRoom;
  playerId: string;
  isHost: boolean;
  onAnswer: (answer: boolean) => void;
  onShowResults: () => void;
  onNextQuestion: () => void;
}

export function GameScreen({ room, playerId, isHost, onAnswer, onShowResults, onNextQuestion }: GameScreenProps) {
  const question = room.questionSet[room.currentQuestion];
  const player = room.players.find((p) => p.id === playerId);
  const hasAnswered = player ? player.answers.length > room.currentQuestion : false;
  const [timeLeft, setTimeLeft] = useState(room.questionTimeLimit);
  const [localShowResult, setLocalShowResult] = useState(false);
  const autoShowRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoNextRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevQuestionRef = useRef(room.currentQuestion);

  // Reset state when question changes
  useEffect(() => {
    if (room.currentQuestion !== prevQuestionRef.current) {
      setLocalShowResult(false);
      prevQuestionRef.current = room.currentQuestion;
    }
  }, [room.currentQuestion]);

  // Track if the server says showing_results
  useEffect(() => {
    if (room.status === "showing_results") {
      setLocalShowResult(true);
    }
  }, [room.status]);

  // Timer countdown
  useEffect(() => {
    if (room.status !== "playing" || !room.questionStartedAt) return;
    const tick = () => {
      const elapsed = (Date.now() - room.questionStartedAt!) / 1000;
      const remaining = Math.max(0, Math.round(room.questionTimeLimit - elapsed));
      setTimeLeft(remaining);

      // Auto-show results when time runs out (host triggers it)
      if (remaining <= 0 && isHost && !localShowResult) {
        if (autoShowRef.current) clearTimeout(autoShowRef.current);
        autoShowRef.current = setTimeout(() => onShowResults(), 500);
      }
    };
    tick();
    const interval = setInterval(tick, 250);
    return () => {
      clearInterval(interval);
      if (autoShowRef.current) clearTimeout(autoShowRef.current);
    };
  }, [room.status, room.questionStartedAt, room.questionTimeLimit, isHost, localShowResult, onShowResults]);

  // Auto-advance after showing results (host only)
  useEffect(() => {
    if (localShowResult && isHost) {
      autoNextRef.current = setTimeout(() => onNextQuestion(), 6000);
      return () => { if (autoNextRef.current) clearTimeout(autoNextRef.current); };
    }
  }, [localShowResult, isHost, onNextQuestion]);

  const handleAnswer = useCallback((isPhishing: boolean) => {
    if (hasAnswered || timeLeft <= 0) return;
    onAnswer(isPhishing);
  }, [hasAnswered, timeLeft, onAnswer]);

  const timerPercent = (timeLeft / room.questionTimeLimit) * 100;
  const timerColor = timeLeft > 12 ? "#00E5FF" : timeLeft > 6 ? "#FFB800" : "#FF2D78";

  // Count how many have answered
  const answeredCount = room.players.filter((p) => p.answers.length > room.currentQuestion).length;

  // For results display - the correct answer
  const isPhishing = question?.isPhishing;
  const wasCorrect = player && player.answers.length > room.currentQuestion ? player.answers[room.currentQuestion] : null;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row" style={{ background: "var(--cc-dark)" }}>
      {/* Main game area */}
      <div className="flex flex-1 flex-col px-4 py-6 lg:px-10 lg:py-8">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          {/* Question counter */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{ background: "rgba(0,229,255,0.1)", border: "2px solid rgba(0,229,255,0.2)" }}
            >
              <Mail className="h-6 w-6" style={{ color: "#00E5FF" }} />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                Question
              </p>
              <p className="text-xl font-black" style={{ color: "#fff" }}>
                {room.currentQuestion + 1}
                <span style={{ color: "rgba(255,255,255,0.25)" }}> / {room.totalQuestions}</span>
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="hidden items-center gap-1.5 sm:flex" aria-label="Question progress">
            {Array.from({ length: room.totalQuestions }).map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  background: i < room.currentQuestion ? "#00E5FF"
                    : i === room.currentQuestion ? "#fff"
                    : "rgba(255,255,255,0.1)",
                  boxShadow: i === room.currentQuestion ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                }}
              />
            ))}
          </div>

          {/* Timer */}
          {!localShowResult && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5" style={{ color: timerColor }} />
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`text-4xl font-black tabular-nums leading-none ${timeLeft <= 5 ? "animate-countdown-pulse" : ""}`}
                  style={{ color: timerColor }}
                >
                  {timeLeft}
                </span>
                <div className="h-2 w-28 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${timerPercent}%`, background: timerColor, boxShadow: `0 0 10px ${timerColor}60` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Answered count badge */}
          {!localShowResult && (
            <div className="hidden items-center gap-2 rounded-full px-3 py-1.5 lg:flex"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              <span className="text-xs font-black" style={{ color: "rgba(255,255,255,0.4)" }}>
                {answeredCount}/{room.players.length} answered
              </span>
            </div>
          )}
        </div>

        {/* Email card */}
        <div
          className="animate-slide-up mb-6 overflow-hidden rounded-3xl border-[3px]"
          style={{ background: "var(--cc-card)", borderColor: "rgba(255,255,255,0.08)" }}
        >
          {/* Email header */}
          <div className="px-6 py-4" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>From</span>
                <span className="text-sm font-bold" style={{ color: "#00E5FF" }}>
                  {question?.from} <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{"<"}{question?.fromEmail}{">"}</span>
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Subject</span>
                <span className="text-sm font-bold" style={{ color: "#fff" }}>{question?.subject}</span>
              </div>
            </div>
          </div>

          {/* Email body */}
          <div className="px-6 py-6">
            <p className="whitespace-pre-line font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              {question?.body}
            </p>
          </div>
        </div>

        {/* Answer area */}
        {!localShowResult ? (
          <div className="flex flex-col gap-4">
            {hasAnswered ? (
              <div className="animate-pop-in flex flex-col items-center gap-4 rounded-3xl border-[3px] px-8 py-10"
                style={{ background: "var(--cc-card)", borderColor: "rgba(255,255,255,0.06)" }}>
                <Lock className="h-10 w-10 animate-float" style={{ color: "#00E5FF" }} />
                <p className="text-2xl font-black uppercase" style={{ color: "#fff" }}>Locked In!</p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00E5FF" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Waiting for timer...
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  disabled={hasAnswered || timeLeft <= 0}
                  className="jackbox-btn group flex flex-col items-center gap-4 rounded-3xl border-[3px] px-6 py-10 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: "rgba(255,45,120,0.06)", borderColor: "rgba(255,45,120,0.25)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF2D78"; e.currentTarget.style.background = "rgba(255,45,120,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,45,120,0.25)"; e.currentTarget.style.background = "rgba(255,45,120,0.06)"; }}
                >
                  <Fish className="h-12 w-12 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-8deg]" style={{ color: "#FF2D78" }} />
                  <span className="text-3xl font-black uppercase tracking-wide" style={{ color: "#FF2D78" }}>Phishing</span>
                  <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>{"It's a scam!"}</span>
                </button>

                <button
                  onClick={() => handleAnswer(false)}
                  disabled={hasAnswered || timeLeft <= 0}
                  className="jackbox-btn group flex flex-col items-center gap-4 rounded-3xl border-[3px] px-6 py-10 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: "rgba(57,255,20,0.04)", borderColor: "rgba(57,255,20,0.25)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39FF14"; e.currentTarget.style.background = "rgba(57,255,20,0.10)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(57,255,20,0.25)"; e.currentTarget.style.background = "rgba(57,255,20,0.04)"; }}
                >
                  <ShieldCheck className="h-12 w-12 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[8deg]" style={{ color: "#39FF14" }} />
                  <span className="text-3xl font-black uppercase tracking-wide" style={{ color: "#39FF14" }}>Legit</span>
                  <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>{"It's real!"}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results display */
          <div className="flex flex-col gap-4">
            {/* Correct/Incorrect banner */}
            <div
              className="animate-pop-in flex items-center gap-5 rounded-3xl border-[3px] px-6 py-6"
              style={{
                background: wasCorrect === true ? "rgba(57,255,20,0.06)" : wasCorrect === false ? "rgba(255,45,120,0.06)" : "rgba(255,184,0,0.06)",
                borderColor: wasCorrect === true ? "rgba(57,255,20,0.3)" : wasCorrect === false ? "rgba(255,45,120,0.3)" : "rgba(255,184,0,0.3)",
              }}
            >
              {wasCorrect === true ? (
                <CheckCircle2 className="h-10 w-10 shrink-0" style={{ color: "#39FF14" }} />
              ) : wasCorrect === false ? (
                <XCircle className="h-10 w-10 shrink-0" style={{ color: "#FF2D78" }} />
              ) : (
                <AlertTriangle className="h-10 w-10 shrink-0" style={{ color: "#FFB800" }} />
              )}
              <div>
                <p className="text-2xl font-black uppercase" style={{
                  color: wasCorrect === true ? "#39FF14" : wasCorrect === false ? "#FF2D78" : "#FFB800",
                }}>
                  {wasCorrect === true ? "Correct!" : wasCorrect === false ? "Wrong!" : "Time's Up!"}
                </p>
                <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  The answer was{" "}
                  <span className="font-black uppercase" style={{ color: isPhishing ? "#FF2D78" : "#39FF14" }}>
                    {isPhishing ? "Phishing" : "Legitimate"}
                  </span>
                </p>
              </div>
            </div>

            {/* Explanation */}
            {question?.explanation && (
              <div className="animate-slide-up flex gap-4 rounded-3xl border-[3px] px-6 py-5" style={{
                background: "rgba(255,184,0,0.04)", borderColor: "rgba(255,184,0,0.15)", animationDelay: "0.15s",
              }}>
                <Lightbulb className="h-6 w-6 mt-0.5 shrink-0" style={{ color: "#FFB800" }} />
                <div>
                  <p className="mb-2 text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: "#FFB800" }}>Why?</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{question.explanation}</p>
                  {question.clues && question.clues.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.clues.map((clue, i) => (
                        <span key={i} className="rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "rgba(255,184,0,0.1)", color: "#FFB800" }}>
                          {clue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Next button (host only, or auto-advances) */}
            {isHost && (
              <button
                onClick={onNextQuestion}
                className="jackbox-btn flex items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg"
                style={{ background: "#00E5FF", color: "var(--cc-dark)", boxShadow: "0 4px 30px rgba(0,229,255,0.3)" }}
              >
                {room.currentQuestion < room.totalQuestions - 1 ? "Next Question" : "See Final Results"}
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {!isHost && (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00E5FF" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Host is advancing...
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar leaderboard (desktop) */}
      <div
        className="hidden w-80 shrink-0 flex-col p-6 lg:flex"
        style={{ borderLeft: "3px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}
      >
        <Leaderboard players={room.players} myPlayerId={playerId} />
      </div>

      {/* Mobile leaderboard */}
      <div className="px-4 pb-6 lg:hidden">
        <Leaderboard players={room.players} myPlayerId={playerId} compact />
      </div>
    </div>
  );
}
