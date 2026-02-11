// ─── Types ───────────────────────────────────────────────────────
export interface Question {
  id: number;
  from: string;
  subject: string;
  message: string;
  answer: "phishing" | "legitimate";
  hint: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  joinOrder: number;
  currentAnswer: "phishing" | "legitimate" | null;
  wasCorrect: boolean | null;
}

export type GameScreen = "join" | "lobby" | "playing" | "gameover";

export interface GameState {
  screen: GameScreen;
  players: Player[];
  currentQuestionIndex: number;
  timeLeft: number;
  hasAnswered: boolean;
  playerAnswer: "phishing" | "legitimate" | null;
  wasCorrect: boolean | null;
  showingResult: boolean;
  correctAnswer: "phishing" | "legitimate" | null;
  currentHint: string | null;
  myPlayerId: string | null;
  gameStartCountdown: number | null;
}

// ─── Questions ───────────────────────────────────────────────────
export const questions: Question[] = [
  {
    id: 1,
    from: "security@bankofamerica-alerts.com",
    subject: "URGENT: Your Account Has Been Compromised!",
    message:
      "Dear Valued Customer,\n\nWe detected unusual activity on your account. Your account will be SUSPENDED within 24 hours unless you verify your identity immediately.\n\nClick here to verify: http://boa-secure-login.sketchy-domain.com/verify\n\nBank of America Security Team",
    answer: "phishing",
    hint: "The sender domain 'bankofamerica-alerts.com' is not the real Bank of America domain. The urgency and threat of suspension are classic phishing tactics. The link goes to a suspicious domain.",
  },
  {
    id: 2,
    from: "noreply@github.com",
    subject: "[GitHub] A new sign-in from Chrome on Windows",
    message:
      "Hey there,\n\nWe noticed a new sign-in to your GitHub account.\n\nDevice: Chrome on Windows\nLocation: San Francisco, CA\nTime: Feb 10, 2026 at 3:42 PM PST\n\nIf this was you, no further action is needed. If you don't recognize this activity, please review your security settings at https://github.com/settings/security.\n\nThanks,\nThe GitHub Team",
    answer: "legitimate",
    hint: "This is a standard GitHub security notification. The sender is the real GitHub domain, the link goes to github.com, and it doesn't pressure you into clicking -- it says 'no action needed' if it was you.",
  },
  {
    id: 3,
    from: "+1 (555) 012-3456",
    subject: "SMS Text Message",
    message:
      "USPS: Your package has been held due to an incomplete address. Please update your delivery details within 12 hours to avoid return: usps-redelivery-update.com/track",
    answer: "phishing",
    hint: "This is 'smishing' (SMS phishing). USPS would never text you with a random domain. The URL 'usps-redelivery-update.com' is not a real USPS website. Real USPS tracking uses usps.com.",
  },
  {
    id: 4,
    from: "it-helpdesk@yourcompany.com",
    subject: "Password Expiry Notice - Action Required Today",
    message:
      "Hi Team,\n\nAs part of our quarterly security rotation, your network password will expire today at 5:00 PM.\n\nPlease click the link below to reset your password before the deadline:\nhttp://yourcompany-passwordreset.external-site.net/reset\n\nIT Help Desk\nExtension: 4501",
    answer: "phishing",
    hint: "While the sender looks internal, the password reset link goes to 'external-site.net' -- not your company's actual domain. Legitimate IT departments use internal systems for password resets, not external links.",
  },
  {
    id: 5,
    from: "noreply@accounts.google.com",
    subject: "Security alert: New device signed in",
    message:
      "New sign-in on Pixel 8\n\nHi there,\n\nYour Google Account was just signed in to from a Pixel 8 device. You're getting this email to make sure it was you.\n\nYou can check the activity at https://myaccount.google.com/notifications\n\nIf you did not sign in, your account may be compromised. Secure your account at https://myaccount.google.com/security\n\nGoogle LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043",
    answer: "legitimate",
    hint: "This is a real Google security notification. The sender is the genuine Google domain, links point to myaccount.google.com, and it includes Google's real physical address. The tone is calm and informational.",
  },
  {
    id: 6,
    from: "ceo@company-corp.com",
    subject: "Urgent Wire Transfer Needed - Confidential",
    message:
      "Hi,\n\nI need you to process a wire transfer of $45,000 to a vendor immediately. This is time-sensitive and confidential -- please don't discuss with anyone else on the team.\n\nI'm in meetings all day so just handle it and send me confirmation.\n\nThanks,\nJohn (CEO)",
    answer: "phishing",
    hint: "This is a classic CEO fraud / Business Email Compromise (BEC) attack. Red flags: urgency, secrecy ('don't discuss with anyone'), unusual request, and the CEO wouldn't typically email random employees about wire transfers.",
  },
  {
    id: 7,
    from: "notifications@linkedin.com",
    subject: "You appeared in 12 searches this week",
    message:
      "Hi there,\n\nYou appeared in 12 searches this week.\n\nSee who's looking at your profile:\nhttps://www.linkedin.com/me/search-appearances/\n\nTop search appearances:\n- Recruiter at Tech Corp\n- Hiring Manager at StartupXYZ\n\nLinkedIn Corporation, 1000 W Maude Ave, Sunnyvale, CA 94085",
    answer: "legitimate",
    hint: "This is a standard LinkedIn engagement email. The sender domain is linkedin.com, the link goes to linkedin.com, and search appearance notifications are a real LinkedIn feature. It includes their corporate address.",
  },
];

// ─── Bot names ───────────────────────────────────────────────────
export const BOT_NAMES = [
  "CyberNinja",
  "PhishHunter",
  "NetGuard42",
  "HackProof",
  "FirewallFox",
  "ByteShield",
  "ThreatEye",
  "SafeClick",
];

let playerCounter = 0;

export function createPlayer(name: string, isBot = false): Player {
  playerCounter++;
  return {
    id: isBot ? `bot-${playerCounter}` : `player-${playerCounter}`,
    name,
    score: 0,
    joinOrder: playerCounter,
    currentAnswer: null,
    wasCorrect: null,
  };
}

export function getBotAnswer(question: Question): "phishing" | "legitimate" {
  const correctChance = 0.65;
  if (Math.random() < correctChance) {
    return question.answer;
  }
  return question.answer === "phishing" ? "legitimate" : "phishing";
}

export function getInitialState(): GameState {
  playerCounter = 0;
  return {
    screen: "join",
    players: [],
    currentQuestionIndex: 0,
    timeLeft: 15,
    hasAnswered: false,
    playerAnswer: null,
    wasCorrect: null,
    showingResult: false,
    correctAnswer: null,
    currentHint: null,
    myPlayerId: null,
    gameStartCountdown: null,
  };
}

export type GameAction =
  | { type: "JOIN_GAME"; name: string }
  | { type: "START_GAME" }
  | { type: "SUBMIT_ANSWER"; answer: "phishing" | "legitimate" }
  | { type: "REVEAL_RESULT" }
  | { type: "NEXT_QUESTION" }
  | { type: "TICK" }
  | { type: "LOBBY_TICK" }
  | { type: "PLAY_AGAIN" };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "JOIN_GAME": {
      const player = createPlayer(action.name, false);
      const numBots = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...BOT_NAMES].sort(() => Math.random() - 0.5);
      const bots = shuffled.slice(0, numBots).map((n) => createPlayer(n, true));
      return {
        ...state,
        screen: "lobby",
        players: [player, ...bots],
        myPlayerId: player.id,
        gameStartCountdown: 5,
      };
    }

    case "LOBBY_TICK": {
      if (state.gameStartCountdown === null || state.gameStartCountdown <= 0) return state;
      return { ...state, gameStartCountdown: state.gameStartCountdown - 1 };
    }

    case "START_GAME": {
      return {
        ...state,
        screen: "playing",
        currentQuestionIndex: 0,
        timeLeft: 15,
        hasAnswered: false,
        playerAnswer: null,
        wasCorrect: null,
        showingResult: false,
        correctAnswer: null,
        currentHint: null,
        players: state.players.map((p) => ({
          ...p,
          score: 0,
          currentAnswer: null,
          wasCorrect: null,
        })),
      };
    }

    case "SUBMIT_ANSWER": {
      if (state.hasAnswered || state.showingResult) return state;
      const question = questions[state.currentQuestionIndex];
      const isCorrect = action.answer === question.answer;
      const timeBonus = Math.floor(state.timeLeft * 10);
      const points = isCorrect ? 100 + timeBonus : 0;
      return {
        ...state,
        hasAnswered: true,
        playerAnswer: action.answer,
        wasCorrect: isCorrect,
        players: state.players.map((p) => {
          if (p.id === state.myPlayerId) {
            return {
              ...p,
              score: p.score + points,
              currentAnswer: action.answer,
              wasCorrect: isCorrect,
            };
          }
          return p;
        }),
      };
    }

    case "REVEAL_RESULT": {
      const question = questions[state.currentQuestionIndex];
      const updatedPlayers = state.players.map((p) => {
        if (p.id.startsWith("bot-")) {
          const botAnswer = getBotAnswer(question);
          const isCorrect = botAnswer === question.answer;
          const timeBonus = Math.floor(Math.random() * 100);
          const points = isCorrect ? 100 + timeBonus : 0;
          return {
            ...p,
            score: p.score + points,
            currentAnswer: botAnswer,
            wasCorrect: isCorrect,
          };
        }
        return p;
      });
      return {
        ...state,
        showingResult: true,
        correctAnswer: question.answer,
        currentHint: question.hint,
        players: updatedPlayers,
      };
    }

    case "NEXT_QUESTION": {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= questions.length) {
        const sorted = [...state.players].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.joinOrder - b.joinOrder;
        });
        return { ...state, screen: "gameover", players: sorted };
      }
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        timeLeft: 15,
        hasAnswered: false,
        playerAnswer: null,
        wasCorrect: null,
        showingResult: false,
        correctAnswer: null,
        currentHint: null,
        players: state.players.map((p) => ({
          ...p,
          currentAnswer: null,
          wasCorrect: null,
        })),
      };
    }

    case "TICK": {
      if (state.timeLeft <= 0) return state;
      return { ...state, timeLeft: state.timeLeft - 1 };
    }

    case "PLAY_AGAIN": {
      playerCounter = 0;
      return getInitialState();
    }

    default:
      return state;
  }
}
