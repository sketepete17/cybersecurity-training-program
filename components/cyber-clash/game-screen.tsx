"use client";

import { useEffect, useRef, useCallback } from "react";
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
import type { GameState } from "@/lib/cyber-clash-store";
import { questions } from "@/lib/cyber-clash-store";
import { Leaderboard } from "./leaderboard";
import { cn } from "@/lib/utils";

interface GameScreenProps {
  state: GameState;
  onAnswer: (answer: "phishing" | "legitimate") => void;
  onReveal: () => void;
  onNext: () => void;
  onTick: () => void;
}

export function GameScreen({ state, onAnswer, onReveal, onNext, onTick }: GameScreenProps) {
  const question = questions[state.currentQuestionIndex];
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealedRef = useRef(false);
  const autoNextRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { revealedRef.current = false; }, [state.currentQuestionIndex]);

  useEffect(() => {
    if (state.showingResult) return;
    timerRef.current = setInterval(() => onTick(), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.showingResult, onTick]);

  useEffect(() => {
    if (state.timeLeft <= 0 && !state.showingResult && !revealedRef.current) {
      revealedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      const t = setTimeout(() => onReveal(), 500);
      return () => clearTimeout(t);
    }
  }, [state.timeLeft, state.showingResult, onReveal]);

  useEffect(() => {
    if (state.showingResult) {
      autoNextRef.current = setTimeout(() => onNext(), 5000);
      return () => { if (autoNextRef.current) clearTimeout(autoNextRef.current); };
    }
  }, [state.showingResult, onNext]);

  const handleAnswer = useCallback((answer: "phishing" | "legitimate") => {
    onAnswer(answer);
  }, [onAnswer]);

  const timerPercent = (state.timeLeft / 15) * 100;
  const timerColor =
    state.timeLeft > 10 ? "var(--cc-cyan)" :
    state.timeLeft > 5 ? "var(--cc-amber)" :
    "var(--cc-magenta)";

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
              <Mail className="h-6 w-6" style={{ color: "var(--cc-cyan)" }} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Question
              </p>
              <p className="text-xl font-black" style={{ color: "#fff" }}>
                {state.currentQuestionIndex + 1}
                <span style={{ color: "rgba(255,255,255,0.25)" }}> / {questions.length}</span>
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="hidden items-center gap-1.5 sm:flex">
            {questions.map((_, i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  background: i < state.currentQuestionIndex
                    ? "var(--cc-cyan)"
                    : i === state.currentQuestionIndex
                    ? "#fff"
                    : "rgba(255,255,255,0.1)",
                  boxShadow: i === state.currentQuestionIndex ? "0 0 8px rgba(255,255,255,0.4)" : "none",
                }}
              />
            ))}
          </div>

          {/* Timer */}
          {!state.showingResult && (
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5" style={{ color: timerColor }} />
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={cn("text-4xl font-black tabular-nums leading-none", state.timeLeft <= 5 && "animate-countdown-pulse")}
                  style={{ color: timerColor }}
                >
                  {state.timeLeft}
                </span>
                <div className="h-2 w-28 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-linear"
                    style={{
                      width: `${timerPercent}%`,
                      background: timerColor,
                      boxShadow: `0 0 10px ${timerColor}60`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Email card */}
        <div
          className="animate-slide-up mb-6 overflow-hidden rounded-3xl border-[3px]"
          style={{
            background: "var(--cc-card)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {/* Email header */}
          <div
            className="px-6 py-4"
            style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  From
                </span>
                <span className="text-sm font-mono font-bold" style={{ color: "var(--cc-cyan)" }}>
                  {question.from}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Subject
                </span>
                <span className="text-sm font-bold" style={{ color: "#fff" }}>
                  {question.subject}
                </span>
              </div>
            </div>
          </div>

          {/* Email body */}
          <div className="px-6 py-6">
            <p className="whitespace-pre-line font-mono text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              {question.message}
            </p>
          </div>
        </div>

        {/* Answer area */}
        {!state.showingResult ? (
          <div className="flex flex-col gap-4">
            {state.hasAnswered ? (
              /* Locked in */
              <div
                className="animate-pop-in flex flex-col items-center gap-4 rounded-3xl border-[3px] px-8 py-10"
                style={{
                  background: "var(--cc-card)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <Lock className="h-10 w-10 animate-float" style={{ color: "var(--cc-cyan)" }} />
                <p className="text-2xl font-black uppercase" style={{ color: "#fff" }}>
                  Locked In!
                </p>
                <p className="text-base font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                  You chose:{" "}
                  <span
                    className="font-black uppercase"
                    style={{ color: state.playerAnswer === "phishing" ? "var(--cc-magenta)" : "var(--cc-lime)" }}
                  >
                    {state.playerAnswer}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--cc-cyan)" }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Waiting for timer...
                  </span>
                </div>
              </div>
            ) : (
              /* Answer buttons */
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer("phishing")}
                  disabled={state.hasAnswered || state.timeLeft <= 0}
                  className="jackbox-btn group flex flex-col items-center gap-4 rounded-3xl border-[3px] px-6 py-10 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: "rgba(255,45,120,0.06)",
                    borderColor: "rgba(255,45,120,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cc-magenta)";
                    e.currentTarget.style.background = "rgba(255,45,120,0.12)";
                    e.currentTarget.style.boxShadow = "0 0 50px rgba(255,45,120,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,45,120,0.25)";
                    e.currentTarget.style.background = "rgba(255,45,120,0.06)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Fish className="h-12 w-12 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-8deg]" style={{ color: "var(--cc-magenta)" }} />
                  <span className="text-3xl font-black uppercase tracking-wide" style={{ color: "var(--cc-magenta)" }}>
                    Phishing
                  </span>
                  <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {"It's a scam!"}
                  </span>
                </button>

                <button
                  onClick={() => handleAnswer("legitimate")}
                  disabled={state.hasAnswered || state.timeLeft <= 0}
                  className="jackbox-btn group flex flex-col items-center gap-4 rounded-3xl border-[3px] px-6 py-10 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{
                    background: "rgba(57,255,20,0.04)",
                    borderColor: "rgba(57,255,20,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--cc-lime)";
                    e.currentTarget.style.background = "rgba(57,255,20,0.10)";
                    e.currentTarget.style.boxShadow = "0 0 50px rgba(57,255,20,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(57,255,20,0.25)";
                    e.currentTarget.style.background = "rgba(57,255,20,0.04)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <ShieldCheck className="h-12 w-12 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[8deg]" style={{ color: "var(--cc-lime)" }} />
                  <span className="text-3xl font-black uppercase tracking-wide" style={{ color: "var(--cc-lime)" }}>
                    Legit
                  </span>
                  <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {"It's real!"}
                  </span>
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
                background: state.wasCorrect === true
                  ? "rgba(57,255,20,0.06)"
                  : state.wasCorrect === false
                  ? "rgba(255,45,120,0.06)"
                  : "rgba(255,184,0,0.06)",
                borderColor: state.wasCorrect === true
                  ? "rgba(57,255,20,0.3)"
                  : state.wasCorrect === false
                  ? "rgba(255,45,120,0.3)"
                  : "rgba(255,184,0,0.3)",
              }}
            >
              {state.wasCorrect === true ? (
                <CheckCircle2 className="h-10 w-10 shrink-0" style={{ color: "var(--cc-lime)" }} />
              ) : state.wasCorrect === false ? (
                <XCircle className="h-10 w-10 shrink-0" style={{ color: "var(--cc-magenta)" }} />
              ) : (
                <AlertTriangle className="h-10 w-10 shrink-0" style={{ color: "var(--cc-amber)" }} />
              )}
              <div>
                <p className="text-2xl font-black uppercase" style={{
                  color: state.wasCorrect === true ? "var(--cc-lime)" : state.wasCorrect === false ? "var(--cc-magenta)" : "var(--cc-amber)",
                }}>
                  {state.wasCorrect === true ? "Correct!" : state.wasCorrect === false ? "Wrong!" : "Time's Up!"}
                </p>
                <p className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  The answer was{" "}
                  <span className="font-black uppercase" style={{
                    color: state.correctAnswer === "phishing" ? "var(--cc-magenta)" : "var(--cc-lime)",
                  }}>
                    {state.correctAnswer}
                  </span>
                </p>
              </div>
            </div>

            {/* Hint card */}
            {state.currentHint && (
              <div
                className="animate-slide-up flex gap-4 rounded-3xl border-[3px] px-6 py-5"
                style={{
                  background: "rgba(255,184,0,0.04)",
                  borderColor: "rgba(255,184,0,0.15)",
                  animationDelay: "0.15s",
                }}
              >
                <Lightbulb className="h-6 w-6 shrink-0 mt-0.5" style={{ color: "var(--cc-amber)" }} />
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: "var(--cc-amber)" }}>
                    Learn Why
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {state.currentHint}
                  </p>
                </div>
              </div>
            )}

            {/* Next button */}
            <button
              onClick={onNext}
              className="jackbox-btn flex items-center justify-center gap-3 rounded-2xl px-6 py-5 text-lg"
              style={{
                background: "var(--cc-cyan)",
                color: "var(--cc-dark)",
                boxShadow: "0 4px 30px rgba(0,229,255,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              {state.currentQuestionIndex < questions.length - 1 ? "NEXT QUESTION" : "SEE RESULTS"}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Sidebar leaderboard (desktop) */}
      <div
        className="hidden w-80 shrink-0 flex-col p-6 lg:flex"
        style={{ borderLeft: "3px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}
      >
        <Leaderboard players={state.players} myPlayerId={state.myPlayerId} />
      </div>

      {/* Mobile leaderboard */}
      <div className="px-4 pb-6 lg:hidden">
        <Leaderboard players={state.players} myPlayerId={state.myPlayerId} compact />
      </div>
    </div>
  );
}
