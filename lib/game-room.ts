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
  questionTimeLimit: number;
  countdownEndsAt: number | null;
  createdAt: number;
  questionSet: GameRound[];
}

// ─── Round Types (discriminated union) ───────────────────────────────────────

export type GameRound = PhishRound | PasswordRound | SpotURLRound | PasswordBattleRound;

interface BaseRound {
  id: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  funFact: string;
  explanation: string;
}

// Password Battle: two players create passwords for a scenario, auto-scored by strength
export interface PasswordBattleRound extends BaseRound {
  type: "password_battle";
  scenario: string;                // The prompt/scenario for the password
  challengerIds: [string, string]; // filled at game start
  submissions: Record<string, { password: string; score: number; breakdown: PasswordScoreBreakdown }>;
}

export interface PhishRound extends BaseRound {
  type: "phish";
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  clues: string[];
}

export interface PasswordRound extends BaseRound {
  type: "password";
  password: string;
  correctAnswer: number; // index: 0=Strong, 1=Weak, 2=Terrible
  options: string[];
  clues: string[];
}

export interface SpotURLRound extends BaseRound {
  type: "spot_url";
  scenario: string;
  urls: { url: string; label: string }[];
  correctIndex: number;
  clues: string[];
}

export interface PasswordScoreBreakdown {
  length: number;
  uppercase: number;
  lowercase: number;
  numbers: number;
  symbols: number;
  entropy: number;
  dictionaryPenalty: number;
  patternPenalty: number;
  total: number;
}

// Common password fragments / dictionary words to penalize
const COMMON_WORDS = [
  "password", "pass", "1234", "qwerty", "admin", "login", "welcome",
  "monkey", "dragon", "master", "abc", "letmein", "iloveyou", "trustno1",
  "shadow", "sunshine", "princess", "football", "baseball", "soccer",
  "hockey", "batman", "superman", "hello", "charlie", "access",
];

const KEYBOARD_PATTERNS = [
  "qwerty", "qwertz", "asdfgh", "zxcvbn", "123456", "654321",
  "abcdef", "fedcba", "!@#$%", "098765", "567890",
];

function scorePassword(password: string): PasswordScoreBreakdown {
  const len = password.length;

  // Character class checks
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  // Length score: 0-30 points
  const lengthScore = Math.min(30, len * 2);

  // Char diversity: up to 10 each = 40 max
  const upperScore = hasUpper ? 10 : 0;
  const lowerScore = hasLower ? 10 : 0;
  const numScore = hasNum ? 10 : 0;
  const symbolScore = hasSymbol ? 10 : 0;

  // Entropy estimate: unique chars / length ratio * 20 = up to 20 points
  const uniqueChars = new Set(password.split("")).size;
  const entropyScore = Math.min(20, Math.round((uniqueChars / Math.max(len, 1)) * 20));

  // Dictionary penalty: -15 per common word found
  const lower = password.toLowerCase();
  let dictPenalty = 0;
  for (const word of COMMON_WORDS) {
    if (lower.includes(word)) dictPenalty += 15;
  }

  // Pattern penalty: -10 per keyboard/sequential pattern
  let patternPenalty = 0;
  for (const pat of KEYBOARD_PATTERNS) {
    if (lower.includes(pat)) patternPenalty += 10;
  }

  // Repeated character penalty: if >50% are the same char
  const charFreq: Record<string, number> = {};
  for (const c of password) charFreq[c] = (charFreq[c] || 0) + 1;
  const maxFreq = Math.max(...Object.values(charFreq));
  if (maxFreq > len * 0.5) patternPenalty += 10;

  const total = Math.max(0, Math.min(100,
    lengthScore + upperScore + lowerScore + numScore + symbolScore + entropyScore - dictPenalty - patternPenalty
  ));

  return {
    length: lengthScore,
    uppercase: upperScore,
    lowercase: lowerScore,
    numbers: numScore,
    symbols: symbolScore,
    entropy: entropyScore,
    dictionaryPenalty: dictPenalty,
    patternPenalty,
    total,
  };
}

// ─── Password Battle Scenario Bank ─────────────────────────────────────────

const BATTLE_SCENARIOS = [
  {
    id: 301, scenario: "Create a password for your company email that you'll use every day.",
    funFact: "The average person has 100+ online accounts. Using a unique, strong password for each one (with a password manager) is the best defense.",
    explanation: "A strong daily-use password should be long, memorable, and unique. Passphrases combining random words with symbols work great.",
  },
  {
    id: 302, scenario: "Create a password for your online banking account.",
    funFact: "Financial accounts are targeted 3x more than other accounts. Banks report that 80% of breaches involve weak or reused passwords.",
    explanation: "Banking passwords need maximum security. Use 16+ characters with mixed types and never reuse them anywhere else.",
  },
  {
    id: 303, scenario: "Create a Wi-Fi password for your office network that guests might need.",
    funFact: "A weak Wi-Fi password can let attackers intercept all traffic on the network. WPA3 with a strong password is the gold standard.",
    explanation: "Wi-Fi passwords should be long but shareable. A random passphrase of 4-5 words works well since you can tell it verbally.",
  },
  {
    id: 304, scenario: "Create a master password for your password manager vault.",
    funFact: "Your password manager master password is the most important password you'll ever create. It protects all your other passwords.",
    explanation: "This needs to be your strongest password AND memorable since you can't store it in a password manager. Long passphrases are ideal.",
  },
  {
    id: 305, scenario: "Create a password for a top-secret project shared with your team.",
    funFact: "In 2023, 49% of data breaches involved stolen credentials. Shared passwords should be distributed via a secure channel, never email.",
    explanation: "Shared passwords must be strong AND easy to communicate. Avoid ambiguous characters (0/O, l/1) and use a memorable passphrase.",
  },
  {
    id: 306, scenario: "Create a password for the server room physical access keypad.",
    funFact: "Physical access codes should be changed every 90 days. Worn keypad buttons can reveal frequently used digits to attackers.",
    explanation: "Keypad passwords need to be numeric but unpredictable. Avoid patterns, birthdates, or sequential numbers.",
  },
];

// ─── Phish or Legit Question Bank ────────────────────────────────────────────

const PHISH_BANK: PhishRound[] = [
  {
    id: 1, type: "phish",
    from: "IT Security Team", fromEmail: "security@c0mpany-support.net",
    subject: "URGENT: Password Expiry - Action Required Immediately",
    body: "Dear Employee,\n\nYour network password will expire in 2 hours. To avoid being locked out of all company systems, you must verify your credentials immediately by clicking the link below.\n\nVerify Now: http://company-secure-login.tk/verify\n\nFailure to act will result in permanent account suspension.\n\nIT Security Department",
    isPhishing: true,
    explanation: "This is phishing. The sender domain 'c0mpany-support.net' uses a zero instead of 'o', the link goes to a suspicious .tk domain, and the extreme urgency is a classic social engineering tactic.",
    clues: ["Misspelled sender domain (c0mpany)", "Suspicious .tk link", "Extreme urgency & threats", "Generic greeting"],
    difficulty: "easy", category: "Credential Theft",
    funFact: "91% of cyberattacks begin with a phishing email. The .tk domain is one of the most abused top-level domains in the world.",
  },
  {
    id: 2, type: "phish",
    from: "Sarah Chen", fromEmail: "sarah.chen@yourcompany.com",
    subject: "Q3 Budget Review - Meeting Notes Attached",
    body: "Hi team,\n\nAttached are the meeting notes from today's Q3 budget review. Please review the action items assigned to your department and confirm completion timelines by Friday.\n\nKey decisions:\n- Marketing budget increased by 12%\n- New hire freeze extended through October\n- Travel policy updated (see section 3)\n\nLet me know if you have questions.\n\nBest,\nSarah Chen\nFinance Director",
    isPhishing: false,
    explanation: "This is legitimate. The email comes from an internal company domain, references a specific meeting with concrete details, has a professional tone, and doesn't ask for credentials or urgent clicks.",
    clues: ["Internal company domain", "Specific meeting details", "No suspicious links", "Professional tone"],
    difficulty: "easy", category: "Internal Comms",
    funFact: "Only 3% of phishing emails come from internal-looking company domains. Specific details like percentages and names are a strong sign of legitimacy.",
  },
  {
    id: 3, type: "phish",
    from: "Microsoft 365", fromEmail: "no-reply@microsft-365.com",
    subject: "Your OneDrive storage is 98% full",
    body: "Your Microsoft OneDrive account has nearly reached its storage limit.\n\nCurrent usage: 4.9 GB of 5 GB\n\nTo avoid losing access to your files, upgrade your storage immediately:\n\nUpgrade Storage: http://onedrive-upgrade.microsft-365.com/plan\n\nIf you do not upgrade within 24 hours, files may be automatically deleted.\n\nMicrosoft 365 Team",
    isPhishing: true,
    explanation: "This is phishing. 'microsft-365.com' is misspelled (missing the 'o' in Microsoft). Legitimate Microsoft emails come from microsoft.com. The threat of automatic file deletion is a pressure tactic.",
    clues: ["Misspelled 'microsft' in domain", "Fake upgrade link", "Threat of data loss", "Not from microsoft.com"],
    difficulty: "medium", category: "Brand Impersonation",
    funFact: "Microsoft is the most impersonated brand in phishing attacks, followed by Google and Apple. Always check the exact domain spelling.",
  },
  {
    id: 4, type: "phish",
    from: "Amazon Web Services", fromEmail: "aws-billing@amazon.com",
    subject: "Your AWS Invoice for October 2024",
    body: "Hello,\n\nYour AWS invoice for the billing period October 1-31, 2024 is now available.\n\nTotal charges: $1,247.83\nPayment method: Visa ending in 4521\nPayment status: Processed\n\nYou can view your complete billing statement in the AWS Management Console under Billing & Cost Management.\n\nThank you for using Amazon Web Services.\n\nAmazon Web Services, Inc.",
    isPhishing: false,
    explanation: "This is legitimate. It comes from a real amazon.com domain, references specific billing details, and directs you to log into the console yourself rather than providing a suspicious link.",
    clues: ["Legitimate amazon.com domain", "Specific billing details", "No direct login link", "Directs to console"],
    difficulty: "medium", category: "Billing & Finance",
    funFact: "Real billing emails from AWS, Google Cloud, and Azure never include direct payment links. They always direct you to log in to the console yourself.",
  },
  {
    id: 5, type: "phish",
    from: "HR Department", fromEmail: "hr-benefits@company-hr-portal.org",
    subject: "ACTION REQUIRED: Update Your Direct Deposit Information",
    body: "Dear Valued Employee,\n\nDue to a recent system migration, all employees must re-enter their banking information for direct deposit to continue. This must be completed by end of business today.\n\nUpdate Information: http://company-hr-portal.org/banking-update\n\nPlease have your bank routing number and account number ready. If you do not update by the deadline, your next paycheck will be delayed.\n\nHuman Resources",
    isPhishing: true,
    explanation: "This is phishing. Real HR departments don't ask for banking details via email links. The external domain 'company-hr-portal.org' isn't a real company domain, and the same-day deadline creates false urgency.",
    clues: ["External non-company domain", "Asks for banking details via link", "Same-day deadline pressure", "Generic 'Valued Employee'"],
    difficulty: "easy", category: "Payroll Scam",
    funFact: "Business Email Compromise (BEC) scams cost companies $2.7 billion in 2022. HR and payroll are the most targeted departments.",
  },
  {
    id: 6, type: "phish",
    from: "Apple Support", fromEmail: "support@apple-id-verify.com",
    subject: "Your Apple ID has been locked for security reasons",
    body: "Dear Customer,\n\nWe detected unusual sign-in activity on your Apple ID. For your protection, your account has been temporarily locked.\n\nTo unlock your account, verify your identity within 12 hours:\n\nVerify Identity: http://apple-id-verify.com/unlock\n\nIf you don't verify in time, your account will be permanently disabled and all purchases will be lost.\n\nApple Support Team",
    isPhishing: true,
    explanation: "This is phishing. Apple's real domain is apple.com, not 'apple-id-verify.com'. The threat of permanent disabling and losing purchases is an extreme scare tactic.",
    clues: ["Fake domain 'apple-id-verify.com'", "Extreme threats", "Suspicious verification link", "Generic 'Dear Customer'"],
    difficulty: "medium", category: "Account Takeover",
    funFact: "Apple never sends emails asking you to verify your identity via a link. If your account is locked, you can only unlock it through appleid.apple.com directly.",
  },
];

// ─── Password Strength Bank ──────────────────────────────────────────────────

const PASSWORD_BANK: PasswordRound[] = [
  {
    id: 101, type: "password", password: "P@ssw0rd!", correctAnswer: 2, options: ["Strong", "Weak", "Terrible"],
    clues: ["Common substitutions (@ for a, 0 for o)", "One of the most common passwords globally", "Easily cracked by dictionary attacks"],
    explanation: "Despite looking complex, 'P@ssw0rd!' is one of the most common passwords in the world. Attackers have it in every dictionary list. Character substitutions like @ and 0 fool no one.",
    difficulty: "easy", category: "Password Security",
    funFact: "'P@ssw0rd' appears in the top 20 of every major password breach list. Hackers try it within the first 100 guesses.",
  },
  {
    id: 102, type: "password", password: "correct-horse-battery-staple", correctAnswer: 0, options: ["Strong", "Weak", "Terrible"],
    clues: ["4 random words = high entropy", "Easy to remember, hard to crack", "25+ characters long"],
    explanation: "Passphrases made of random words are extremely strong. This 28-character passphrase has massive entropy and would take centuries to brute-force, yet it's easy to remember.",
    difficulty: "medium", category: "Password Security",
    funFact: "This passphrase was popularized by XKCD comic #936. Four random words provide about 44 bits of entropy, which takes centuries to crack by brute force.",
  },
  {
    id: 103, type: "password", password: "qwerty123", correctAnswer: 2, options: ["Strong", "Weak", "Terrible"],
    clues: ["Keyboard pattern", "Sequential numbers", "Top 5 most used password globally"],
    explanation: "'qwerty123' is a keyboard walk pattern followed by sequential numbers. It appears in nearly every data breach and is cracked instantly.",
    difficulty: "easy", category: "Password Security",
    funFact: "Keyboard patterns like 'qwerty', 'asdfgh', and '123456' are the first things password crackers try. They can be cracked in under 1 second.",
  },
  {
    id: 104, type: "password", password: "Tr0ub4dor&3", correctAnswer: 1, options: ["Strong", "Weak", "Terrible"],
    clues: ["Based on a real word (troubador)", "Predictable substitution pattern", "Only 11 characters"],
    explanation: "While it looks complex, this is based on the word 'troubador' with predictable character substitutions. Modern crackers handle these easily with rule-based attacks.",
    difficulty: "hard", category: "Password Security",
    funFact: "Rule-based cracking applies thousands of substitution patterns (a->@, o->0, e->3) to dictionary words. A 'complex' 11-character password based on a word can be cracked in hours.",
  },
  {
    id: 105, type: "password", password: "j4fS#9kL!mN2$pQ", correctAnswer: 0, options: ["Strong", "Weak", "Terrible"],
    clues: ["16 random characters", "Mix of all character types", "No dictionary words or patterns"],
    explanation: "This is a truly random 16-character password mixing uppercase, lowercase, numbers, and symbols. It has extremely high entropy and would take billions of years to brute-force.",
    difficulty: "medium", category: "Password Security",
    funFact: "A truly random 16-character password with all character types has about 105 bits of entropy. Even at 1 trillion guesses per second, it would take longer than the age of the universe to crack.",
  },
  {
    id: 106, type: "password", password: "iloveyou2024", correctAnswer: 2, options: ["Strong", "Weak", "Terrible"],
    clues: ["Common phrase + year", "No special characters", "Appears in every breach list"],
    explanation: "'iloveyou' is consistently one of the top 10 most common passwords worldwide. Adding a year to it barely increases security as crackers try all year combinations automatically.",
    difficulty: "easy", category: "Password Security",
    funFact: "'iloveyou' has been in the top 10 most common passwords every year since data breaches started being tracked. Adding the current year is the first thing crackers try.",
  },
];

// ─── Spot the URL Bank ───────────────────────────────────────────────────────

const URL_BANK: SpotURLRound[] = [
  {
    id: 201, type: "spot_url",
    scenario: "You received an email from your bank asking you to verify your account. Which URL is the REAL bank website?",
    urls: [
      { url: "https://www.chase.com/account/verify", label: "chase.com" },
      { url: "https://www.chase-secure.com/verify", label: "chase-secure.com" },
      { url: "https://chase.account-verify.net/login", label: "account-verify.net" },
    ],
    correctIndex: 0,
    clues: ["chase.com is the official domain", "chase-secure.com is a lookalike", "account-verify.net puts 'chase' as a subdomain trick"],
    explanation: "Only chase.com is the real Chase bank domain. 'chase-secure.com' is a completely different domain, and 'chase.account-verify.net' uses Chase's name as a subdomain of a fake domain.",
    difficulty: "easy", category: "URL Identification",
    funFact: "43% of people cannot distinguish between a real URL and a phishing URL. Always look at the root domain (the part right before .com/.org/.net).",
  },
  {
    id: 202, type: "spot_url",
    scenario: "You need to log into your Google account. Which URL should you trust?",
    urls: [
      { url: "https://accounts.google.com/signin", label: "accounts.google.com" },
      { url: "https://google.com.signin-verify.co/auth", label: "signin-verify.co" },
      { url: "https://www.g00gle.com/accounts/login", label: "g00gle.com" },
    ],
    correctIndex: 0,
    clues: ["google.com is the official domain", "signin-verify.co uses google.com as a subdomain prefix", "g00gle.com uses zeros instead of o's"],
    explanation: "Only accounts.google.com is legitimate. The second URL has 'google.com' as part of a subdomain but the real domain is 'signin-verify.co'. The third uses zeros (0) instead of letter o.",
    difficulty: "medium", category: "URL Identification",
    funFact: "Homoglyph attacks use characters that look similar (0 vs o, l vs I, rn vs m). Some advanced attacks use unicode characters that are visually identical to ASCII letters.",
  },
  {
    id: 203, type: "spot_url",
    scenario: "You want to download the latest version of Microsoft Office. Which is the official download page?",
    urls: [
      { url: "https://www.microsoft.com/en-us/microsoft-365", label: "microsoft.com" },
      { url: "https://microsoft-office-free.download/2024", label: "microsoft-office-free.download" },
      { url: "https://office.microsoft-365.org/download", label: "microsoft-365.org" },
    ],
    correctIndex: 0,
    clues: ["microsoft.com is the official domain", "Free download sites are malware traps", ".org is not Microsoft's domain"],
    explanation: "Only microsoft.com is the real Microsoft domain. 'microsoft-office-free.download' is a malware distribution site, and 'microsoft-365.org' is a fake domain impersonating Microsoft.",
    difficulty: "easy", category: "URL Identification",
    funFact: "Fake software download sites are the #1 vector for distributing trojans and ransomware. Always download software directly from the official vendor website.",
  },
  {
    id: 204, type: "spot_url",
    scenario: "You received a PayPal receipt for a purchase you don't recognize. Where should you check?",
    urls: [
      { url: "https://www.paypal.com/activity", label: "paypal.com" },
      { url: "https://paypal-dispute.resolution-center.com/case", label: "resolution-center.com" },
      { url: "https://secure-paypal.com/disputes/review", label: "secure-paypal.com" },
    ],
    correctIndex: 0,
    clues: ["paypal.com is the only real domain", "resolution-center.com is a fake domain", "secure-paypal.com adds 'secure-' prefix trick"],
    explanation: "Only paypal.com is the real PayPal domain. Scammers create fake 'dispute resolution' domains and add 'secure-' prefixes to make URLs look more trustworthy.",
    difficulty: "medium", category: "URL Identification",
    funFact: "PayPal is the #1 most phished financial brand. The 'secure-' prefix trick is so common that 67% of phishing URLs targeting PayPal use some variation of it.",
  },
  {
    id: 205, type: "spot_url",
    scenario: "You need to reset your Apple ID password. Which URL is the real Apple website?",
    urls: [
      { url: "https://iforgot.apple.com/password/verify", label: "iforgot.apple.com" },
      { url: "https://apple-id-reset.com/password", label: "apple-id-reset.com" },
      { url: "https://appleid.apple.com-recovery.support/reset", label: "apple.com-recovery.support" },
    ],
    correctIndex: 0,
    clues: ["iforgot.apple.com is a real Apple subdomain", "apple-id-reset.com is a fake domain", "The third URL's real domain is 'com-recovery.support'"],
    explanation: "iforgot.apple.com is Apple's real password reset page. 'apple-id-reset.com' is a completely fake domain. The third URL is tricky -- the real domain is 'com-recovery.support', not 'apple.com'.",
    difficulty: "hard", category: "URL Identification",
    funFact: "The subdomain trick (putting a trusted domain name before the real malicious domain) fools 71% of users in security tests. Always read URLs right-to-left from the first single slash.",
  },
];

// ─── Build randomized question set ──────────────────────────────────────────

function buildQuestionSet(playerIds: string[] = []): GameRound[] {
  const shuffledPhish = [...PHISH_BANK].sort(() => Math.random() - 0.5);
  const shuffledPass = [...PASSWORD_BANK].sort(() => Math.random() - 0.5);
  const shuffledUrl = [...URL_BANK].sort(() => Math.random() - 0.5);
  const shuffledBattle = [...BATTLE_SCENARIOS].sort(() => Math.random() - 0.5);

  // Pick 4 phish, 2 password, 2 URL, 2 battle = 10 rounds
  const picks: GameRound[] = [
    ...shuffledPhish.slice(0, 4),
    ...shuffledPass.slice(0, 2),
    ...shuffledUrl.slice(0, 2),
  ];

  // Add password battle rounds (need at least 2 players)
  if (playerIds.length >= 2) {
    const battleCount = Math.min(2, shuffledBattle.length);
    for (let i = 0; i < battleCount; i++) {
      const scenario = shuffledBattle[i];
      // Pick two random challengers for each battle (different pairs if possible)
      const shuffledPlayers = [...playerIds].sort(() => Math.random() - 0.5);
      const pair: [string, string] = [shuffledPlayers[0], shuffledPlayers[1 % shuffledPlayers.length]];
      picks.push({
        ...scenario,
        type: "password_battle",
        difficulty: "medium" as const,
        category: "Password Battle",
        challengerIds: pair,
        submissions: {},
      });
    }
  }

  return picks.sort(() => Math.random() - 0.5);
}

// ─── Check answer correctness ────────────────────────────────────────────────

function checkAnswer(round: GameRound, answer: number): boolean {
  const a = Number(answer);
  switch (round.type) {
    case "phish": {
      // answer: 1 = phishing, 0 = legit
      // Safely coerce isPhishing to boolean (Redis may store as string)
      const isPhish = round.isPhishing === true || round.isPhishing === ("true" as unknown);
      const playerSaidPhish = a === 1;
      const correct = playerSaidPhish === isPhish;
      return correct;
    }
    case "password": {
      const correctIdx = Number(round.correctAnswer);
      const correct = a === correctIdx;
      return correct;
    }
    case "spot_url": {
      const correctIdx = Number(round.correctIndex);
      const correct = a === correctIdx;
      return correct;
    }
    case "password_battle":
      // Battle rounds are scored differently -- not via checkAnswer
      return false;
    default:
      return false;
  }
}

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

const ROOM_TTL = 3600;

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function generatePlayerId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Room CRUD ───────────────────────────────────────────────────────────────

export async function createRoom(hostName: string): Promise<{ room: GameRoom; playerId: string }> {
  const roomId = generateRoomCode();
  const playerId = generatePlayerId();
  const questions = buildQuestionSet();

  const host: Player = {
    id: playerId, name: hostName, avatar: pickAvatar(0),
    score: 0, streak: 0, answers: [], lastAnswerTime: null, connected: true,
  };

  const room: GameRoom = {
    id: roomId, hostId: playerId, status: "waiting",
    players: [host], currentQuestion: 0, totalQuestions: questions.length,
    questionStartedAt: null, questionTimeLimit: 20, countdownEndsAt: null,
    createdAt: Date.now(), questionSet: questions,
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
  if (!room || room.status !== "waiting" || room.players.length >= 12) return null;
  if (room.players.some((p) => p.name.toLowerCase() === playerName.toLowerCase())) return null;

  const playerId = generatePlayerId();
  const player: Player = {
    id: playerId, name: playerName, avatar: pickAvatar(room.players.length),
    score: 0, streak: 0, answers: [], lastAnswerTime: null, connected: true,
  };

  room.players.push(player);
  await saveRoom(room);
  return { room, playerId };
}

export async function startCountdown(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room || room.hostId !== playerId || room.status !== "waiting") return null;
  room.status = "countdown";
  room.countdownEndsAt = Date.now() + 5000;
  await saveRoom(room);
  return room;
}

export async function startGame(roomId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  // Rebuild question set with player IDs (for battle round challengers)
  const playerIds = room.players.map((p) => p.id);
  room.questionSet = buildQuestionSet(playerIds);
  room.totalQuestions = room.questionSet.length;
  room.status = "playing";
  room.currentQuestion = 0;
  room.questionStartedAt = Date.now();
  room.countdownEndsAt = null;
  for (const p of room.players) { p.answers = []; p.score = 0; p.streak = 0; }
  await saveRoom(room);
  return room;
}

export async function submitAnswer(
  roomId: string, playerId: string, questionIndex: number, answer: number
): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room || room.status !== "playing" || room.currentQuestion !== questionIndex) return null;

  const player = room.players.find((p) => p.id === playerId);
  if (!player) return room;
  // Already answered this question
  if (player.answers.length > questionIndex) return room;

  const round = room.questionSet[questionIndex];
  // Battle rounds use submitBattlePassword instead
  if (round.type === "password_battle") return room;
  const correct = checkAnswer(round, answer);

  const elapsed = room.questionStartedAt ? (Date.now() - room.questionStartedAt) / 1000 : room.questionTimeLimit;
  const timeRemaining = Math.max(0, room.questionTimeLimit - elapsed);

  if (correct) {
    const speedBonus = Math.round((timeRemaining / room.questionTimeLimit) * 100);
    const streakBonus = Math.min(player.streak, 5) * 20;
    player.score += 100 + speedBonus + streakBonus;
    player.streak += 1;
  } else {
    player.streak = 0;
  }

  player.answers.push(correct);
  player.lastAnswerTime = Date.now();

  // Auto-reveal when all players answered
  if (room.players.every((p) => p.answers.length > questionIndex)) {
    room.status = "showing_results";
  }

  await saveRoom(room);
  return room;
}

export async function submitBattlePassword(
  roomId: string, playerId: string, questionIndex: number, password: string
): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room || room.status !== "playing" || room.currentQuestion !== questionIndex) return null;

  const round = room.questionSet[questionIndex];
  if (round.type !== "password_battle") return null;

  // Only challengers can submit
  if (!round.challengerIds.includes(playerId)) return null;

  // Already submitted
  if (round.submissions[playerId]) return room;

  // Score the password
  const breakdown = scorePassword(password);
  round.submissions[playerId] = { password, score: breakdown.total, breakdown };

  // Mark that this player has "answered" this round
  const player = room.players.find((p) => p.id === playerId);
  if (player && player.answers.length <= questionIndex) {
    // Mark as true (answered) for now -- scoring happens at results
    player.answers.push(true);
    player.lastAnswerTime = Date.now();
  }

  // Non-challengers also need to be marked as answered (they are spectators)
  for (const p of room.players) {
    if (!round.challengerIds.includes(p.id) && p.answers.length <= questionIndex) {
      p.answers.push(null); // spectators get null (not scored)
    }
  }

  // If both challengers submitted, auto-show results
  const bothSubmitted = round.challengerIds.every((id) => round.submissions[id]);
  if (bothSubmitted) {
    // Award points: winner gets 200, loser gets 50, tie = 125 each
    const [id1, id2] = round.challengerIds;
    const score1 = round.submissions[id1]?.score ?? 0;
    const score2 = round.submissions[id2]?.score ?? 0;
    const p1 = room.players.find((p) => p.id === id1);
    const p2 = room.players.find((p) => p.id === id2);

    if (score1 > score2) {
      if (p1) { p1.score += 200; p1.streak += 1; }
      if (p2) { p2.score += 50; p2.streak = 0; }
    } else if (score2 > score1) {
      if (p2) { p2.score += 200; p2.streak += 1; }
      if (p1) { p1.score += 50; p1.streak = 0; }
    } else {
      if (p1) { p1.score += 125; p1.streak += 1; }
      if (p2) { p2.score += 125; p2.streak += 1; }
    }

    room.status = "showing_results";
  }

  await saveRoom(room);
  return room;
}

export async function nextQuestion(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room || room.hostId !== playerId) return null;

  // Pad missing answers for the current question before moving on
  const qi = room.currentQuestion;
  for (const p of room.players) {
    if (p.answers.length <= qi) {
      p.answers.push(null);
      p.streak = 0;
    }
  }

  const nextIdx = qi + 1;
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
  if (!room || room.hostId !== playerId) return null;
  // Only transition if currently playing (prevent double-transitions)
  if (room.status !== "playing") return room;
  // Pad missing answers for any player who didn't answer (timed out)
  const qi = room.currentQuestion;
  for (const p of room.players) {
    if (p.answers.length <= qi) {
      p.answers.push(null);
      p.streak = 0;
    }
  }
  room.status = "showing_results";
  await saveRoom(room);
  return room;
}

export async function resetRoom(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room || room.hostId !== playerId) return null;
  room.status = "waiting";
  room.currentQuestion = 0;
  room.questionStartedAt = null;
  room.countdownEndsAt = null;
  room.questionSet = buildQuestionSet();
  room.totalQuestions = room.questionSet.length;
  for (const p of room.players) { p.answers = []; p.score = 0; p.streak = 0; p.lastAnswerTime = null; }
  await saveRoom(room);
  return room;
}

export async function leaveRoom(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;

  room.players = room.players.filter((p) => p.id !== playerId);
  if (room.players.length === 0) { await redis.del(roomKey(roomId)); return null; }

  // Transfer host if needed
  if (room.hostId === playerId) room.hostId = room.players[0].id;

  // If in countdown but not enough players, go back to waiting
  if (room.status === "countdown" && room.players.length < 2) {
    room.status = "waiting";
    room.countdownEndsAt = null;
  }

  // If playing: check if all REMAINING players have already answered
  if (room.status === "playing") {
    const qi = room.currentQuestion;
    // Pad any missing answers for remaining players who timed out
    const allAnswered = room.players.every((p) => p.answers.length > qi);
    if (allAnswered) {
      room.status = "showing_results";
    }
  }

  await saveRoom(room);
  return room;
}

export async function heartbeat(roomId: string, playerId: string): Promise<GameRoom | null> {
  const room = await getRoom(roomId);
  if (!room) return null;
  const player = room.players.find((p) => p.id === playerId);
  if (player) player.connected = true;
  await saveRoom(room);
  return room;
}

export { pickColor, scorePassword };
