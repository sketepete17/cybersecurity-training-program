"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Mail, Clock, Fish, ShieldCheck, CheckCircle2, XCircle, Lightbulb,
  ChevronRight, AlertTriangle, Lock, Flame, Zap, Sparkles, User, Eye,
  Search, Award, Info, Target, BarChart3, KeyRound, Globe, Link2,
  Swords, Trophy, Crown, Send,
} from "lucide-react";
import type { GameRoom, GameRound, PhishRound, PasswordRound, SpotURLRound, PasswordBattleRound, PasswordScoreBreakdown } from "@/lib/game-room";
import { Leaderboard } from "./leaderboard";

interface GameScreenProps {
  room: GameRoom;
  playerId: string;
  isHost: boolean;
  onAnswer: (answer: number) => void;
  onBattleSubmit: (password: string) => void;
  onShowResults: () => void;
  onNextQuestion: () => void;
}

const DIFFICULTY_COLORS: Record<string, string> = { easy: "#39FF14", medium: "#FFB800", hard: "#FF2D78" };
const DIFFICULTY_LABELS: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
const ROUND_TYPE_LABELS: Record<string, string> = { phish: "Phish or Legit?", password: "Password Strength", spot_url: "Spot the URL", password_battle: "Password Battle" };
const ROUND_TYPE_ICONS: Record<string, typeof Zap> = { phish: Fish, password: KeyRound, spot_url: Globe, password_battle: Swords };
const ROUND_TYPE_COLORS: Record<string, string> = { phish: "#00E5FF", password: "#A855F7", spot_url: "#F97316", password_battle: "#EC4899" };

function FloatingIcon({ icon: Icon, color, left, delay, size }: { icon: typeof Zap; color: string; left: string; delay: string; size: number }) {
  return (
    <div className="pointer-events-none absolute animate-float" aria-hidden="true"
      style={{ left, top: `${10 + Math.random() * 60}%`, animationDelay: delay, opacity: 0.08 }}>
      <Icon style={{ color, width: size, height: size }} />
    </div>
  );
}

export function GameScreen({ room, playerId, isHost, onAnswer, onBattleSubmit, onShowResults, onNextQuestion }: GameScreenProps) {
  const round = room.questionSet[room.currentQuestion] as GameRound | undefined;
  const player = room.players.find((p) => p.id === playerId);
  const hasAnswered = player ? player.answers.length > room.currentQuestion : false;
  const [timeLeft, setTimeLeft] = useState(room.questionTimeLimit);
  const showingResults = room.status === "showing_results";
  const timerExpiredRef = useRef(false);
  const prevQuestionRef = useRef(room.currentQuestion);
  const autoNextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [highlightClues, setHighlightClues] = useState(false);
  const [revealPhase, setRevealPhase] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);

  useEffect(() => {
    if (room.currentQuestion !== prevQuestionRef.current) {
      timerExpiredRef.current = false;
      prevQuestionRef.current = room.currentQuestion;
      setShowExplanation(false);
      setShowFunFact(false);
      setHighlightClues(false);
      setRevealPhase(0);
      setShowScorePopup(false);
    }
  }, [room.currentQuestion]);

  useEffect(() => {
    if (!showingResults) return;
    setRevealPhase(0);
    setShowScorePopup(true);
    const t1 = setTimeout(() => { setRevealPhase(1); setShowExplanation(true); }, 800);
    const t2 = setTimeout(() => { setRevealPhase(2); setHighlightClues(true); setShowFunFact(true); }, 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showingResults, room.currentQuestion]);

  // Track isHost in a ref so the interval callback always has the latest value
  const isHostRef = useRef(isHost);
  useEffect(() => { isHostRef.current = isHost; }, [isHost]);

  // Countdown timer -- updates timeLeft and triggers show_results when time expires
  useEffect(() => {
    if (room.status !== "playing" || !room.questionStartedAt) return;
    const tick = () => {
      const elapsed = (Date.now() - room.questionStartedAt!) / 1000;
      const remaining = Math.max(0, room.questionTimeLimit - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0 && isHostRef.current && !timerExpiredRef.current) {
        timerExpiredRef.current = true;
        onShowResults();
      }
    };
    tick();
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [room.status, room.questionStartedAt, room.questionTimeLimit, onShowResults]);

  // If we become host mid-round (previous host left) and timer already expired, fire show_results
  useEffect(() => {
    if (!isHost || room.status !== "playing" || !room.questionStartedAt) return;
    const elapsed = (Date.now() - room.questionStartedAt) / 1000;
    if (elapsed >= room.questionTimeLimit && !timerExpiredRef.current) {
      timerExpiredRef.current = true;
      onShowResults();
    }
  }, [isHost, room.status, room.questionStartedAt, room.questionTimeLimit, onShowResults]);

  // Auto-advance to next question after results are shown (host only).
  // Fires whenever showingResults or isHost changes, so new hosts pick up the baton.
  useEffect(() => {
    if (!showingResults || !isHost) return;
    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = setTimeout(() => onNextQuestion(), 8000);
    return () => { if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current); };
  }, [showingResults, isHost, onNextQuestion, room.currentQuestion]);

  const submittingRef = useRef(false);

  // Reset submitting flag when question changes
  useEffect(() => {
    submittingRef.current = false;
  }, [room.currentQuestion]);

  const handleAnswer = useCallback((answer: number) => {
    if (hasAnswered || timeLeft <= 0 || submittingRef.current) return;
    submittingRef.current = true;
    onAnswer(answer);
  }, [hasAnswered, timeLeft, onAnswer]);

  const timerPercent = (timeLeft / room.questionTimeLimit) * 100;
  const timerColor = timeLeft > 12 ? "#00E5FF" : timeLeft > 6 ? "#FFB800" : "#FF2D78";
  const answeredCount = room.players.filter((p) => p.answers.length > room.currentQuestion).length;
  const wasCorrect = player && player.answers.length > room.currentQuestion ? player.answers[room.currentQuestion] : null;
  const playerStreak = player?.streak ?? 0;
  const roundType = round?.type ?? "phish";
  const RoundIcon = ROUND_TYPE_ICONS[roundType] ?? Fish;
  const roundColor = ROUND_TYPE_COLORS[roundType] ?? "#00E5FF";

  const bgIcons = useMemo(() => [
    { icon: ShieldCheck, color: "#00E5FF", left: "5%", delay: "0s", size: 32 },
    { icon: Fish, color: "#FF2D78", left: "85%", delay: "1.2s", size: 28 },
    { icon: Zap, color: "#FFB800", left: "45%", delay: "0.7s", size: 24 },
    { icon: Sparkles, color: "#39FF14", left: "70%", delay: "2s", size: 26 },
    { icon: Lock, color: "#A855F7", left: "20%", delay: "1.8s", size: 22 },
    { icon: KeyRound, color: "#F97316", left: "60%", delay: "0.3s", size: 20 },
  ], []);

  if (!round) return null;

  if (roundType === "password_battle") {
    const br = round as PasswordBattleRound;
    console.log("[v0] Password Battle round:", {
      type: br.type,
      scenario: br.scenario,
      challengerIds: br.challengerIds,
      submissions: br.submissions,
      hasChallengerIds: Array.isArray(br.challengerIds),
      hasSubmissions: typeof br.submissions === "object",
    });
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row" style={{ background: "var(--cc-dark)" }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        {bgIcons.map((props, i) => <FloatingIcon key={i} {...props} />)}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="relative flex flex-1 flex-col px-3 py-4 sm:px-4 sm:py-6 lg:px-10 lg:py-8">
        {/* Top bar */}
        <div className="mb-3 flex items-center justify-between gap-2 sm:mb-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12 sm:rounded-2xl"
              style={{ background: `${roundColor}15`, border: `2px solid ${roundColor}30` }}>
              <RoundIcon className="h-4 w-4 sm:h-6 sm:w-6" style={{ color: roundColor }} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <p className="text-base font-black sm:text-xl" style={{ color: "#fff" }}>
                  {'Round '}
                  <span style={{ color: roundColor }}>{room.currentQuestion + 1}</span>
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>{' of '}{room.totalQuestions}</span>
                </p>
                {round.difficulty && (
                  <span className="rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider sm:px-2 sm:text-[9px]"
                    style={{ background: `${DIFFICULTY_COLORS[round.difficulty]}15`, color: DIFFICULTY_COLORS[round.difficulty], border: `1px solid ${DIFFICULTY_COLORS[round.difficulty]}30` }}>
                    {DIFFICULTY_LABELS[round.difficulty]}
                  </span>
                )}
              </div>
              <p className="truncate text-[9px] font-bold tracking-wider uppercase sm:text-[10px]" style={{ color: roundColor }}>
                {ROUND_TYPE_LABELS[roundType]}
                {round.category && <span style={{ color: "rgba(255,255,255,0.2)" }}>{' \u2022 '}{round.category}</span>}
              </p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="hidden items-center gap-1.5 sm:flex" aria-label="Question progress">
            {Array.from({ length: room.totalQuestions }).map((_, i) => {
              const answered = player && player.answers.length > i;
              const correct = player && player.answers[i] === true;
              const qi = room.questionSet[i];
              const qColor = qi ? ROUND_TYPE_COLORS[qi.type] : "#fff";
              return (
                <div key={i} className="h-2.5 w-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: answered ? (correct ? "#39FF14" : "#FF2D78") : i === room.currentQuestion ? qColor : "rgba(255,255,255,0.1)",
                    boxShadow: i === room.currentQuestion ? `0 0 8px ${qColor}60` : "none",
                    transform: i === room.currentQuestion ? "scale(1.3)" : "scale(1)",
                  }}
                />
              );
            })}
          </div>

          {/* Timer */}
          {!showingResults && (
            <div className="flex shrink-0 items-center">
              <div className="relative">
                <svg className="-rotate-90" width="48" height="48" viewBox="0 0 64 64" aria-hidden="true">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke={timerColor} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={`${(timerPercent / 100) * 176} 176`}
                    style={{ transition: "stroke-dasharray 0.3s linear, stroke 0.3s ease", filter: `drop-shadow(0 0 6px ${timerColor}60)` }} />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-sm font-black tabular-nums sm:text-lg ${timeLeft <= 5 ? "animate-countdown-pulse" : ""}`}
                  style={{ color: timerColor }}>{Math.ceil(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Streak */}
        {playerStreak >= 2 && !showingResults && (
          <div className="animate-pop-in mb-3 flex items-center justify-center gap-1.5 rounded-full py-1.5 sm:mb-4 sm:gap-2 sm:py-2" style={{ background: "rgba(255,184,0,0.08)" }}>
            <Flame className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#FFB800" }} />
            <span className="text-xs font-black uppercase tracking-wider sm:text-sm" style={{ color: "#FFB800" }}>{playerStreak}x Streak!</span>
            {Array.from({ length: Math.min(playerStreak, 5) }).map((_, i) => (
              <Flame key={i} className="hidden h-4 w-4 sm:block" style={{ color: "#FFB800", opacity: 0.4 + (i * 0.15) }} />
            ))}
          </div>
        )}

        {/* Answered players tracker */}
        {!showingResults && (
          <div className="mb-3 flex items-center justify-center gap-2 sm:mb-4 sm:gap-3">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
              {room.players.map((p) => {
                const pAnswered = p.answers.length > room.currentQuestion;
                return (
                  <div key={p.id} className="relative flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-black transition-all duration-300 sm:h-8 sm:w-8 sm:rounded-lg sm:text-[10px]"
                    style={{
                      background: pAnswered ? `${roundColor}15` : "rgba(255,255,255,0.04)",
                      border: `2px solid ${pAnswered ? `${roundColor}40` : "rgba(255,255,255,0.08)"}`,
                      color: pAnswered ? roundColor : "rgba(255,255,255,0.25)",
                    }} title={`${p.name}${pAnswered ? " (answered)" : ""}`}>
                    {p.name.charAt(0).toUpperCase()}
                    {pAnswered && <CheckCircle2 className="absolute -top-1 -right-1 h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: roundColor, background: "var(--cc-dark)", borderRadius: "50%" }} />}
                  </div>
                );
              })}
            </div>
            <span className="text-[10px] font-bold sm:text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{answeredCount}/{room.players.length}</span>
          </div>
        )}

        {/* Investigate prompt */}
        {!showingResults && !hasAnswered && timeLeft > 0 && roundType !== "password_battle" && (
          <div className="mb-2 flex items-center justify-center gap-1.5 sm:mb-3 sm:gap-2">
            <Search className="hidden h-4 w-4 animate-float sm:block" style={{ color: roundColor, animationDuration: "2s" }} />
            <span className="text-center text-[10px] font-bold uppercase tracking-wider sm:text-xs" style={{ color: `${roundColor}80` }}>
              {roundType === "phish" ? "Read the email carefully. Look at the sender, links, and tone..." 
                : roundType === "password" ? "Analyze the password. Consider length, patterns, and character variety..." 
                : "Examine each URL closely. Check the root domain..."}
            </span>
          </div>
        )}

        {/* === ROUND CONTENT === */}
        {roundType === "phish" && <PhishContent round={round as PhishRound} showingResults={showingResults} highlightClues={highlightClues} />}
        {roundType === "password" && <PasswordContent round={round as PasswordRound} showingResults={showingResults} />}
        {roundType === "spot_url" && <URLContent round={round as SpotURLRound} showingResults={showingResults} highlightClues={highlightClues} />}
        {roundType === "password_battle" && (
          <PasswordBattleContent
            round={round as PasswordBattleRound}
            playerId={playerId}
            players={room.players}
            showingResults={showingResults}
            timeLeft={timeLeft}
            onSubmit={onBattleSubmit}
          />
        )}

        {/* === ANSWER AREA === */}
        {roundType !== "password_battle" && (
          !showingResults ? (
            <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-4">
              {hasAnswered ? (
                <LockedInState players={room.players} currentQuestion={room.currentQuestion} answeredCount={answeredCount} color={roundColor} />
              ) : timeLeft <= 0 ? (
                <TimesUpState />
              ) : roundType === "phish" ? (
                <PhishButtons onAnswer={handleAnswer} disabled={submittingRef.current} />
              ) : roundType === "password" ? (
                <PasswordButtons round={round as PasswordRound} onAnswer={handleAnswer} disabled={submittingRef.current} />
              ) : (
                <URLButtons round={round as SpotURLRound} onAnswer={handleAnswer} disabled={submittingRef.current} />
              )}
            </div>
          ) : (
            <ResultsReveal
              round={round}
              room={room}
              playerId={playerId}
              wasCorrect={wasCorrect}
              playerStreak={playerStreak}
              showScorePopup={showScorePopup}
              showExplanation={showExplanation}
              highlightClues={highlightClues}
              showFunFact={showFunFact}
              isHost={isHost}
              onNextQuestion={() => { if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current); onNextQuestion(); }}
            />
          )
        )}

        {/* Battle results */}
        {roundType === "password_battle" && showingResults && (
          <BattleResultsReveal
            round={round as PasswordBattleRound}
            room={room}
            playerId={playerId}
            showExplanation={showExplanation}
            showFunFact={showFunFact}
            isHost={isHost}
            onNextQuestion={() => { if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current); onNextQuestion(); }}
          />
        )}
      </div>

      {/* Sidebar leaderboard */}
      <div className="hidden w-80 shrink-0 flex-col p-6 lg:flex" style={{ borderLeft: "3px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.2)" }}>
        <Leaderboard players={room.players} myPlayerId={playerId} />
        {!showingResults && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl py-3" style={{ background: "rgba(255,255,255,0.03)" }}>
            <User className="h-4 w-4" style={{ color: "rgba(255,255,255,0.3)" }} />
            <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>{answeredCount}/{room.players.length} answered</span>
          </div>
        )}
      </div>
      <div className="px-3 pb-4 sm:px-4 sm:pb-6 lg:hidden">
        <Leaderboard players={room.players} myPlayerId={playerId} compact />
      </div>
    </div>
  );
}

/* ────────────────── PHISH ROUND CONTENT ──────────────────── */

function PhishContent({ round, showingResults, highlightClues }: { round: PhishRound; showingResults: boolean; highlightClues: boolean }) {
  return (
    <div className="animate-slide-up mb-1 overflow-hidden rounded-3xl border-[3px]"
      style={{
        background: "var(--cc-card)",
        borderColor: showingResults ? (round.isPhishing ? "rgba(255,45,120,0.4)" : "rgba(57,255,20,0.4)") : "rgba(255,255,255,0.08)",
        transition: "border-color 0.5s ease",
        boxShadow: showingResults ? `0 0 40px ${round.isPhishing ? "rgba(255,45,120,0.1)" : "rgba(57,255,20,0.1)"}` : "none",
      }}>
      <div className="px-4 py-3 sm:px-6 sm:py-4" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="flex flex-col gap-1.5 sm:gap-2">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="text-[9px] font-black tracking-[0.15em] uppercase sm:text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>From</span>
            <span className="text-xs font-bold sm:text-sm" style={{ color: "#00E5FF" }}>
              {round.from}{" "}
              <span className="break-all font-mono text-[10px] sm:text-xs" style={{
                color: showingResults && highlightClues && round.isPhishing ? "#FF2D78" : "rgba(255,255,255,0.35)",
                background: showingResults && highlightClues && round.isPhishing ? "rgba(255,45,120,0.1)" : "transparent",
                padding: showingResults && highlightClues && round.isPhishing ? "2px 6px" : "0",
                borderRadius: "6px", transition: "all 0.5s ease",
              }}>{"<"}{round.fromEmail}{">"}</span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="text-[9px] font-black tracking-[0.15em] uppercase sm:text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>Subject</span>
            <span className="text-xs font-bold sm:text-sm" style={{ color: "#fff" }}>{round.subject}</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <p className="whitespace-pre-line font-mono text-xs leading-relaxed sm:text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{round.body}</p>
      </div>
      {showingResults && (
        <div className="animate-pop-in flex items-center justify-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-5"
          style={{ background: round.isPhishing ? "rgba(255,45,120,0.08)" : "rgba(57,255,20,0.08)", borderTop: `3px solid ${round.isPhishing ? "rgba(255,45,120,0.2)" : "rgba(57,255,20,0.2)"}` }}>
          {round.isPhishing ? <Fish className="h-5 w-5 sm:h-7 sm:w-7" style={{ color: "#FF2D78" }} /> : <ShieldCheck className="h-5 w-5 sm:h-7 sm:w-7" style={{ color: "#39FF14" }} />}
          <span className="text-lg font-black uppercase tracking-wider sm:text-2xl" style={{ color: round.isPhishing ? "#FF2D78" : "#39FF14" }}>
            {round.isPhishing ? "Phishing!" : "Legitimate!"}
          </span>
        </div>
      )}
    </div>
  );
}

/* ────────────────── PASSWORD ROUND CONTENT ──────────────────── */

function PasswordContent({ round, showingResults }: { round: PasswordRound; showingResults: boolean }) {
  const strengthColors = ["#39FF14", "#FFB800", "#FF2D78"];
  const correctColor = strengthColors[round.correctAnswer] ?? "#FFB800";

  return (
    <div className="animate-slide-up mb-1 overflow-hidden rounded-3xl border-[3px]"
      style={{
        background: "var(--cc-card)",
        borderColor: showingResults ? `${correctColor}40` : "rgba(255,255,255,0.08)",
        transition: "border-color 0.5s ease",
      }}>
      <div className="flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: "rgba(168,85,247,0.03)" }}>
        <KeyRound className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#A855F7" }} />
        <span className="text-[10px] font-black tracking-[0.15em] uppercase sm:text-xs" style={{ color: "#A855F7" }}>Rate This Password</span>
      </div>
      <div className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
        <div className="rounded-2xl border-[3px] px-4 py-3 sm:px-8 sm:py-5" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="font-mono text-lg font-bold tracking-wider sm:text-2xl md:text-3xl" style={{ color: "#fff", wordBreak: "break-all" }}>
            {round.password}
          </p>
        </div>
      </div>
      {showingResults && (
        <div className="animate-pop-in flex items-center justify-center gap-3 px-6 py-5"
          style={{ background: `${correctColor}08`, borderTop: `3px solid ${correctColor}20` }}>
          <span className="text-2xl font-black uppercase tracking-wider" style={{ color: correctColor }}>
            {round.options[round.correctAnswer]}
          </span>
        </div>
      )}
    </div>
  );
}

/* ────────────────── URL ROUND CONTENT ──────────────────── */

function URLContent({ round, showingResults, highlightClues }: { round: SpotURLRound; showingResults: boolean; highlightClues: boolean }) {
  return (
    <div className="animate-slide-up mb-1 overflow-hidden rounded-3xl border-[3px]"
      style={{
        background: "var(--cc-card)",
        borderColor: showingResults ? "rgba(249,115,22,0.4)" : "rgba(255,255,255,0.08)",
        transition: "border-color 0.5s ease",
      }}>
      <div className="flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: "rgba(249,115,22,0.03)" }}>
        <Globe className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#F97316" }} />
        <span className="text-[10px] font-black tracking-[0.15em] uppercase sm:text-xs" style={{ color: "#F97316" }}>Spot the Real URL</span>
      </div>
      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{round.scenario}</p>
      </div>
      {showingResults && (
        <div className="flex flex-col gap-2 px-4 pb-4 sm:px-6 sm:pb-6">
          {round.urls.map((u, i) => (
            <div key={i} className="animate-pop-in flex items-center gap-2 rounded-xl px-3 py-2 sm:gap-3 sm:px-4 sm:py-3"
              style={{
                background: i === round.correctIndex ? "rgba(57,255,20,0.08)" : "rgba(255,45,120,0.05)",
                border: `2px solid ${i === round.correctIndex ? "rgba(57,255,20,0.3)" : "rgba(255,45,120,0.15)"}`,
                animationDelay: `${i * 0.1}s`,
              }}>
              {i === round.correctIndex ? <CheckCircle2 className="h-5 w-5 shrink-0" style={{ color: "#39FF14" }} /> : <XCircle className="h-5 w-5 shrink-0" style={{ color: "#FF2D78" }} />}
              <span className="font-mono text-sm" style={{ color: i === round.correctIndex ? "#39FF14" : "#FF2D78", wordBreak: "break-all" }}>{u.url}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────── ANSWER BUTTONS ──────────────────── */

function PhishButtons({ onAnswer, disabled }: { onAnswer: (a: number) => void; disabled: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <button onClick={() => onAnswer(1)} disabled={disabled}
        className="jackbox-btn group flex flex-col items-center gap-2 rounded-2xl border-[3px] px-4 py-5 disabled:pointer-events-none disabled:opacity-50 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-8"
        style={{ background: "rgba(255,45,120,0.06)", borderColor: "rgba(255,45,120,0.25)" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF2D78"; e.currentTarget.style.background = "rgba(255,45,120,0.12)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(255,45,120,0.15)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,45,120,0.25)"; e.currentTarget.style.background = "rgba(255,45,120,0.06)"; e.currentTarget.style.boxShadow = "none"; }}>
        <Fish className="h-10 w-10 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[-8deg] sm:h-14 sm:w-14" style={{ color: "#FF2D78" }} />
        <span className="text-lg font-black uppercase tracking-wide sm:text-2xl" style={{ color: "#FF2D78" }}>Phishing</span>
        <span className="hidden text-[11px] font-bold sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>{"It's a scam!"}</span>
      </button>
      <button onClick={() => onAnswer(0)} disabled={disabled}
        className="jackbox-btn group flex flex-col items-center gap-2 rounded-2xl border-[3px] px-4 py-5 disabled:pointer-events-none disabled:opacity-50 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-8"
        style={{ background: "rgba(57,255,20,0.04)", borderColor: "rgba(57,255,20,0.25)" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#39FF14"; e.currentTarget.style.background = "rgba(57,255,20,0.10)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(57,255,20,0.15)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(57,255,20,0.25)"; e.currentTarget.style.background = "rgba(57,255,20,0.04)"; e.currentTarget.style.boxShadow = "none"; }}>
        <ShieldCheck className="h-10 w-10 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[8deg] sm:h-14 sm:w-14" style={{ color: "#39FF14" }} />
        <span className="text-lg font-black uppercase tracking-wide sm:text-2xl" style={{ color: "#39FF14" }}>Legit</span>
        <span className="hidden text-[11px] font-bold sm:block" style={{ color: "rgba(255,255,255,0.3)" }}>{"It's real!"}</span>
      </button>
    </div>
  );
}

function PasswordButtons({ round, onAnswer, disabled }: { round: PasswordRound; onAnswer: (a: number) => void; disabled: boolean }) {
  const colors = ["#39FF14", "#FFB800", "#FF2D78"];
  const icons = [ShieldCheck, AlertTriangle, XCircle];
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {round.options.map((opt, i) => {
        const Icon = icons[i];
        const color = colors[i];
        return (
          <button key={i} onClick={() => onAnswer(i)} disabled={disabled}
            className="jackbox-btn group flex flex-col items-center gap-2 rounded-2xl border-[3px] px-2 py-4 disabled:pointer-events-none disabled:opacity-50 sm:gap-3 sm:rounded-3xl sm:px-4 sm:py-6"
            style={{ background: `${color}08`, borderColor: `${color}25` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}15`; e.currentTarget.style.boxShadow = `0 0 25px ${color}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.background = `${color}08`; e.currentTarget.style.boxShadow = "none"; }}>
            <Icon className="h-7 w-7 transition-transform duration-200 group-hover:scale-110 sm:h-10 sm:w-10" style={{ color }} />
            <span className="text-sm font-black uppercase tracking-wide sm:text-lg" style={{ color }}>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function URLButtons({ round, onAnswer, disabled }: { round: SpotURLRound; onAnswer: (a: number) => void; disabled: boolean }) {
  const colors = ["#00E5FF", "#FF2D78", "#FFB800"];
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      {round.urls.map((u, i) => (
        <button key={i} onClick={() => onAnswer(i)} disabled={disabled}
          className="jackbox-btn group flex items-center gap-3 rounded-2xl border-[3px] px-3 py-3 text-left disabled:pointer-events-none disabled:opacity-50 sm:gap-4 sm:px-5 sm:py-5"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.08)" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors[i % colors.length]; e.currentTarget.style.background = `${colors[i % colors.length]}08`; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm"
            style={{ background: `${colors[i % colors.length]}15`, color: colors[i % colors.length] }}>
            {String.fromCharCode(65 + i)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs font-bold sm:text-sm" style={{ color: "#fff", wordBreak: "break-all" }}>{u.url}</p>
            <p className="text-[9px] font-bold uppercase tracking-wider sm:text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{u.label}</p>
          </div>
          <Link2 className="hidden h-5 w-5 shrink-0 opacity-30 transition-opacity group-hover:opacity-100 sm:block" style={{ color: colors[i % colors.length] }} />
        </button>
      ))}
    </div>
  );
}

/* ────────────────── SHARED STATES ──────────────────── */

function LockedInState({ players, currentQuestion, answeredCount, color }: { players: GameRoom["players"]; currentQuestion: number; answeredCount: number; color: string }) {
  return (
    <div className="animate-pop-in flex flex-col items-center gap-3 rounded-2xl border-[3px] px-5 py-5 sm:gap-4 sm:rounded-3xl sm:px-8 sm:py-8"
      style={{ background: "var(--cc-card)", borderColor: `${color}20` }}>
      <Lock className="h-8 w-8 animate-float sm:h-12 sm:w-12" style={{ color }} />
      <p className="text-lg font-black uppercase sm:text-2xl" style={{ color: "#fff" }}>Answer Locked In!</p>
      <div className="flex items-center gap-1.5">
        {players.map((p) => {
          const pAnswered = p.answers.length > currentQuestion;
          return <div key={p.id} className="h-3 w-3 rounded-full transition-all duration-300"
            style={{ background: pAnswered ? color : "rgba(255,255,255,0.1)", boxShadow: pAnswered ? `0 0 6px ${color}60` : "none" }} />;
        })}
      </div>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
        {answeredCount === players.length ? "All players answered! Revealing..." : `${answeredCount}/${players.length} players answered`}
      </span>
    </div>
  );
}

function TimesUpState() {
  return (
    <div className="animate-pop-in flex flex-col items-center gap-3 rounded-2xl border-[3px] px-5 py-5 sm:gap-4 sm:rounded-3xl sm:px-8 sm:py-8"
      style={{ background: "rgba(255,45,120,0.04)", borderColor: "rgba(255,45,120,0.2)" }}>
      <AlertTriangle className="h-8 w-8 animate-wiggle sm:h-12 sm:w-12" style={{ color: "#FF2D78" }} />
      <p className="text-lg font-black uppercase sm:text-2xl" style={{ color: "#FF2D78" }}>{"Time's Up!"}</p>
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>You did not answer in time</span>
    </div>
  );
}

/* ────────────────── RESULTS REVEAL ────────────���─────── */

function ResultsReveal({ round, room, playerId, wasCorrect, playerStreak, showScorePopup, showExplanation, highlightClues, showFunFact, isHost, onNextQuestion }: {
  round: GameRound; room: GameRoom; playerId: string; wasCorrect: boolean | null; playerStreak: number; showScorePopup: boolean;
  showExplanation: boolean; highlightClues: boolean; showFunFact: boolean; isHost: boolean; onNextQuestion: () => void;
}) {
  return (
    <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-4">
      {/* Score popup */}
      {showScorePopup && (
        <div className="flex items-center justify-center">
          <div className="animate-pop-in flex items-center gap-3 rounded-2xl px-4 py-3 sm:gap-4 sm:px-6 sm:py-4"
            style={{
              background: wasCorrect ? "rgba(57,255,20,0.08)" : wasCorrect === false ? "rgba(255,45,120,0.08)" : "rgba(255,184,0,0.08)",
              border: `3px solid ${wasCorrect ? "rgba(57,255,20,0.3)" : wasCorrect === false ? "rgba(255,45,120,0.3)" : "rgba(255,184,0,0.3)"}`,
            }}>
            {wasCorrect === true ? (
              <>
                <CheckCircle2 className="h-7 w-7 shrink-0 sm:h-10 sm:w-10" style={{ color: "#39FF14" }} />
                <div>
                  <p className="text-lg font-black uppercase sm:text-2xl" style={{ color: "#39FF14" }}>Correct!</p>
                  <p className="text-[10px] font-bold sm:text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{playerStreak >= 2 ? `${playerStreak}x streak bonus!` : "Nice catch!"}</p>
                </div>
                <div className="ml-1 flex items-center gap-1 sm:ml-2">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#FFB800" }} />
                  <span className="text-base font-black sm:text-xl" style={{ color: "#FFB800" }}>+100</span>
                </div>
              </>
            ) : wasCorrect === false ? (
              <>
                <XCircle className="h-7 w-7 shrink-0 sm:h-10 sm:w-10" style={{ color: "#FF2D78" }} />
                <div>
                  <p className="text-lg font-black uppercase sm:text-2xl" style={{ color: "#FF2D78" }}>Wrong!</p>
                  <p className="text-[10px] font-bold sm:text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Better luck next round</p>
                </div>
              </>
            ) : (
              <>
                <Clock className="h-7 w-7 shrink-0 sm:h-10 sm:w-10" style={{ color: "#FFB800" }} />
                <div>
                  <p className="text-lg font-black uppercase sm:text-2xl" style={{ color: "#FFB800" }}>{"Time's Up!"}</p>
                  <p className="text-[10px] font-bold sm:text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>No answer submitted</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Player answers grid */}
      <div className="animate-slide-up flex flex-wrap items-center justify-center gap-2 rounded-2xl border-[3px] px-4 py-3 sm:gap-3 sm:rounded-3xl sm:px-6 sm:py-4"
        style={{ background: "var(--cc-card)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mb-1 flex w-full items-center justify-center gap-2 sm:mb-2">
          <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "rgba(255,255,255,0.4)" }} />
          <span className="text-[9px] font-black tracking-[0.15em] uppercase sm:text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>How everyone answered</span>
        </div>
        {room.players.map((p) => {
          const pAnswered = p.answers.length > room.currentQuestion;
          const pCorrect = pAnswered ? p.answers[room.currentQuestion] : null;
          return (
            <div key={p.id} className="flex flex-col items-center gap-1" title={p.name}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black transition-all duration-300 sm:h-10 sm:w-10 sm:rounded-xl sm:text-xs"
                style={{
                  background: pCorrect === true ? "rgba(57,255,20,0.15)" : pCorrect === false ? "rgba(255,45,120,0.15)" : "rgba(255,184,0,0.1)",
                  border: `2px solid ${pCorrect === true ? "rgba(57,255,20,0.3)" : pCorrect === false ? "rgba(255,45,120,0.3)" : "rgba(255,184,0,0.2)"}`,
                  color: pCorrect === true ? "#39FF14" : pCorrect === false ? "#FF2D78" : "#FFB800",
                }}>
                {pCorrect === true ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : pCorrect === false ? <XCircle className="h-4 w-4 sm:h-5 sm:w-5" /> : <Clock className="h-4 w-4 sm:h-5 sm:w-5" />}
              </div>
              <span className="max-w-[44px] truncate text-[9px] font-bold sm:max-w-[52px] sm:text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{p.name}</span>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && round.explanation && (
        <div className="animate-slide-up flex gap-3 rounded-2xl border-[3px] px-4 py-4 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-5" style={{ background: "rgba(255,184,0,0.04)", borderColor: "rgba(255,184,0,0.15)" }}>
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" style={{ color: "#FFB800" }} />
          <div>
            <p className="mb-1.5 text-[9px] font-black tracking-[0.15em] uppercase sm:mb-2 sm:text-[10px]" style={{ color: "#FFB800" }}>Explanation</p>
            <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{round.explanation}</p>
          </div>
        </div>
      )}

      {/* Clues */}
      {highlightClues && "clues" in round && round.clues.length > 0 && (
        <div className="animate-slide-up flex gap-3 rounded-2xl border-[3px] px-4 py-4 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-5" style={{ background: "rgba(0,229,255,0.03)", borderColor: "rgba(0,229,255,0.12)" }}>
          <Eye className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" style={{ color: "#00E5FF" }} />
          <div>
            <p className="mb-2 text-[9px] font-black tracking-[0.15em] uppercase sm:mb-3 sm:text-[10px]" style={{ color: "#00E5FF" }}>Key Clues</p>
            <div className="flex flex-wrap gap-2">
              {round.clues.map((clue: string, i: number) => (
                <span key={i} className="animate-pop-in flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
                  style={{ background: "rgba(0,229,255,0.08)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.15)", animationDelay: `${i * 0.12}s` }}>
                  <Target className="h-3 w-3" /> {clue}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fun fact */}
      {showFunFact && round.funFact && (
        <div className="animate-slide-up flex gap-3 rounded-2xl border-[3px] px-4 py-4 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-5" style={{ background: "rgba(168,85,247,0.04)", borderColor: "rgba(168,85,247,0.12)" }}>
          <Info className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" style={{ color: "#A855F7" }} />
          <div>
            <p className="mb-1.5 text-[9px] font-black tracking-[0.15em] uppercase sm:mb-2 sm:text-[10px]" style={{ color: "#A855F7" }}>Did You Know?</p>
            <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{round.funFact}</p>
          </div>
        </div>
      )}

      {/* Next button */}
      {isHost ? (
        <button onClick={onNextQuestion}
          className="jackbox-btn flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base sm:gap-3 sm:px-6 sm:py-5 sm:text-lg"
          style={{ background: "#00E5FF", color: "var(--cc-dark)", boxShadow: "0 4px 30px rgba(0,229,255,0.3)" }}>
          {room.currentQuestion < room.totalQuestions - 1 ? "Next Round" : "See Final Results"}
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00E5FF" }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Next round loading...</span>
        </div>
      )}
    </div>
  );
}

/* ────────────────── PASSWORD BATTLE ROUND ──────────────────── */

function ScoreBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-16 shrink-0 text-right text-[9px] font-bold uppercase tracking-wider sm:text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-6 text-[10px] font-black tabular-nums" style={{ color }}>{value}</span>
    </div>
  );
}

function PasswordBattleContent({
  round, playerId, players, showingResults, timeLeft, onSubmit,
}: {
  round: PasswordBattleRound; playerId: string; players: GameRoom["players"];
  showingResults: boolean; timeLeft: number; onSubmit: (password: string) => void;
}) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // Guard against missing data from Redis deserialization
  const challengerIds = round.challengerIds ?? [];
  const submissions = round.submissions ?? {};
  const isChallenger = challengerIds.includes(playerId);
  const alreadySubmitted = !!submissions[playerId];
  const hasSubmitted = submitted || alreadySubmitted;

  // Reset input when question changes
  useEffect(() => {
    setInput("");
    setSubmitted(false);
  }, [round.id]);

  const handleSubmit = () => {
    if (!input.trim() || hasSubmitted) return;
    setSubmitted(true);
    onSubmit(input.trim());
  };

  const challenger1 = players.find((p) => p.id === challengerIds[0]);
  const challenger2 = players.find((p) => p.id === challengerIds[1]);

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Scenario card */}
      <div className="animate-slide-up overflow-hidden rounded-2xl border-[3px] sm:rounded-3xl"
        style={{ background: "var(--cc-card)", borderColor: showingResults ? "rgba(236,72,153,0.4)" : "rgba(236,72,153,0.15)" }}>
        <div className="flex items-center gap-2 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: "rgba(236,72,153,0.03)" }}>
          <Swords className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#EC4899" }} />
          <span className="text-[10px] font-black tracking-[0.15em] uppercase sm:text-xs" style={{ color: "#EC4899" }}>Password Battle</span>
        </div>
        <div className="px-4 py-4 sm:px-6 sm:py-6">
          <p className="text-center text-sm font-bold leading-relaxed sm:text-base" style={{ color: "rgba(255,255,255,0.85)" }}>{round.scenario}</p>
        </div>
        <div className="flex items-center justify-center gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black sm:h-14 sm:w-14"
              style={{ background: "rgba(0,229,255,0.15)", color: "#00E5FF", border: "2px solid rgba(0,229,255,0.3)" }}>
              {challenger1?.name.charAt(0).toUpperCase() ?? "?"}
            </div>
            <span className="max-w-[64px] truncate text-[10px] font-bold sm:text-xs" style={{ color: "#00E5FF" }}>{challenger1?.name ?? "???"}</span>
          </div>
          <div className="flex flex-col items-center">
            <Swords className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: "#EC4899" }} />
            <span className="text-[8px] font-black uppercase tracking-wider" style={{ color: "#EC4899" }}>VS</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black sm:h-14 sm:w-14"
              style={{ background: "rgba(255,184,0,0.15)", color: "#FFB800", border: "2px solid rgba(255,184,0,0.3)" }}>
              {challenger2?.name.charAt(0).toUpperCase() ?? "?"}
            </div>
            <span className="max-w-[64px] truncate text-[10px] font-bold sm:text-xs" style={{ color: "#FFB800" }}>{challenger2?.name ?? "???"}</span>
          </div>
        </div>
      </div>

      {/* Input / spectator view */}
      {!showingResults && (
        isChallenger ? (
          hasSubmitted ? (
            <div className="animate-pop-in flex flex-col items-center gap-3 rounded-2xl border-[3px] px-5 py-5 sm:gap-4 sm:rounded-3xl sm:px-8 sm:py-8"
              style={{ background: "var(--cc-card)", borderColor: "rgba(236,72,153,0.2)" }}>
              <Lock className="h-8 w-8 animate-float sm:h-12 sm:w-12" style={{ color: "#EC4899" }} />
              <p className="text-lg font-black uppercase sm:text-2xl" style={{ color: "#fff" }}>Password Submitted!</p>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                {"Waiting for opponent..."}
              </span>
            </div>
          ) : timeLeft <= 0 ? (
            <TimesUpState />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <label className="text-[10px] font-black tracking-[0.15em] uppercase sm:text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Create your strongest password
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your password..."
                    maxLength={64}
                    autoComplete="off"
                    autoFocus
                    className="flex-1 rounded-xl border-[3px] border-white/10 px-4 py-3 font-mono text-base font-bold outline-none transition-all duration-200 focus:border-[#EC4899] sm:rounded-2xl sm:px-5 sm:py-4 sm:text-lg"
                    style={{ background: "var(--cc-card)", color: "#fff" }}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="jackbox-btn flex shrink-0 items-center justify-center gap-2 rounded-xl border-[3px] px-4 py-3 font-black uppercase disabled:opacity-30 sm:rounded-2xl sm:px-6"
                    style={{ borderColor: "#EC4899", background: "rgba(236,72,153,0.1)", color: "#EC4899" }}>
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Submit</span>
                  </button>
                </div>
              </div>
              {input.length > 0 && <PasswordStrengthPreview password={input} />}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-[3px] border-dashed px-5 py-6 sm:gap-4 sm:rounded-3xl sm:px-8 sm:py-8"
            style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <Eye className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "rgba(255,255,255,0.2)" }} />
            <p className="text-base font-black uppercase sm:text-xl" style={{ color: "rgba(255,255,255,0.3)" }}>Spectating</p>
            <p className="text-center text-xs font-bold sm:text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
              {challenger1?.name} and {challenger2?.name} are creating passwords...
            </p>
            <div className="flex items-center gap-3">
              {challengerIds.map((cid) => {
                const done = !!submissions[cid];
                return (
                  <div key={cid} className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full" style={{ background: done ? "#39FF14" : "rgba(255,255,255,0.1)", boxShadow: done ? "0 0 6px rgba(57,255,20,0.5)" : "none" }} />
                    <span className="text-[10px] font-bold" style={{ color: done ? "#39FF14" : "rgba(255,255,255,0.3)" }}>
                      {players.find((p) => p.id === cid)?.name ?? "???"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
}

function PasswordStrengthPreview({ password }: { password: string }) {
  const len = password.length;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const checks = [hasUpper, hasLower, hasNum, hasSymbol].filter(Boolean).length;
  const score = Math.min(100, len * 2 + checks * 10 + (new Set(password.split("")).size / Math.max(len, 1)) * 20);
  const color = score >= 70 ? "#39FF14" : score >= 40 ? "#FFB800" : "#FF2D78";
  const label = score >= 70 ? "Strong" : score >= 40 ? "Medium" : "Weak";

  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color }}>{label}</span>
    </div>
  );
}

function BattleResultsReveal({
  round, room, playerId, showExplanation, showFunFact, isHost, onNextQuestion,
}: {
  round: PasswordBattleRound; room: GameRoom; playerId: string;
  showExplanation: boolean; showFunFact: boolean; isHost: boolean; onNextQuestion: () => void;
}) {
  const challengerIds = round.challengerIds ?? [];
  const submissions = round.submissions ?? {};
  const [id1, id2] = challengerIds.length >= 2 ? challengerIds : ["", ""];
  const sub1 = submissions[id1];
  const sub2 = submissions[id2];
  const p1 = room.players.find((p) => p.id === id1);
  const p2 = room.players.find((p) => p.id === id2);
  const score1 = sub1?.score ?? 0;
  const score2 = sub2?.score ?? 0;
  const winnerId = score1 > score2 ? id1 : score2 > score1 ? id2 : null;
  const isTie = score1 === score2 && !!sub1 && !!sub2;

  return (
    <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:gap-4">
      {/* Winner banner */}
      <div className="animate-pop-in flex items-center justify-center">
        {isTie ? (
          <div className="flex items-center gap-3 rounded-2xl px-5 py-3 sm:px-6 sm:py-4" style={{ background: "rgba(255,184,0,0.08)", border: "3px solid rgba(255,184,0,0.3)" }}>
            <Swords className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: "#FFB800" }} />
            <span className="text-lg font-black uppercase tracking-wider sm:text-2xl" style={{ color: "#FFB800" }}>{"It's a Tie!"}</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl px-5 py-3 sm:px-6 sm:py-4" style={{ background: "rgba(57,255,20,0.08)", border: "3px solid rgba(57,255,20,0.3)" }}>
            <Crown className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: "#FFB800" }} />
            <span className="text-lg font-black uppercase tracking-wider sm:text-2xl" style={{ color: "#39FF14" }}>
              {room.players.find((p) => p.id === winnerId)?.name ?? "???"} Wins!
            </span>
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: "#FFB800" }} />
              <span className="text-base font-black sm:text-xl" style={{ color: "#FFB800" }}>+200</span>
            </div>
          </div>
        )}
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[{ id: id1, sub: sub1, player: p1, color: "#00E5FF" }, { id: id2, sub: sub2, player: p2, color: "#FFB800" }].map(({ id, sub: s, player: pl, color }) => {
          const isWinner = winnerId === id;
          return (
            <div key={id} className="animate-slide-up overflow-hidden rounded-2xl border-[3px]"
              style={{
                background: "var(--cc-card)",
                borderColor: isWinner ? "rgba(57,255,20,0.4)" : "rgba(255,255,255,0.08)",
                boxShadow: isWinner ? "0 0 20px rgba(57,255,20,0.1)" : "none",
              }}>
              <div className="flex items-center justify-between gap-2 px-4 py-3" style={{ borderBottom: "3px solid rgba(255,255,255,0.06)", background: `${color}05` }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black" style={{ background: `${color}15`, color }}>
                    {pl?.name.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <span className="text-sm font-black" style={{ color }}>{pl?.name ?? "???"}</span>
                </div>
                {isWinner && <Trophy className="h-5 w-5" style={{ color: "#FFB800" }} />}
              </div>
              <div className="px-4 py-3">
                {s ? (
                  <>
                    <p className="mb-2 break-all rounded-lg px-3 py-2 font-mono text-sm font-bold sm:text-base" style={{ background: "rgba(255,255,255,0.04)", color: "#fff" }}>
                      {s.password}
                    </p>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>Strength Score</span>
                      <span className="text-xl font-black tabular-nums" style={{ color: s.score >= 70 ? "#39FF14" : s.score >= 40 ? "#FFB800" : "#FF2D78" }}>{s.score}/100</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <ScoreBar label="Length" value={s.breakdown.length} max={30} color="#00E5FF" />
                      <ScoreBar label="Upper" value={s.breakdown.uppercase} max={10} color="#A855F7" />
                      <ScoreBar label="Lower" value={s.breakdown.lowercase} max={10} color="#39FF14" />
                      <ScoreBar label="Numbers" value={s.breakdown.numbers} max={10} color="#FFB800" />
                      <ScoreBar label="Symbols" value={s.breakdown.symbols} max={10} color="#EC4899" />
                      <ScoreBar label="Entropy" value={s.breakdown.entropy} max={20} color="#F97316" />
                      {s.breakdown.dictionaryPenalty > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="w-16 shrink-0 text-right text-[9px] font-bold uppercase tracking-wider sm:text-[10px]" style={{ color: "#FF2D78" }}>Dict.</span>
                          <span className="text-[10px] font-black" style={{ color: "#FF2D78" }}>-{s.breakdown.dictionaryPenalty}</span>
                        </div>
                      )}
                      {s.breakdown.patternPenalty > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="w-16 shrink-0 text-right text-[9px] font-bold uppercase tracking-wider sm:text-[10px]" style={{ color: "#FF2D78" }}>Pattern</span>
                          <span className="text-[10px] font-black" style={{ color: "#FF2D78" }}>-{s.breakdown.patternPenalty}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="py-4 text-center text-sm font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>Did not submit</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && round.explanation && (
        <div className="animate-slide-up flex gap-3 rounded-2xl border-[3px] px-4 py-4 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-5" style={{ background: "rgba(255,184,0,0.04)", borderColor: "rgba(255,184,0,0.15)" }}>
          <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" style={{ color: "#FFB800" }} />
          <div>
            <p className="mb-1.5 text-[9px] font-black tracking-[0.15em] uppercase sm:mb-2 sm:text-[10px]" style={{ color: "#FFB800" }}>Explanation</p>
            <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{round.explanation}</p>
          </div>
        </div>
      )}

      {/* Fun fact */}
      {showFunFact && round.funFact && (
        <div className="animate-slide-up flex gap-3 rounded-2xl border-[3px] px-4 py-4 sm:gap-4 sm:rounded-3xl sm:px-6 sm:py-5" style={{ background: "rgba(168,85,247,0.04)", borderColor: "rgba(168,85,247,0.12)" }}>
          <Info className="mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6" style={{ color: "#A855F7" }} />
          <div>
            <p className="mb-1.5 text-[9px] font-black tracking-[0.15em] uppercase sm:mb-2 sm:text-[10px]" style={{ color: "#A855F7" }}>Did You Know?</p>
            <p className="text-xs leading-relaxed sm:text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{round.funFact}</p>
          </div>
        </div>
      )}

      {/* Next button */}
      {isHost ? (
        <button onClick={onNextQuestion}
          className="jackbox-btn flex items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base sm:gap-3 sm:px-6 sm:py-5 sm:text-lg"
          style={{ background: "#00E5FF", color: "var(--cc-dark)", boxShadow: "0 4px 30px rgba(0,229,255,0.3)" }}>
          {room.currentQuestion < room.totalQuestions - 1 ? "Next Round" : "See Final Results"}
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : (
        <div className="flex items-center justify-center gap-2 py-3">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "#00E5FF" }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Next round loading...</span>
        </div>
      )}
    </div>
  );
}
