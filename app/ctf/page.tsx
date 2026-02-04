"use client";

import { useState } from "react";
import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import {
  Flag,
  Lock,
  Unlock,
  Terminal,
  Shield,
  Bug,
  Network,
  Key,
  FileCode,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Zap,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
type Category = "crypto" | "web" | "forensics" | "network" | "reverse" | "misc";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  flag: string;
  hints: string[];
  solved: boolean;
  solves: number;
  content: React.ReactNode;
}

const categoryIcons: Record<Category, React.ElementType> = {
  crypto: Key,
  web: FileCode,
  forensics: Bug,
  network: Network,
  reverse: Terminal,
  misc: Shield,
};

const categoryColors: Record<Category, string> = {
  crypto: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  web: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  forensics: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  network: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  reverse: "bg-red-500/10 text-red-500 border-red-500/20",
  misc: "bg-green-500/10 text-green-500 border-green-500/20",
};

const difficultyColors: Record<Difficulty, string> = {
  beginner: "bg-green-500/10 text-green-500",
  intermediate: "bg-yellow-500/10 text-yellow-500",
  advanced: "bg-orange-500/10 text-orange-500",
  expert: "bg-red-500/10 text-red-500",
};

const challenges: Challenge[] = [
  {
    id: "crypto-1",
    title: "Caesar's Secret",
    description: "Julius Caesar used this cipher to communicate with his generals. Can you decode this message?",
    category: "crypto",
    difficulty: "beginner",
    points: 100,
    flag: "CTF{HELLO_CAESAR}",
    hints: [
      "This is a classic substitution cipher",
      "Each letter is shifted by a fixed number",
      "Try shifting each letter back by 3 positions"
    ],
    solved: false,
    solves: 245,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
          <p className="text-muted-foreground mb-2">Encrypted Message:</p>
          <p className="text-primary text-lg">KHOOR_FDHVDU</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Hint: The Caesar cipher shifts each letter by a fixed amount. A becomes D, B becomes E, etc.
        </p>
      </div>
    ),
  },
  {
    id: "web-1",
    title: "Hidden in Plain Sight",
    description: "Sometimes developers leave secrets in the most obvious places. Inspect the page carefully.",
    category: "web",
    difficulty: "beginner",
    points: 100,
    flag: "CTF{INSPECT_ELEMENT_MASTER}",
    hints: [
      "Right-click and inspect the page",
      "Check the HTML comments",
      "Developers sometimes leave notes in the source code"
    ],
    solved: false,
    solves: 312,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-foreground">Welcome to our secure login page!</p>
          <p className="text-muted-foreground mt-2">This page contains no vulnerabilities whatsoever.</p>
          {/* CTF{INSPECT_ELEMENT_MASTER} */}
        </div>
        <p className="text-sm text-muted-foreground">
          Hint: Web developers often leave comments in their HTML code. Try viewing the page source!
        </p>
      </div>
    ),
  },
  {
    id: "crypto-2",
    title: "Base64 Basics",
    description: "Encoding is not encryption! Can you decode this Base64 string?",
    category: "crypto",
    difficulty: "beginner",
    points: 100,
    flag: "CTF{BASE64_IS_NOT_ENCRYPTION}",
    hints: [
      "Base64 is an encoding scheme, not encryption",
      "Use an online Base64 decoder",
      "The '=' at the end is padding"
    ],
    solved: false,
    solves: 289,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm break-all">
          <p className="text-muted-foreground mb-2">Encoded String:</p>
          <p className="text-primary">Q1RGe0JBU0U2NF9JU19OT1RfRU5DUllQVElPTn0=</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Base64 encoding is often used to transmit binary data as text. It's not secure!
        </p>
      </div>
    ),
  },
  {
    id: "forensics-1",
    title: "Packet Analysis",
    description: "A suspicious network capture was found. Can you find the leaked password?",
    category: "forensics",
    difficulty: "intermediate",
    points: 200,
    flag: "CTF{PACKET_SNIFFING_101}",
    hints: [
      "HTTP traffic is unencrypted",
      "Look for POST requests with form data",
      "The password was transmitted in plaintext"
    ],
    solved: false,
    solves: 156,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-muted-foreground">
{`GET /login HTTP/1.1
Host: vulnerable-app.com
User-Agent: Mozilla/5.0

POST /login HTTP/1.1
Host: vulnerable-app.com
Content-Type: application/x-www-form-urlencoded

username=admin&password=CTF{PACKET_SNIFFING_101}

HTTP/1.1 200 OK
Set-Cookie: session=abc123`}
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          This is why HTTPS is important! Unencrypted traffic can be captured and read.
        </p>
      </div>
    ),
  },
  {
    id: "web-2",
    title: "SQL Injection",
    description: "The login form might be vulnerable to SQL injection. Can you bypass authentication?",
    category: "web",
    difficulty: "intermediate",
    points: 200,
    flag: "CTF{SQL_INJECTION_BYPASSED}",
    hints: [
      "Try special characters in the username field",
      "Single quotes can break SQL queries",
      "OR 1=1 always evaluates to true"
    ],
    solved: false,
    solves: 178,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Username</label>
            <Input defaultValue="admin' OR '1'='1" className="font-mono mt-1" readOnly />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Password</label>
            <Input defaultValue="anything" className="font-mono mt-1" readOnly />
          </div>
          <div className="pt-2 text-sm">
            <p className="text-muted-foreground">SQL Query becomes:</p>
            <code className="text-primary block mt-1 break-all">
              {"SELECT * FROM users WHERE username='admin' OR '1'='1' AND password='anything'"}
            </code>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          The injected OR condition makes the query always return true. Flag: CTF{"{SQL_INJECTION_BYPASSED}"}
        </p>
      </div>
    ),
  },
  {
    id: "network-1",
    title: "Port Scanner",
    description: "A server has several open ports. Which one is running the secret service?",
    category: "network",
    difficulty: "intermediate",
    points: 200,
    flag: "CTF{PORT_31337_ELITE}",
    hints: [
      "Common ports: 80 (HTTP), 443 (HTTPS), 22 (SSH)",
      "31337 is 'elite' in leet speak",
      "Hackers often use port 31337 for backdoors"
    ],
    solved: false,
    solves: 134,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
          <p className="text-muted-foreground mb-2">Nmap Scan Results:</p>
          <pre className="text-foreground">
{`PORT      STATE    SERVICE
22/tcp    open     ssh
80/tcp    open     http
443/tcp   open     https
3306/tcp  filtered mysql
31337/tcp open     Elite (secret flag server)`}
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          Port 31337 is often associated with hacker culture. 31337 = "ELEET" = "ELITE"
        </p>
      </div>
    ),
  },
  {
    id: "reverse-1",
    title: "Binary Basics",
    description: "Convert this binary message to ASCII to reveal the flag.",
    category: "reverse",
    difficulty: "beginner",
    points: 150,
    flag: "CTF{BINARY}",
    hints: [
      "Each 8 bits represents one ASCII character",
      "01000001 = 65 = 'A' in ASCII",
      "Use an online binary to ASCII converter"
    ],
    solved: false,
    solves: 267,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
          <p className="text-muted-foreground mb-2">Binary Message:</p>
          <p className="text-primary break-all">
            01000011 01010100 01000110 01111011 01000010 01001001 01001110 01000001 01010010 01011001 01111101
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Each group of 8 bits (1 byte) represents one ASCII character. Convert each byte to its decimal value, then to a character.
        </p>
      </div>
    ),
  },
  {
    id: "misc-1",
    title: "Phishing Detective",
    description: "Analyze this suspicious email and identify the red flags.",
    category: "misc",
    difficulty: "beginner",
    points: 100,
    flag: "CTF{PHISHING_DETECTED}",
    hints: [
      "Check the sender's email domain carefully",
      "Hover over links to see where they really go",
      "Look for urgency and threats in the message"
    ],
    solved: false,
    solves: 298,
    content: (
      <div className="space-y-4">
        <div className="rounded-lg bg-secondary/50 p-4 text-sm space-y-2">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">From:</span>
            <span className="text-red-400">security@amaz0n-support.ru</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Subject:</span>
            <span className="text-foreground">URGENT: Your account will be suspended!</span>
          </div>
          <div className="pt-2 text-foreground">
            <p>Dear Valued Customer,</p>
            <p className="mt-2">We have detected unusual activity on your account. Click the link below immediately or your account will be PERMANENTLY DELETED within 24 hours!</p>
            <p className="mt-2 text-blue-400 underline">https://amaz0n-verify.suspicious-site.com/login</p>
            <p className="mt-2">Sincerely,<br />Amazon Security Team</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Red Flags:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Suspicious domain (amaz0n with zero, .ru TLD)</li>
            <li>Urgency and threats (24 hours, PERMANENTLY DELETED)</li>
            <li>Suspicious link URL</li>
            <li>Generic greeting (Dear Valued Customer)</li>
          </ul>
        </div>
      </div>
    ),
  },
];

export default function CTFPage() {
  const { addToast } = useToast();
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [flagInput, setFlagInput] = useState("");
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [showHints, setShowHints] = useState<Record<string, number>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<Category | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");

  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = challenges
    .filter(c => solvedChallenges.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0);
  const progress = (earnedPoints / totalPoints) * 100;

  const filteredChallenges = challenges.filter(c => {
    if (filter !== "all" && c.category !== filter) return false;
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  const handleSubmitFlag = () => {
    if (!selectedChallenge) return;
    
    const currentAttempts = (attempts[selectedChallenge.id] || 0) + 1;
    setAttempts({ ...attempts, [selectedChallenge.id]: currentAttempts });

    if (flagInput.trim().toUpperCase() === selectedChallenge.flag.toUpperCase()) {
      if (!solvedChallenges.includes(selectedChallenge.id)) {
        setSolvedChallenges([...solvedChallenges, selectedChallenge.id]);
        addToast(`Congratulations! You earned ${selectedChallenge.points} points!`, "success");
      } else {
        addToast("You've already solved this challenge!", "info");
      }
    } else {
      addToast(`Incorrect flag. Attempt ${currentAttempts}`, "error");
    }
    setFlagInput("");
  };

  const showNextHint = (challengeId: string) => {
    const currentHintIndex = showHints[challengeId] || 0;
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge && currentHintIndex < challenge.hints.length) {
      setShowHints({ ...showHints, [challengeId]: currentHintIndex + 1 });
      addToast("Hint revealed! -10 points penalty if you solve it.", "warning");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main id="main-content" className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Flag className="h-8 w-8 text-primary" />
                  CTF Practice Arena
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Test your cybersecurity skills with hands-on capture the flag challenges
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 border border-primary/20">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold text-primary">{earnedPoints}</span>
                  <span className="text-sm text-muted-foreground">/ {totalPoints} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Flag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{solvedChallenges.length}</p>
                    <p className="text-xs text-muted-foreground">Solved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{earnedPoints}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Star className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{challenges.length - solvedChallenges.length}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{Math.round(progress)}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="border-border mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{solvedChallenges.length} / {challenges.length} challenges</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Categories
            </Button>
            {(Object.keys(categoryIcons) as Category[]).map(cat => {
              const Icon = categoryIcons[cat];
              return (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(cat)}
                  className="capitalize"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {cat}
                </Button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={difficultyFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDifficultyFilter("all")}
            >
              All Levels
            </Button>
            {(["beginner", "intermediate", "advanced", "expert"] as Difficulty[]).map(diff => (
              <Button
                key={diff}
                variant={difficultyFilter === diff ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setDifficultyFilter(diff)}
                className="capitalize"
              >
                {diff}
              </Button>
            ))}
          </div>

          {/* Challenge Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            {filteredChallenges.map(challenge => {
              const Icon = categoryIcons[challenge.category];
              const isSolved = solvedChallenges.includes(challenge.id);
              
              return (
                <Card
                  key={challenge.id}
                  className={cn(
                    "border-border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                    isSolved && "border-primary/50 bg-primary/5",
                    selectedChallenge?.id === challenge.id && "ring-2 ring-primary"
                  )}
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border",
                        categoryColors[challenge.category]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={difficultyColors[challenge.difficulty]}>
                          {challenge.difficulty}
                        </Badge>
                        {isSolved && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {challenge.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-primary font-medium">{challenge.points} pts</span>
                      <span className="text-muted-foreground">{challenge.solves} solves</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Challenge Modal */}
          {selectedChallenge && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-card">
                <CardHeader className="flex flex-row items-start justify-between sticky top-0 bg-card z-10 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={categoryColors[selectedChallenge.category]}>
                        {selectedChallenge.category}
                      </Badge>
                      <Badge className={difficultyColors[selectedChallenge.difficulty]}>
                        {selectedChallenge.difficulty}
                      </Badge>
                      <Badge variant="outline">{selectedChallenge.points} pts</Badge>
                    </div>
                    <CardTitle className="flex items-center gap-2">
                      {solvedChallenges.includes(selectedChallenge.id) && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                      {selectedChallenge.title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedChallenge(null)}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <p className="text-muted-foreground">{selectedChallenge.description}</p>
                  
                  {/* Challenge Content */}
                  <div>{selectedChallenge.content}</div>

                  {/* Hints */}
                  {(showHints[selectedChallenge.id] || 0) > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Hints
                      </p>
                      {selectedChallenge.hints.slice(0, showHints[selectedChallenge.id]).map((hint, i) => (
                        <div key={i} className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3 text-sm text-foreground">
                          Hint {i + 1}: {hint}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Flag Input */}
                  {!solvedChallenges.includes(selectedChallenge.id) ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="CTF{your_flag_here}"
                          value={flagInput}
                          onChange={(e) => setFlagInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSubmitFlag()}
                          className="font-mono"
                        />
                        <Button onClick={handleSubmitFlag}>
                          Submit
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        {(showHints[selectedChallenge.id] || 0) < selectedChallenge.hints.length && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showNextHint(selectedChallenge.id)}
                          >
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Get Hint ({selectedChallenge.hints.length - (showHints[selectedChallenge.id] || 0)} left)
                          </Button>
                        )}
                        {attempts[selectedChallenge.id] > 0 && (
                          <span className="text-sm text-muted-foreground">
                            Attempts: {attempts[selectedChallenge.id]}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-primary/10 border border-primary/20 p-4 text-center">
                      <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-lg font-semibold text-primary">Challenge Solved!</p>
                      <p className="text-sm text-muted-foreground">You earned {selectedChallenge.points} points</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
