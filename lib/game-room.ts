import { redis } from "./redis";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  answers: (boolean | null)[];
  lastAnswerTime: number | null;
  connected: boolean;
}

export interface GameRoom {
  id: string;
  hostId: string;
  status: "waiting" | "countdown" | "playing" | "showing_results" | "game_over";
  players: Player[];
  currentQuestion: number;
  totalQuestions: number;
  questionStartedAt: number | null;
  questionTimeLimit: number; // seconds
  countdownEndsAt: number | null;
  createdAt: number;
  questionSet: Question[];
}

export interface Question {
  id: number;
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  explanation: string;
  clues: string[];
  difficulty: "easy" | "medium" | "hard";
  category: string;
  funFact: string;
}

// ─── Question Bank ───────────────────────────────────────────────────────────

export const QUESTION_BANK: Question[] = [
  {
    id: 1,
    from: "IT Security Team",
    fromEmail: "security@c0mpany-support.net",
    subject: "URGENT: Password Expiry - Action Required Immediately",
    body: "Dear Employee,\n\nYour network password will expire in 2 hours. To avoid being locked out of all company systems, you must verify your credentials immediately by clicking the link below.\n\nVerify Now: http://company-secure-login.tk/verify\n\nFailure to act will result in permanent account suspension.\n\nIT Security Department",
    isPhishing: true,
    explanation: "This is phishing. The sender domain 'c0mpany-support.net' uses a zero instead of 'o', the link goes to a suspicious .tk domain, and the extreme urgency is a classic social engineering tactic.",
    clues: ["Misspelled sender domain (c0mpany)", "Suspicious .tk link", "Extreme urgency & threats", "Generic greeting"],
    difficulty: "easy",
    category: "Credential Theft",
    funFact: "91% of cyberattacks begin with a phishing email. The .tk domain is one of the most abused top-level domains in the world.",
  },
  {
    id: 2,
    from: "Sarah Chen",
    fromEmail: "sarah.chen@yourcompany.com",
    subject: "Q3 Budget Review - Meeting Notes Attached",
    body: "Hi team,\n\nAttached are the meeting notes from today's Q3 budget review. Please review the action items assigned to your department and confirm completion timelines by Friday.\n\nKey decisions:\n- Marketing budget increased by 12%\n- New hire freeze extended through October\n- Travel policy updated (see section 3)\n\nLet me know if you have questions.\n\nBest,\nSarah Chen\nFinance Director",
    isPhishing: false,
    explanation: "This is legitimate. The email comes from an internal company domain, references a specific meeting with concrete details, has a professional tone, and doesn't ask for credentials or urgent clicks.",
    clues: ["Internal company domain", "Specific meeting details", "No suspicious links", "Professional tone"],
    difficulty: "easy",
    category: "Internal Comms",
    funFact: "Only 3% of phishing emails come from internal-looking company domains. Specific details like percentages and names are a strong sign of legitimacy.",
  },
  {
    id: 3,
    from: "Microsoft 365",
    fromEmail: "no-reply@microsft-365.com",
    subject: "Your OneDrive storage is 98% full",
    body: "Your Microsoft OneDrive account has nearly reached its storage limit.\n\nCurrent usage: 4.9 GB of 5 GB\n\nTo avoid losing access to your files, upgrade your storage immediately:\n\nUpgrade Storage: http://onedrive-upgrade.microsft-365.com/plan\n\nIf you do not upgrade within 24 hours, files may be automatically deleted.\n\nMicrosoft 365 Team",
    isPhishing: true,
    explanation: "This is phishing. 'microsft-365.com' is misspelled (missing the 'o' in Microsoft). Legitimate Microsoft emails come from microsoft.com. The threat of automatic file deletion is a pressure tactic.",
    clues: ["Misspelled 'microsft' in domain", "Fake upgrade link", "Threat of data loss", "Not from microsoft.com"],
    difficulty: "medium",
    category: "Brand Impersonation",
    funFact: "Microsoft is the most impersonated brand in phishing attacks, followed by Google and Apple. Always check the exact domain spelling.",
  },
  {
    id: 4,
    from: "Amazon Web Services",
    fromEmail: "aws-billing@amazon.com",
    subject: "Your AWS Invoice for October 2024",
    body: "Hello,\n\nYour AWS invoice for the billing period October 1-31, 2024 is now available.\n\nTotal charges: $1,247.83\nPayment method: Visa ending in 4521\nPayment status: Processed\n\nYou can view your complete billing statement in the AWS Management Console under Billing & Cost Management.\n\nThank you for using Amazon Web Services.\n\nAmazon Web Services, Inc.",
    isPhishing: false,
    explanation: "This is legitimate. It comes from a real amazon.com domain, references specific billing details, and directs you to log into the console yourself rather than providing a suspicious link.",
    clues: ["Legitimate amazon.com domain", "Specific billing details", "No direct login link", "Directs to console"],
    difficulty: "medium",
    category: "Billing & Finance",
    funFact: "Real billing emails from AWS, Google Cloud, and Azure never include direct payment links. They always direct you to log in to the console yourself.",
  },
  {
    id: 5,
    from: "HR Department",
    fromEmail: "hr-benefits@company-hr-portal.org",
    subject: "ACTION REQUIRED: Update Your Direct Deposit Information",
    body: "Dear Valued Employee,\n\nDue to a recent system migration, all employees must re-enter their banking information for direct deposit to continue. This must be completed by end of business today.\n\nUpdate Information: http://company-hr-portal.org/banking-update\n\nPlease have your bank routing number and account number ready. If you do not update by the deadline, your next paycheck will be delayed.\n\nHuman Resources",
    isPhishing: true,
    explanation: "This is phishing. Real HR departments don't ask for banking details via email links. The external domain 'company-hr-portal.org' isn't a real company domain, and the same-day deadline creates false urgency.",
    clues: ["External non-company domain", "Asks for banking details via link", "Same-day deadline pressure", "Generic 'Valued Employee'"],
    difficulty: "easy",
    category: "Payroll Scam",
    funFact: "Business Email Compromise (BEC) scams cost companies $2.7 billion in 2022. HR and payroll are the most targeted departments.",
  },
  {
    id: 6,
    from: "Slack",
    fromEmail: "notifications@slack.com",
    subject: "Tom mentioned you in #project-alpha",
    body: "Tom Parker mentioned you in #project-alpha:\n\n\"Hey @you - can you review the latest PR before the standup tomorrow? Link is in the thread.\"\n\nReply in Slack to respond.\n\n---\nYou're receiving this email because you have notifications enabled.\nTo manage your notification preferences, go to your Slack settings.",
    isPhishing: false,
    explanation: "This is legitimate. It comes from the real slack.com domain, contains a natural conversational message, and doesn't include any suspicious links or urgent demands.",
    clues: ["Real slack.com domain", "Natural conversation", "Standard notification format", "No suspicious links"],
    difficulty: "easy",
    category: "SaaS Notification",
    funFact: "Legitimate SaaS notifications are the hardest for phishers to fake perfectly because they contain specific, contextual information about your work.",
  },
  {
    id: 7,
    from: "Apple Support",
    fromEmail: "support@apple-id-verify.com",
    subject: "Your Apple ID has been locked for security reasons",
    body: "Dear Customer,\n\nWe detected unusual sign-in activity on your Apple ID. For your protection, your account has been temporarily locked.\n\nTo unlock your account, verify your identity within 12 hours:\n\nVerify Identity: http://apple-id-verify.com/unlock\n\nIf you don't verify in time, your account will be permanently disabled and all purchases will be lost.\n\nApple Support Team",
    isPhishing: true,
    explanation: "This is phishing. Apple's real domain is apple.com, not 'apple-id-verify.com'. The threat of permanent disabling and losing purchases is an extreme scare tactic. Apple never sends verification links this way.",
    clues: ["Fake domain 'apple-id-verify.com'", "Extreme threats", "Suspicious verification link", "Generic 'Dear Customer'"],
    difficulty: "medium",
    category: "Account Takeover",
    funFact: "Apple never sends emails asking you to verify your identity via a link. If your account is locked, you can only unlock it through appleid.apple.com directly.",
  },
  {
    id: 8,
    from: "GitHub",
    fromEmail: "noreply@github.com",
    subject: "[cybersecurity-app] New issue: Fix login redirect bug #247",
    body: "New issue opened by @devops-sarah:\n\nTitle: Fix login redirect bug\n\nWhen users log in from the /settings page, they get redirected to /dashboard instead of back to /settings. This is causing confusion for users trying to update their profiles.\n\nSteps to reproduce:\n1. Navigate to /settings without being logged in\n2. Click 'Log In'\n3. After login, observe redirect goes to /dashboard\n\nExpected: Redirect back to /settings\n\nLabels: bug, high-priority",
    isPhishing: false,
    explanation: "This is legitimate. It comes from GitHub's real domain, contains a detailed and specific bug report with steps to reproduce, and follows standard GitHub issue notification formatting.",
    clues: ["Real github.com domain", "Specific technical details", "Standard GitHub format", "No suspicious links"],
    difficulty: "hard",
    category: "Developer Tools",
    funFact: "GitHub is increasingly targeted by supply-chain attacks. However, their real notifications always come from github.com and contain repo-specific details.",
  },
  {
    id: 9,
    from: "FedEx Delivery",
    fromEmail: "tracking@fedex-notifications.info",
    subject: "Package Delivery Failed - Reschedule Required",
    body: "FEDEX SHIPPING NOTIFICATION\n\nWe attempted to deliver your package today but no one was available to sign.\n\nTracking Number: 7829-4810-2947\nShipment Type: Priority Overnight\n\nTo reschedule your delivery, please download and complete the attached form, or click below:\n\nReschedule Delivery: http://fedex-notifications.info/reschedule?id=7829\n\nIf not rescheduled within 48 hours, your package will be returned to sender.\n\nFedEx Customer Service",
    isPhishing: true,
    explanation: "This is phishing. FedEx uses fedex.com, not 'fedex-notifications.info'. The request to download a form is a common malware tactic, and the return-to-sender threat creates false urgency.",
    clues: ["Fake domain 'fedex-notifications.info'", "Download form request (malware risk)", "48-hour pressure", "Not from fedex.com"],
    difficulty: "medium",
    category: "Delivery Scam",
    funFact: "Delivery scams spike 400% during holiday seasons. FedEx, UPS, and USPS never ask you to download forms -- only reschedule through their official app or website.",
  },
  {
    id: 10,
    from: "Jira",
    fromEmail: "jira@yourcompany.atlassian.net",
    subject: "[PROJ-1842] Sprint review moved to Thursday",
    body: "David Kim updated PROJ-1842:\n\nSummary changed: Sprint Review Meeting\nDate changed: Wednesday -> Thursday 2:00 PM EST\n\nComment by David Kim:\n\"Moving to Thursday due to the client demo on Wednesday afternoon. Same conference room (3B). Updated the calendar invite.\"\n\nView Issue: https://yourcompany.atlassian.net/browse/PROJ-1842\n\nThis message was sent by Atlassian Jira",
    isPhishing: false,
    explanation: "This is legitimate. It comes from a valid atlassian.net subdomain, references specific project details, ticket numbers, and a natural team conversation about scheduling.",
    clues: ["Valid atlassian.net domain", "Specific ticket number", "Natural team conversation", "Standard Jira format"],
    difficulty: "hard",
    category: "Project Management",
    funFact: "Atlassian notifications are among the safest automated emails because they include unique ticket IDs and project-specific context that attackers rarely replicate.",
  },
];

// ─── Avatar pool ─────────────────────────────────────────────────────────────

const AVATARS = [
  "shield", "lock", "key", "bug", "skull",
  "ghost", "bot", "flame", "zap", "eye",
  "rocket", "star", "diamond", "crown", "sword",
];

const AVATAR_COLORS = [
  "#00E5FF", "#FF2D78", "#39FF14", "#FFB800",
  "#A855F7", "#F97316", "#06B6D4", "#EC4899",
  "#10B981", "#EAB308", "#8B5CF6", "#F43F5E",
  "#14B8A6", "#D946EF", "#84CC16",
];

function pickAvatar(index: number): string {
  return AVATARS[index % AVATARS.length];
}

function pickColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

// ─── Room key helpers ────────────────────────────────────────────────────────

function roomKey(roomId: string) {
  return `cybershield:room:${roomId}`;
}

const ROOM_TTL = 3600; // 1 hour

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generatePlayerId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Room CRUD ───────────────────────────────────────────────────────────────

export async function createRoom(hostName: string): Promise<{ room: GameRoom; playerId: string }> {
  const roomId = generateRoomCode();
  const playerId = generatePlayerId();

  // Shuffle and pick 10 questions
  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, 10);

  const host: Player = {
    id: playerId,
    name: hostName,
    avatar: pickAvatar(0),
    score: 0,
    streak: 0,
    answers: [],
    lastAnswerTime: null,
    connected: true,
  };

  const room: GameRoom = {
    id: roomId,
    hostId: playerId,
    status: "waiting",
    players: [host],
    currentQuestion: 0,
    totalQuestions: questions.length,
    questionStartedAt: null,
    questionTimeLimit: 20,
    countdownEndsAt: null,
    createdAt: Date.now(),
    questionSet: questions,
  };

  await redis.set(roomKey(roomId), JSON.stringify(room), { ex: ROOM_TTL });
  return { room, playerId };
}

export async function getRoom(roomId: string): Promise<GameRoom | null> {
  const data = await redis.get<string>(roomKey(roomId));
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data as unknown as GameRoom;
}

async function saveRoom(room: GameRoom): Promise<void> {
  await redis.set(roomKey(room.id), JSON.stringify(room), { ex: ROOM_TTL });
}

export async function joinRoom(roomId: string, playerName: string): Promise<{ room: GameRoom; playerId: string } | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.status !== "waiting") return null;
  if (room.players.length >= 12) return null;

  // Check for duplicate names
  if (room.players.some((p) => p.name.toLowerCase() === playerName.toLowerCase())) {
    return null;
  }

  const playerId = generatePlayerId();
  const idx = room.players.length;

  const player: Player = {
    id: playerId,
    name: playerName,
    avatar: pickAvatar(idx),
    score: 0,
    streak: 0,
    answers: [],
    lastAnswerTime: null,
    connected: true,
  };

  room.players.push(player);
  await saveRoom(room);
  return { room, playerId };
}

export async function startCountdown(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.hostId !== playerId) return null;
  if (room.status !== "waiting") return null;

  room.status = "countdown";
  room.countdownEndsAt = Date.now() + 5000; // 5 second countdown
  await saveRoom(room);
  return room;
}

export async function startGame(roomId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  room.status = "playing";
  room.currentQuestion = 0;
  room.questionStartedAt = Date.now();
  room.countdownEndsAt = null;

  // Init answers array for all players
  for (const p of room.players) {
    p.answers = [];
    p.score = 0;
    p.streak = 0;
  }

  await saveRoom(room);
  return room;
}

export async function submitAnswer(
  roomId: string,
  playerId: string,
  questionIndex: number,
  answer: boolean // true = phishing, false = legit
): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.status !== "playing") return null;
  if (room.currentQuestion !== questionIndex) return null;

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return null;

  // Already answered this question
  if (player.answers.length > questionIndex) return room;

  const question = room.questionSet[questionIndex];
  const correct = answer === question.isPhishing;
  const elapsed = room.questionStartedAt ? (Date.now() - room.questionStartedAt) / 1000 : room.questionTimeLimit;
  const timeRemaining = Math.max(0, room.questionTimeLimit - elapsed);

  if (correct) {
    // Base 100 + up to 100 speed bonus + streak bonus
    const speedBonus = Math.round((timeRemaining / room.questionTimeLimit) * 100);
    const streakBonus = Math.min(player.streak, 5) * 20;
    player.score += 100 + speedBonus + streakBonus;
    player.streak += 1;
  } else {
    player.streak = 0;
  }

  player.answers.push(correct);
  player.lastAnswerTime = Date.now();

  // Auto-reveal results when ALL players have answered (no waiting for timer)
  const allAnswered = room.players.every((p) => p.answers.length > questionIndex);
  if (allAnswered) {
    room.status = "showing_results";
  }

  await saveRoom(room);
  return room;
}

export async function nextQuestion(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.hostId !== playerId) return null;

  const nextIdx = room.currentQuestion + 1;

  if (nextIdx >= room.totalQuestions) {
    room.status = "game_over";
    room.questionStartedAt = null;
    await saveRoom(room);
    return room;
  }

  room.currentQuestion = nextIdx;
  room.questionStartedAt = Date.now();
  room.status = "playing";
  await saveRoom(room);
  return room;
}

export async function showResults(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.hostId !== playerId) return null;

  room.status = "showing_results";
  await saveRoom(room);
  return room;
}

export async function resetRoom(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  if (room.hostId !== playerId) return null;

  const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, 10);

  room.status = "waiting";
  room.currentQuestion = 0;
  room.questionStartedAt = null;
  room.countdownEndsAt = null;
  room.questionSet = questions;
  room.totalQuestions = questions.length;

  for (const p of room.players) {
    p.answers = [];
    p.score = 0;
    p.streak = 0;
    p.lastAnswerTime = null;
  }

  await saveRoom(room);
  return room;
}

export async function heartbeat(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  const player = room.players.find((p) => p.id === playerId);
  if (player) {
    player.connected = true;
  }

  await saveRoom(room);
  return room;
}

export { pickColor };
