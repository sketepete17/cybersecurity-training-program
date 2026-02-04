"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type Category = "crypto" | "web" | "forensics" | "network" | "reverse" | "misc";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  flag: string;
  hints: string[];
  solves: number;
  author: string;
  createdAt: string;
}

interface CTFState {
  solvedChallenges: string[];
  hintsUsed: Record<string, number>;
  attempts: Record<string, number>;
  totalPoints: number;
}

interface CTFContextType extends CTFState {
  solveChallenge: (challengeId: string, points: number) => void;
  useHint: (challengeId: string) => void;
  addAttempt: (challengeId: string) => void;
  isSolved: (challengeId: string) => boolean;
  getHintsUsed: (challengeId: string) => number;
  getAttempts: (challengeId: string) => number;
  resetProgress: () => void;
}

const CTFContext = createContext<CTFContextType | null>(null);

export function useCTF() {
  const context = useContext(CTFContext);
  if (!context) {
    throw new Error("useCTF must be used within CTFProvider");
  }
  return context;
}

export function CTFProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CTFState>({
    solvedChallenges: [],
    hintsUsed: {},
    attempts: {},
    totalPoints: 0,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("ctf-progress");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load CTF progress");
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("ctf-progress", JSON.stringify(state));
  }, [state]);

  const solveChallenge = (challengeId: string, points: number) => {
    if (state.solvedChallenges.includes(challengeId)) return;
    
    const hintsUsed = state.hintsUsed[challengeId] || 0;
    const penalty = hintsUsed * 10;
    const earnedPoints = Math.max(points - penalty, Math.floor(points * 0.5));
    
    setState(prev => ({
      ...prev,
      solvedChallenges: [...prev.solvedChallenges, challengeId],
      totalPoints: prev.totalPoints + earnedPoints,
    }));
  };

  const useHint = (challengeId: string) => {
    setState(prev => ({
      ...prev,
      hintsUsed: {
        ...prev.hintsUsed,
        [challengeId]: (prev.hintsUsed[challengeId] || 0) + 1,
      },
    }));
  };

  const addAttempt = (challengeId: string) => {
    setState(prev => ({
      ...prev,
      attempts: {
        ...prev.attempts,
        [challengeId]: (prev.attempts[challengeId] || 0) + 1,
      },
    }));
  };

  const isSolved = (challengeId: string) => state.solvedChallenges.includes(challengeId);
  const getHintsUsed = (challengeId: string) => state.hintsUsed[challengeId] || 0;
  const getAttempts = (challengeId: string) => state.attempts[challengeId] || 0;

  const resetProgress = () => {
    setState({
      solvedChallenges: [],
      hintsUsed: {},
      attempts: {},
      totalPoints: 0,
    });
  };

  return (
    <CTFContext.Provider
      value={{
        ...state,
        solveChallenge,
        useHint,
        addAttempt,
        isSolved,
        getHintsUsed,
        getAttempts,
        resetProgress,
      }}
    >
      {children}
    </CTFContext.Provider>
  );
}

// Challenge data
export const challenges: Challenge[] = [
  {
    id: "crypto-caesar",
    title: "Caesar's Secret",
    description: "Julius Caesar used this cipher to communicate with his generals. The message below was intercepted. Can you decode it?",
    category: "crypto",
    difficulty: "beginner",
    points: 100,
    flag: "CYBERSHIELD",
    hints: [
      "This is a Caesar cipher - each letter is shifted by a fixed amount",
      "Try shifting each letter backwards through the alphabet",
      "The shift value is 3 (A->D, B->E, etc.)"
    ],
    solves: 245,
    author: "CyberShield Team",
    createdAt: "2024-01-15"
  },
  {
    id: "crypto-base64",
    title: "Not So Secret",
    description: "Our security team found this encoded string in a suspicious script. Decode it to find the flag.",
    category: "crypto",
    difficulty: "beginner",
    points: 100,
    flag: "ENCODING_IS_NOT_ENCRYPTION",
    hints: [
      "This is Base64 encoding - a common way to represent binary data as text",
      "Base64 strings often end with '=' padding characters",
      "Use the decoder tool or search for 'base64 decoder' online"
    ],
    solves: 312,
    author: "CyberShield Team",
    createdAt: "2024-01-15"
  },
  {
    id: "crypto-binary",
    title: "Binary Message",
    description: "An insider threat left this binary message before leaving the company. What does it say?",
    category: "crypto",
    difficulty: "beginner",
    points: 150,
    flag: "BINARY_MASTER",
    hints: [
      "Each group of 8 bits represents one ASCII character",
      "01000001 = 65 in decimal = 'A' in ASCII",
      "Use the converter tool to translate binary to text"
    ],
    solves: 198,
    author: "CyberShield Team",
    createdAt: "2024-01-20"
  },
  {
    id: "crypto-hex",
    title: "Hex Marks the Spot",
    description: "A treasure map was found with coordinates in hexadecimal. Decode the message to find the treasure.",
    category: "crypto",
    difficulty: "intermediate",
    points: 200,
    flag: "HEX_TREASURE",
    hints: [
      "Hexadecimal uses base-16 (0-9 and A-F)",
      "Each pair of hex digits represents one ASCII character",
      "48 in hex = 72 in decimal = 'H' in ASCII"
    ],
    solves: 156,
    author: "CyberShield Team",
    createdAt: "2024-02-01"
  },
  {
    id: "crypto-xor",
    title: "XOR Challenge",
    description: "Two encrypted messages were intercepted. When XORed together, they reveal a secret. Can you find it?",
    category: "crypto",
    difficulty: "advanced",
    points: 300,
    flag: "XOR_WIZARD",
    hints: [
      "XOR is a bitwise operation: 0^0=0, 0^1=1, 1^0=1, 1^1=0",
      "When you XOR the same value twice, you get the original back",
      "The key is 42 (hint: the answer to everything)"
    ],
    solves: 87,
    author: "CyberShield Team",
    createdAt: "2024-02-15"
  },
  {
    id: "web-inspector",
    title: "Hidden in Plain Sight",
    description: "Our web developer accidentally left something in the source code. Can you find it?",
    category: "web",
    difficulty: "beginner",
    points: 100,
    flag: "VIEW_SOURCE_PRO",
    hints: [
      "Web developers often leave comments in HTML",
      "Right-click and select 'View Page Source' or 'Inspect Element'",
      "Look for HTML comments: <!-- comment -->"
    ],
    solves: 356,
    author: "CyberShield Team",
    createdAt: "2024-01-15"
  },
  {
    id: "web-cookies",
    title: "Cookie Monster",
    description: "The authentication seems to rely on cookies. Can you manipulate them to gain admin access?",
    category: "web",
    difficulty: "intermediate",
    points: 200,
    flag: "COOKIE_HACKER",
    hints: [
      "Check the browser's Developer Tools > Application > Cookies",
      "Look for cookies that might control access level",
      "Try changing the 'isAdmin' cookie value"
    ],
    solves: 145,
    author: "CyberShield Team",
    createdAt: "2024-02-01"
  },
  {
    id: "web-sql",
    title: "SQL Injection 101",
    description: "This login form might have a vulnerability. Can you bypass authentication?",
    category: "web",
    difficulty: "intermediate",
    points: 250,
    flag: "SQL_INJECTED",
    hints: [
      "SQL injection occurs when user input is not sanitized",
      "Single quotes (') can break SQL queries",
      "Try: admin' OR '1'='1"
    ],
    solves: 178,
    author: "CyberShield Team",
    createdAt: "2024-02-10"
  },
  {
    id: "web-xss",
    title: "Script Kiddie",
    description: "The comment section doesn't properly sanitize input. Can you execute a script?",
    category: "web",
    difficulty: "advanced",
    points: 300,
    flag: "XSS_ALERT",
    hints: [
      "XSS allows you to inject JavaScript into web pages",
      "Try using <script> tags in your input",
      "The flag appears when you successfully trigger an alert"
    ],
    solves: 92,
    author: "CyberShield Team",
    createdAt: "2024-03-01"
  },
  {
    id: "forensics-packet",
    title: "Packet Detective",
    description: "A network capture was found containing suspicious traffic. Find the leaked credentials.",
    category: "forensics",
    difficulty: "intermediate",
    points: 200,
    flag: "PACKET_SNIFFER",
    hints: [
      "HTTP traffic is unencrypted and can be read",
      "Look for POST requests containing form data",
      "Credentials are often in the request body"
    ],
    solves: 134,
    author: "CyberShield Team",
    createdAt: "2024-02-01"
  },
  {
    id: "forensics-metadata",
    title: "Picture Perfect",
    description: "This innocent-looking image contains hidden information. Extract the metadata to find the flag.",
    category: "forensics",
    difficulty: "intermediate",
    points: 200,
    flag: "EXIF_HUNTER",
    hints: [
      "Images contain metadata called EXIF data",
      "EXIF can include camera info, GPS coordinates, and comments",
      "Check the 'Comment' or 'Description' field"
    ],
    solves: 167,
    author: "CyberShield Team",
    createdAt: "2024-02-15"
  },
  {
    id: "forensics-stego",
    title: "Hidden Message",
    description: "There's more to this image than meets the eye. Can you find the hidden text?",
    category: "forensics",
    difficulty: "advanced",
    points: 300,
    flag: "STEGANOGRAPHY",
    hints: [
      "Steganography hides data within images",
      "The least significant bits of pixels can store hidden data",
      "Extract the LSB of each color channel"
    ],
    solves: 78,
    author: "CyberShield Team",
    createdAt: "2024-03-01"
  },
  {
    id: "network-ports",
    title: "Port Scanner",
    description: "A suspicious server was found. Analyze the open ports to identify the secret service.",
    category: "network",
    difficulty: "beginner",
    points: 150,
    flag: "ELITE_HACKER",
    hints: [
      "Common ports: 22=SSH, 80=HTTP, 443=HTTPS",
      "31337 is 'elite' in leetspeak (ELEET)",
      "Hackers often use port 31337 as a backdoor"
    ],
    solves: 223,
    author: "CyberShield Team",
    createdAt: "2024-01-20"
  },
  {
    id: "network-dns",
    title: "DNS Detective",
    description: "A domain has suspicious DNS records. Query them to find the hidden flag.",
    category: "network",
    difficulty: "intermediate",
    points: 200,
    flag: "DNS_MASTER",
    hints: [
      "DNS records include A, AAAA, MX, TXT, and more",
      "TXT records often contain verification strings or hidden data",
      "Look for unusual TXT record contents"
    ],
    solves: 112,
    author: "CyberShield Team",
    createdAt: "2024-02-10"
  },
  {
    id: "misc-phishing",
    title: "Phishing Detector",
    description: "Analyze this suspicious email and identify all the red flags to prove you can spot a phishing attempt.",
    category: "misc",
    difficulty: "beginner",
    points: 100,
    flag: "PHISHING_EXPERT",
    hints: [
      "Check the sender's email domain carefully",
      "Look for urgency and threatening language",
      "Hover over links to see where they really go"
    ],
    solves: 298,
    author: "CyberShield Team",
    createdAt: "2024-01-15"
  },
  {
    id: "misc-password",
    title: "Password Cracker",
    description: "A hashed password was found in a database dump. Can you crack it?",
    category: "misc",
    difficulty: "intermediate",
    points: 200,
    flag: "HASHCAT",
    hints: [
      "This is an MD5 hash - a weak hashing algorithm",
      "Common passwords are in wordlists (rockyou.txt)",
      "Try looking up the hash in an online database"
    ],
    solves: 156,
    author: "CyberShield Team",
    createdAt: "2024-02-01"
  },
  {
    id: "reverse-assembly",
    title: "Assembly Line",
    description: "Analyze this assembly code snippet to find out what value is stored in the register.",
    category: "reverse",
    difficulty: "advanced",
    points: 300,
    flag: "ASSEMBLY",
    hints: [
      "MOV copies values, ADD adds them",
      "Track the value of EAX through each instruction",
      "The final answer is the value in EAX at the end"
    ],
    solves: 67,
    author: "CyberShield Team",
    createdAt: "2024-03-01"
  },
  {
    id: "reverse-obfuscation",
    title: "Deobfuscate This",
    description: "This JavaScript code has been obfuscated. Can you figure out what it does?",
    category: "reverse",
    difficulty: "intermediate",
    points: 250,
    flag: "DEOBFUSCATED",
    hints: [
      "The code uses character codes to hide strings",
      "String.fromCharCode(65) = 'A'",
      "Try running the code to see what it outputs"
    ],
    solves: 98,
    author: "CyberShield Team",
    createdAt: "2024-02-20"
  }
];

export const categoryIcons = {
  crypto: "Key",
  web: "Globe",
  forensics: "Search",
  network: "Network",
  reverse: "Code",
  misc: "Puzzle",
};

export const categoryColors: Record<Category, string> = {
  crypto: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  web: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  forensics: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  network: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  reverse: "bg-red-500/10 text-red-500 border-red-500/20",
  misc: "bg-green-500/10 text-green-500 border-green-500/20",
};

export const difficultyColors: Record<Difficulty, string> = {
  beginner: "bg-green-500/10 text-green-500",
  intermediate: "bg-yellow-500/10 text-yellow-500",
  advanced: "bg-orange-500/10 text-orange-500",
  expert: "bg-red-500/10 text-red-500",
};
