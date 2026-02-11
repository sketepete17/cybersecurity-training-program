"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
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
  Flame,
  Zap,
  Sparkles,
  User,
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

// Floating particle for the background
function FloatingIcon({ icon: Icon, color, left, delay, size }: { icon: typeof Zap; color: string; left: string; delay: string; size: number }) {
  return (
    <div
      className="pointer-events-none absolute animate-float"
      aria-hidden="true"
      style={{
        left,
        top: `${10 + Math.random() * 60}%`,
        animationDelay: delay,
        opacity: 0.08,
      }}
    >
      <Icon style={{ color, width: size, height: size }} />
    </div>
  );
}

export function GameScreen({ room, playerId, isHost, onAnswer, onShowResults, onNextQuestion }: GameScreenProps) {
  const question = room.questionSet[room.currentQuestion];
  const player = room.players.find((p) => p.id === playerId);
  const hasAnswered = player ? player.answers.length > room.currentQuestion : false;
  const [timeLeft, setTimeLeft] = useState(room.questionTimeLimit);
  const showingResults = room.status === "showing_results";
  const timerExpiredRef = useRef(false);
  const prevQuestionRef = useRef(room.currentQuestion);
  const autoNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset when question changes
  useEffect(() => {
    if (room.currentQuestion !== prevQuestionRef.current) {
      timerExpiredRef.current = false;
      prevQuestionRef.current = room.currentQuestion;
    }
  }, [room.currentQuestion]);

  // Timer countdown
  useEffect(() => {
    if (room.status !== "playing" || !room.questionStartedAt) return;
    const tick = () => {
      const elapsed = (Date.now() - room.questionStartedAt!) / 1000;
      const remaining = Math.max(0, room.questionTimeLimit - elapsed);
      setTimeLeft(remaining);

      // When timer expires, host auto-triggers show_results once
      if (remaining <= 0 && isHost && !timerExpiredRef.current) {
        timerExpiredRef.current = true;
        onShowResults();
      }
    };
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [room.status, room.questionStartedAt, room.questionTimeLimit, isHost, onShowResults]);

  // Auto-advance to next question after showing results (host only, 6s delay)
  useEffect(() => {
    if (showingResults && isHost) {
      if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = setTimeout(() => {
        onNextQuestion();
      }, 6000);
      return () => {
        if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
      };
    }
  }, [showingResults, isHost, onNextQuestion, room.currentQuestion]);

  const handleAnswer = useCallback((isPhishing: boolean) => {
    if (hasAnswered || timeLeft <= 0) return;
    onAnswer(isPhishing);
  }, [hasAnswered, timeLeft, onAnswer]);

  const timerPercent = (timeLeft / room.questionTimeLimit) * 100;
  const timerColor = timeLeft > 12 ? "#00E5FF" : timeLeft > 6 ? "#FFB800" : "#FF2D78";
  const answeredCount = room.players.filter((p) => p.answers.length > room.currentQuestion).length;

  // Result info
  const isPhishing = question?.isPhishing;
  const wasCorrect = player && player.answers.length > room.currentQuestion ? player.answers[room.currentQuestion] : null;
  const playerStreak = player?.streak ?? 0;

  // Background particles
  const bgIcons = useMemo(() => [
    { icon: ShieldCheck, color: "#00E5FF", left: "5%", delay: "0s", size: 32 },
    { icon: Fish, color: "#FF2D78", left: "85%", delay: "1.2s", size: 28 },
    { icon: Zap, color: "#FFB800", left: "45%", delay: "0.7s", size: 24 },
    { icon: Sparkles, color: "#39FF14", left: "70%", delay: "2s", size: 26 },
    { icon: Lock, color: "#A855F7", left: "20%", delay: "1.8s", size: 22 },
    { icon: Mail, color: "#00E5FF", left: "60%", delay: "0.3s", size: 20 },
  ], []);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row" style={{ background: "var(--cc-dark)" }}>
      {/* Floating background icons */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {bgIcons.map((props, i) => (
          <FloatingIcon key={i} {...props} />
        ))}
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* Main game area */}
      <div className="relative flex flex-1 flex-col px-4 py-6 lg:px-10 lg:py-8">
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
                Email
              </p>
              <p className="text-xl font-black" style={{ color: "#fff" }}>
                {room.currentQuestion + 1}
                <span style={{ color: "rgba(255,255,255,0.25)" }}> / {room.totalQuestions}</span>
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="hidden items-center gap-1.5 sm:flex" aria-label="Question progress">
            {Array.from({ length: room.totalQuestions }).map((_, i) => {
              const answered = player && player.answers.length > i;
              const correct = player && player.answers[i] === true;
              return (
                <div
                  key={i}
                  className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: answered
                      ? (correct ? "#39FF14" : "#FF2D78")
                      : i === room.currentQuestion ? "#fff"
                      : "rgba(255,255,255,0.1)",
                    boxShadow: i === room.currentQuestion ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                    transform: i === room.currentQuestion ? "scale(1.3)" : "scale(1)",
                  }}
                />
              );
            })}
          </div>

          {/* Timer */}
          {!showingResults && (
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Circular timer */}
                <svg className="-rotate-90" width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                  <circle
                    cx="32" cy="32" r="28"
                    fill="none" stroke={timerColor} strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${(timerPercent / 100) * 176} 176`}
                    style={{
                      transition: "stroke-dasharray 0.3s linear, stroke 0.3s ease",
                      filter: `drop-shadow(0 0 6px ${timerColor}60)`,
                    }}
                  />
                </svg>
                <span
                  className={`absolute inset-0 flex items-center justify-center text-lg font-black tabular-nums ${timeLeft <= 5 ? "animate-countdown-pulse" : ""}`}
                  style={{ color: timerColor }}
                >
                  {Math.ceil(timeLeft)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Streak indicator */}
        {playerStreak >= 2 && !showingResults && (
          <div className="animate-pop-in mb-4 flex items-center justify-center gap-2">
            <Flame className="h-5 w-5" style={{ color: "#FFB800" }} />
            <span className="text-sm font-black uppercase tracking-wider" style={{ color: "#FFB800" }}>
              {playerStreak}x Streak!
            </span>
            <Flame className="h-5 w-5" style={{ color: "#FFB800" }} />
          </div>
        )}

        {/* Answered badge (mobile) */}
        {!showingResults && (
          <div className="mb-4 flex items-center justify-center gap-2 lg:hidden">
            <User className="h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
            <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
              {answeredCount}/{room.players.length} answered
            </span>
          </div>
        )}

        {/* Email card */}
        <div
          className="animate-slide-up mb-6 overflow-hidden rounded-3xl border-[3px]"
          style={{
            background: "var(--cc-card)",
            borderColor: showingResults
              ? isPhishing ? "rgba(255,45,120,0.3)" : "rgba(57,255,20,0.3)"
              : "rgba(255,255,255,0.08)",
            transition: "border-color 0.4s ease",
          }}
        >
          {/* Email header */}
          <div className="px-6 py-4" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>From</span>
                <span className="text-sm font-bold" style={{ color: "#00E5FF" }}>
                  {question?.from}{" "}
                  <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {"<"}{question?.fromEmail}{">"}
                  </span>
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

          {/* Phishing / Legit badge during results */}
          {showingResults && (
            <div
              className="animate-pop-in flex items-center justify-center gap-3 px-6 py-4"
              style={{
                background: isPhishing ? "rgba(255,45,120,0.08)" : "rgba(57,255,20,0.08)",
                borderTop: `3px solid ${isPhishing ? "rgba(255,45,120,0.2)" : "rgba(57,255,20,0.2)"}`,
              }}
            >
              {isPhishing ? (
                <Fish className="h-6 w-6" style={{ color: "#FF2D78" }} />
              ) : (
                <ShieldCheck className="h-6 w-6" style={{ color: "#39FF14" }} />
              )}
              <span className="text-lg font-black uppercase tracking-wider" style={{ color: isPhishing ? "#FF2D78" : "#39FF14" }}>
                {isPhishing ? "This was Phishing!" : "This was Legitimate!"}
              </span>
            </div>
          )}
        </div>

        {/* Answer area */}
        {!showingResults ? (
          <div className="flex flex-col gap-4">
            {hasAnswered ? (
              <div className="animate-pop-in flex flex-col items-center gap-4 rounded-3xl border-[3px] px-8 py-10"
                style={{ background: "var(--cc-card)", borderColor: "rgba(0,229,255,0.15)" }}>
                <div className="relative">
                  <Lock className="h-12 w-12 animate-float" style={{ color: "#00E5FF" }} />
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 animate-float-delayed" style={{ color: "#FFB800" }} />
                </div>
                <p className="text-2xl font-black uppercase" style={{ color: "#fff" }}>Answer Locked In!</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00E5FF" }} />
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Waiting for everyone...
                    </span>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF" }}>
                    {answeredCount}/{room.players.length}
                  </span>
                </div>
              </div>
            ) : timeLeft <= 0 ? (
              <div className="animate-pop-in flex flex-col items-center gap-4 rounded-3xl border-[3px] px-8 py-10"
                style={{ background: "rgba(255,45,120,0.04)", borderColor: "rgba(255,45,120,0.2)" }}>
                <AlertTriangle className="h-12 w-12" style={{ color: "#FF2D78" }} />
                <p className="text-2xl font-black uppercase" style={{ color: "#FF2D78" }}>{"Time's Up!"}</p>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  You did not answer in time
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer(true)}
                  className="jackbox-btn group flex flex-col items-center gap-4 rounded-3xl border-[3px] px-6 py-10"
                  style={{ background: "rgba(255,45,120,0.06)", borderColor: "rgba(255,45,120,0.25)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF2D78"; e.currentTarget.style.background = "rgba(255,45,120,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,45,120,0.25)"; e.currentTarget.style.background = "rgba(255,45,120,0.06)"; }}
                >
                  <div className="relative">
                    <Fish className="h-14 w-14 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-8deg]" style={{ color: "#FF2D78" }} />
                    <Sparkles className="absolute -top-2 -right-3 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "#FF2D78" }} />
                  </div>
                  <span className="text-3xl font-black uppercase tracking-wide" style={{ color: "#FF2D78" }}>Phishing</span>
                  <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>{"It's a scam!"}</span>
                </button>

                <button
                  onClick={() => handleAnswer(false)}
                  className="jackbox-btn group flex flex-col items-center gap-4 rounded-3xl border-[3px] px-6 py-10"
                  style={{ background: "rgba(57,255,20,0.04)", borderColor: "rgba(57,255,20,0.25)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39FF14"; e.currentTarget.style.background = "rgba(57,255,20,0.10)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(57,255,20,0.25)"; e.currentTarget.style.background = "rgba(57,255,20,0.04)"; }}
                >
                  <div className="relative">
                    <ShieldCheck className="h-14 w-14 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[8deg]" style={{ color: "#39FF14" }} />
                    <Zap className="absolute -top-2 -right-3 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "#39FF14" }} />
                  </div>
                  <span className="text-3xl font-black uppercase tracking-wide" style={{ color: "#39FF14" }}>Legit</span>
                  <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>{"It's real!"}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Results display */
          <div className="flex flex-col gap-4">
            {/* Correct / Incorrect / Time's up banner */}
            <div
              className="animate-pop-in flex items-center gap-5 rounded-3xl border-[3px] px-6 py-6"
              style={{
                background: wasCorrect === true ? "rgba(57,255,20,0.06)" : wasCorrect === false ? "rgba(255,45,120,0.06)" : "rgba(255,184,0,0.06)",
                borderColor: wasCorrect === true ? "rgba(57,255,20,0.3)" : wasCorrect === false ? "rgba(255,45,120,0.3)" : "rgba(255,184,0,0.3)",
              }}
            >
              {wasCorrect === true ? (
                <div className="relative shrink-0">
                  <CheckCircle2 className="h-12 w-12" style={{ color: "#39FF14" }} />
                  <Sparkles className="absolute -top-1 -right-1 h-5 w-5 animate-float" style={{ color: "#FFB800" }} />
                </div>
              ) : wasCorrect === false ? (
                <XCircle className="h-12 w-12 shrink-0" style={{ color: "#FF2D78" }} />
              ) : (
                <AlertTriangle className="h-12 w-12 shrink-0 animate-wiggle" style={{ color: "#FFB800" }} />
              )}
              <div>
                <p className="text-3xl font-black uppercase" style={{
                  color: wasCorrect === true ? "#39FF14" : wasCorrect === false ? "#FF2D78" : "#FFB800",
                }}>
                  {wasCorrect === true ? "Correct!" : wasCorrect === false ? "Wrong!" : "Time's Up!"}
                </p>
                <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {wasCorrect === true && player && player.streak >= 2
                    ? `${player.streak}x streak bonus!`
                    : wasCorrect === false
                    ? "Better luck next round"
                    : "No answer submitted"}
                </p>
              </div>
            </div>

            {/* Explanation */}
            {question?.explanation && (
              <div className="animate-slide-up flex gap-4 rounded-3xl border-[3px] px-6 py-5" style={{
                background: "rgba(255,184,0,0.04)", borderColor: "rgba(255,184,0,0.15)", animationDelay: "0.15s",
              }}>
                <Lightbulb className="mt-0.5 h-6 w-6 shrink-0" style={{ color: "#FFB800" }} />
                <div>
                  <p className="mb-2 text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: "#FFB800" }}>Why?</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{question.explanation}</p>
                  {question.clues && question.clues.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.clues.map((clue, i) => (
                        <span key={i} className="animate-fade-in rounded-full px-3 py-1 text-[11px] font-bold"
                          style={{ background: "rgba(255,184,0,0.1)", color: "#FFB800", animationDelay: `${0.3 + i * 0.1}s` }}>
                          {clue}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* How players answered */}
            <div className="animate-slide-up flex flex-wrap items-center justify-center gap-3 rounded-3xl border-[3px] px-6 py-4"
              style={{ background: "var(--cc-card)", borderColor: "rgba(255,255,255,0.06)", animationDelay: "0.25s" }}>
              {room.players.map((p, i) => {
                const pAnswered = p.answers.length > room.currentQuestion;
                const pCorrect = pAnswered ? p.answers[room.currentQuestion] : null;
                return (
                  <div key={p.id} className="flex flex-col items-center gap-1" title={p.name}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-black"
                      style={{
                        background: pCorrect === true ? "rgba(57,255,20,0.2)" : pCorrect === false ? "rgba(255,45,120,0.2)" : "rgba(255,184,0,0.15)",
                        color: pCorrect === true ? "#39FF14" : pCorrect === false ? "#FF2D78" : "#FFB800",
                      }}>
                      {pCorrect === true ? <CheckCircle2 className="h-4 w-4" /> : pCorrect === false ? <XCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <span className="max-w-[48px] truncate text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>{p.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Next button (host only) or waiting */}
            {isHost ? (
              <button
                onClick={() => {
                  if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
                  onNextQuestion();
                }}
                className="jackbox-btn flex items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg"
                style={{ background: "#00E5FF", color: "var(--cc-dark)", boxShadow: "0 4px 30px rgba(0,229,255,0.3)" }}
              >
                {room.currentQuestion < room.totalQuestions - 1 ? "Next Question" : "See Final Results"}
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00E5FF" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Next question loading...
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

        {/* Answered count */}
        {!showingResults && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl py-3"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <User className="h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
            <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
              {answeredCount}/{room.players.length} answered
            </span>
          </div>
        )}
      </div>

      {/* Mobile leaderboard */}
      <div className="px-4 pb-6 lg:hidden">
        <Leaderboard players={room.players} myPlayerId={playerId} compact />
      </div>
    </div>
  );
}
