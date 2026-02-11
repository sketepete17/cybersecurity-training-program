"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  Mail,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronRight,
  AlertTriangle,
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

  // Reset revealedRef on new question
  useEffect(() => {
    revealedRef.current = false;
  }, [state.currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    if (state.showingResult) return;

    timerRef.current = setInterval(() => {
      onTick();
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.showingResult, onTick]);

  // When timer hits 0 or player has answered, trigger reveal
  useEffect(() => {
    if (state.timeLeft <= 0 && !state.showingResult && !revealedRef.current) {
      revealedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      // Small delay before revealing
      const t = setTimeout(() => onReveal(), 500);
      return () => clearTimeout(t);
    }
  }, [state.timeLeft, state.showingResult, onReveal]);

  // Auto-advance after result is shown
  useEffect(() => {
    if (state.showingResult) {
      autoNextRef.current = setTimeout(() => {
        onNext();
      }, 5000);
      return () => {
        if (autoNextRef.current) clearTimeout(autoNextRef.current);
      };
    }
  }, [state.showingResult, onNext]);

  const handleAnswer = useCallback((answer: "phishing" | "legitimate") => {
    onAnswer(answer);
  }, [onAnswer]);

  const timerPercent = (state.timeLeft / 15) * 100;
  const timerColor =
    state.timeLeft > 10 ? "text-[#00ff88]" :
    state.timeLeft > 5 ? "text-[#ffcc00]" :
    "text-[#ff4466]";
  const timerBarColor =
    state.timeLeft > 10 ? "bg-[#00ff88]" :
    state.timeLeft > 5 ? "bg-[#ffcc00]" :
    "bg-[#ff4466]";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Main game area */}
      <div className="flex-1 flex flex-col px-4 py-6 lg:px-8 lg:py-8">
        {/* Top bar: Question counter + Timer */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30">
              <Mail className="h-5 w-5 text-[#00ff88]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Question
              </p>
              <p className="text-lg font-black text-foreground">
                {state.currentQuestionIndex + 1}
                <span className="text-muted-foreground font-semibold"> / {questions.length}</span>
              </p>
            </div>
          </div>

          {/* Timer */}
          {!state.showingResult && (
            <div className="flex items-center gap-3">
              <Clock className={cn("h-5 w-5", timerColor)} />
              <div className="flex flex-col items-end gap-1">
                <span className={cn("text-3xl font-black tabular-nums leading-none", timerColor)}>
                  {state.timeLeft}
                </span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full transition-all duration-1000 ease-linear", timerBarColor)}
                    style={{ width: `${timerPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Email card */}
        <div className="mb-6 overflow-hidden rounded-2xl border-2 border-border bg-card">
          {/* Email header */}
          <div className="border-b-2 border-border bg-secondary/30 px-5 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">From:</span>
                <span className="text-sm font-mono font-bold text-foreground">{question.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject:</span>
                <span className="text-sm font-bold text-foreground">{question.subject}</span>
              </div>
            </div>
          </div>
          {/* Email body */}
          <div className="px-5 py-5">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90 font-mono">
              {question.message}
            </p>
          </div>
        </div>

        {/* Answer area */}
        {!state.showingResult ? (
          <div className="flex flex-col gap-4">
            {state.hasAnswered ? (
              /* Waiting state */
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card px-6 py-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00ff88]/10">
                  <Clock className="h-7 w-7 text-[#00ff88] animate-pulse" />
                </div>
                <p className="text-lg font-bold text-foreground">Answer Locked In!</p>
                <p className="text-sm text-muted-foreground">
                  You chose:{" "}
                  <span className={cn(
                    "font-black uppercase",
                    state.playerAnswer === "phishing" ? "text-[#ff4466]" : "text-[#00ff88]"
                  )}>
                    {state.playerAnswer}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">Waiting for timer to end...</p>
              </div>
            ) : (
              /* Answer buttons */
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAnswer("phishing")}
                  disabled={state.hasAnswered || state.timeLeft <= 0}
                  className="group flex flex-col items-center gap-3 rounded-2xl border-3 border-[#ff4466]/30 bg-[#ff4466]/5 px-6 py-8 transition-all duration-200 hover:border-[#ff4466] hover:bg-[#ff4466]/10 hover:shadow-[0_0_40px_rgba(255,68,102,0.15)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <ShieldAlert className="h-10 w-10 text-[#ff4466] transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-2xl font-black text-[#ff4466] uppercase tracking-wide">
                    Phishing
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {"It's a scam!"}
                  </span>
                </button>

                <button
                  onClick={() => handleAnswer("legitimate")}
                  disabled={state.hasAnswered || state.timeLeft <= 0}
                  className="group flex flex-col items-center gap-3 rounded-2xl border-3 border-[#00ff88]/30 bg-[#00ff88]/5 px-6 py-8 transition-all duration-200 hover:border-[#00ff88] hover:bg-[#00ff88]/10 hover:shadow-[0_0_40px_rgba(0,255,136,0.15)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="h-10 w-10 text-[#00ff88] transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-2xl font-black text-[#00ff88] uppercase tracking-wide">
                    Legit
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
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
            <div className={cn(
              "flex items-center gap-4 rounded-2xl border-2 px-6 py-5",
              state.wasCorrect === true
                ? "border-[#00ff88]/50 bg-[#00ff88]/5"
                : state.wasCorrect === false
                ? "border-[#ff4466]/50 bg-[#ff4466]/5"
                : "border-[#ffcc00]/50 bg-[#ffcc00]/5"
            )}>
              {state.wasCorrect === true ? (
                <CheckCircle2 className="h-8 w-8 text-[#00ff88] shrink-0" />
              ) : state.wasCorrect === false ? (
                <XCircle className="h-8 w-8 text-[#ff4466] shrink-0" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-[#ffcc00] shrink-0" />
              )}
              <div>
                <p className={cn(
                  "text-lg font-black",
                  state.wasCorrect === true ? "text-[#00ff88]" : state.wasCorrect === false ? "text-[#ff4466]" : "text-[#ffcc00]"
                )}>
                  {state.wasCorrect === true
                    ? "Correct!"
                    : state.wasCorrect === false
                    ? "Incorrect!"
                    : "Time's Up!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  The answer was{" "}
                  <span className={cn(
                    "font-black uppercase",
                    state.correctAnswer === "phishing" ? "text-[#ff4466]" : "text-[#00ff88]"
                  )}>
                    {state.correctAnswer}
                  </span>
                </p>
              </div>
            </div>

            {/* Hint card */}
            {state.currentHint && (
              <div className="flex gap-3 rounded-2xl border-2 border-[#ffcc00]/20 bg-[#ffcc00]/5 px-5 py-4">
                <Lightbulb className="h-5 w-5 shrink-0 text-[#ffcc00] mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#ffcc00] mb-1">
                    Why?
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {state.currentHint}
                  </p>
                </div>
              </div>
            )}

            {/* Next button */}
            <button
              onClick={onNext}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#00ff88] px-6 py-4 text-lg font-black uppercase tracking-wider text-[#0a0e14] transition-all duration-200 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {state.currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Sidebar leaderboard (desktop) */}
      <div className="hidden lg:flex w-80 shrink-0 flex-col border-l-2 border-border bg-card/50 p-6">
        <Leaderboard players={state.players} myPlayerId={state.myPlayerId} />
      </div>

      {/* Mobile leaderboard (below game area) */}
      <div className="lg:hidden px-4 pb-6">
        <Leaderboard players={state.players} myPlayerId={state.myPlayerId} compact />
      </div>
    </div>
  );
}
