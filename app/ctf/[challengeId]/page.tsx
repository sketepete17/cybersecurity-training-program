"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useCTF, challenges, categoryColors, difficultyColors } from "@/lib/ctf-store";
import {
  Flag,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Send,
  Key,
  Globe,
  Search,
  Network,
  Code,
  Puzzle,
  Trophy,
  Clock,
  User,
  AlertTriangle,
  Copy,
  RefreshCw,
  Play,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons = {
  crypto: Key,
  web: Globe,
  forensics: Search,
  network: Network,
  reverse: Code,
  misc: Puzzle,
};

// Caesar Cipher Tool Component
function CaesarCipherTool({ onSolve }: { onSolve: (flag: string) => void }) {
  const [input, setInput] = useState("FBEHU VKLHOG");
  const [shift, setShift] = useState(3);
  const [output, setOutput] = useState("");

  const decrypt = (text: string, shiftAmount: number) => {
    return text
      .split("")
      .map(char => {
        if (char.match(/[A-Z]/)) {
          const code = char.charCodeAt(0) - 65;
          const shifted = (code - shiftAmount + 26) % 26;
          return String.fromCharCode(shifted + 65);
        }
        return char;
      })
      .join("");
  };

  useEffect(() => {
    setOutput(decrypt(input, shift));
  }, [input, shift]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Encrypted Message:</p>
        <p className="text-xl font-mono text-primary font-bold tracking-wider">FBEHU VKLHOG</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Input Text</label>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            className="font-mono"
            placeholder="Enter text to decrypt"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Shift Amount: {shift}</label>
          <input
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
        <p className="text-sm text-muted-foreground mb-2">Decrypted Output:</p>
        <p className="text-xl font-mono text-primary font-bold tracking-wider">{output}</p>
      </div>

      <p className="text-sm text-muted-foreground">
        Adjust the shift value until you see readable text. The flag is the decrypted message (without spaces).
      </p>
    </div>
  );
}

// Base64 Decoder Tool
function Base64Tool() {
  const [input, setInput] = useState("RU5DT0RJTkdfSVNfTk9UX0VOQ1JZUFRJT04=");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      setError("");
    } catch (e) {
      setError("Invalid Base64 string");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Encoded String:</p>
        <p className="text-sm font-mono text-primary break-all">RU5DT0RJTkdfSVNfTk9UX0VOQ1JZUFRJT04=</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Base64 Input</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono text-sm"
          rows={3}
        />
      </div>

      <Button onClick={decode} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        Decode Base64
      </Button>

      {output && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Decoded Output:</p>
          <p className="text-lg font-mono text-primary font-bold">{output}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}

// Binary Converter Tool
function BinaryTool() {
  const [input, setInput] = useState("01000010 01001001 01001110 01000001 01010010 01011001 01011111 01001101 01000001 01010011 01010100 01000101 01010010");
  const [output, setOutput] = useState("");

  const convert = () => {
    const bytes = input.trim().split(/\s+/);
    const text = bytes
      .map(byte => String.fromCharCode(parseInt(byte, 2)))
      .join("");
    setOutput(text);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Binary Message:</p>
        <p className="text-xs font-mono text-primary break-all leading-relaxed">
          01000010 01001001 01001110 01000001 01010010 01011001 01011111 01001101 01000001 01010011 01010100 01000101 01010010
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Binary Input (space-separated bytes)</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="font-mono text-xs"
          rows={3}
        />
      </div>

      <Button onClick={convert} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        Convert to ASCII
      </Button>

      {output && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">ASCII Output:</p>
          <p className="text-lg font-mono text-primary font-bold">{output}</p>
        </div>
      )}
    </div>
  );
}

// Hex Converter Tool
function HexTool() {
  const [input, setInput] = useState("4845585f54524541535552455f");
  const [output, setOutput] = useState("");

  const convert = () => {
    let result = "";
    for (let i = 0; i < input.length; i += 2) {
      const hex = input.substr(i, 2);
      if (hex.match(/[0-9A-Fa-f]{2}/)) {
        result += String.fromCharCode(parseInt(hex, 16));
      }
    }
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Hexadecimal String:</p>
        <p className="text-sm font-mono text-primary">4845585f5452454153555245</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Hex Input</label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          className="font-mono"
        />
      </div>

      <Button onClick={convert} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        Convert to ASCII
      </Button>

      {output && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">ASCII Output:</p>
          <p className="text-lg font-mono text-primary font-bold">{output}</p>
        </div>
      )}
    </div>
  );
}

// XOR Tool
function XORTool() {
  const [key, setKey] = useState(42);
  const encrypted = [11, 26, 0, 63, 37, 16, 50, 42, 0, 22, 63];
  const [output, setOutput] = useState("");

  const decrypt = () => {
    const result = encrypted.map(byte => String.fromCharCode(byte ^ key)).join("");
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Encrypted Bytes (decimal):</p>
        <p className="text-sm font-mono text-primary">[{encrypted.join(", ")}]</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">XOR Key: {key}</label>
        <input
          type="range"
          min="1"
          max="255"
          value={key}
          onChange={(e) => setKey(parseInt(e.target.value))}
          className="w-full accent-primary"
        />
        <Input
          type="number"
          value={key}
          onChange={(e) => setKey(parseInt(e.target.value) || 0)}
          className="font-mono"
          min="1"
          max="255"
        />
      </div>

      <Button onClick={decrypt} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        XOR Decrypt
      </Button>

      {output && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Decrypted Output:</p>
          <p className="text-lg font-mono text-primary font-bold">{output}</p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Hint: Douglas Adams knew the answer...
      </p>
    </div>
  );
}

// Web Inspector Challenge
function WebInspectorChallenge() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-6 border border-border">
        <div className="text-center">
          <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to SecureBank</h3>
          <p className="text-muted-foreground">Your trusted financial partner since 1995</p>
          {/* FLAG: VIEW_SOURCE_PRO - Check the page source! */}
        </div>
      </div>
      
      <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>Tip:</strong> Right-click on the card above and select "Inspect" or "View Page Source" to see the HTML. 
          Look for HTML comments that look like {"<!-- comment -->"}.
        </p>
      </div>
      
      <p className="text-sm text-muted-foreground">
        The flag format is: VIEW_SOURCE_PRO
      </p>
    </div>
  );
}

// Cookie Challenge
function CookieChallenge() {
  const [cookies, setCookies] = useState({
    session: "abc123xyz",
    theme: "dark",
    isAdmin: "false",
  });
  const [message, setMessage] = useState("");

  const checkAccess = () => {
    if (cookies.isAdmin === "true") {
      setMessage("Access granted! The flag is: COOKIE_HACKER");
    } else {
      setMessage("Access denied. You are not an admin.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm font-medium text-foreground mb-3">Browser Cookies:</p>
        <div className="space-y-2 font-mono text-sm">
          {Object.entries(cookies).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-muted-foreground">{key}:</span>
              <Input
                value={value}
                onChange={(e) => setCookies({ ...cookies, [key]: e.target.value })}
                className="flex-1 h-8 font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={checkAccess} className="w-full">
        <Key className="h-4 w-4 mr-2" />
        Check Admin Access
      </Button>

      {message && (
        <div className={cn(
          "rounded-lg p-4 border",
          message.includes("granted") 
            ? "bg-primary/10 border-primary/20 text-primary" 
            : "bg-destructive/10 border-destructive/20 text-destructive"
        )}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}
    </div>
  );
}

// SQL Injection Challenge
function SQLInjectionChallenge() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [query, setQuery] = useState("");

  const handleLogin = () => {
    const generatedQuery = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    setQuery(generatedQuery);

    // Check for SQL injection
    if (username.includes("'") && (username.includes("OR") || username.includes("or"))) {
      if (username.includes("1=1") || username.includes("1'='1")) {
        setResult({ success: true, message: "Login successful! Flag: SQL_INJECTED" });
      } else {
        setResult({ success: false, message: "SQL Error: syntax error" });
      }
    } else if (username === "admin" && password === "admin123") {
      setResult({ success: true, message: "Login successful!" });
    } else {
      setResult({ success: false, message: "Invalid username or password" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border space-y-3">
        <h4 className="font-medium text-foreground">Login Form</h4>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <Button onClick={handleLogin} className="w-full">Login</Button>
      </div>

      {query && (
        <div className="rounded-lg bg-secondary/30 p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Generated SQL Query:</p>
          <code className="text-xs text-orange-400 break-all">{query}</code>
        </div>
      )}

      {result && (
        <div className={cn(
          "rounded-lg p-4 border",
          result.success 
            ? "bg-primary/10 border-primary/20" 
            : "bg-destructive/10 border-destructive/20"
        )}>
          <p className={cn("text-sm font-medium", result.success ? "text-primary" : "text-destructive")}>
            {result.message}
          </p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Hint: Try entering something that breaks the SQL query logic...
      </p>
    </div>
  );
}

// XSS Challenge
function XSSChallenge() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { user: "Alice", text: "Great article!" },
    { user: "Bob", text: "Very informative." },
  ]);
  const [xssTriggered, setXssTriggered] = useState(false);

  const postComment = () => {
    if (comment.toLowerCase().includes("<script>") && comment.toLowerCase().includes("alert")) {
      setXssTriggered(true);
    }
    setComments([...comments, { user: "You", text: comment }]);
    setComment("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <h4 className="font-medium text-foreground mb-3">Comments Section</h4>
        <div className="space-y-2 mb-4">
          {comments.map((c, i) => (
            <div key={i} className="p-2 rounded bg-background border border-border">
              <span className="font-medium text-foreground">{c.user}:</span>{" "}
              <span className="text-muted-foreground">{c.text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <Button onClick={postComment}>Post</Button>
        </div>
      </div>

      {xssTriggered && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20 animate-in zoom-in duration-300">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span className="font-medium text-primary">XSS Triggered!</span>
          </div>
          <p className="text-sm text-foreground">Flag: XSS_ALERT</p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Try injecting a script tag that shows an alert...
      </p>
    </div>
  );
}

// Packet Analysis Challenge
function PacketAnalysisChallenge() {
  const packets = `
Frame 1: 74 bytes on wire
Ethernet II, Src: 00:0c:29:xx:xx:xx
Internet Protocol, Src: 192.168.1.100
TCP, Src Port: 52431, Dst Port: 80

GET /login HTTP/1.1
Host: internal.company.com
User-Agent: Mozilla/5.0

---

Frame 2: 523 bytes on wire
Ethernet II, Src: 00:0c:29:xx:xx:xx
Internet Protocol, Src: 192.168.1.100
TCP, Src Port: 52431, Dst Port: 80

POST /login HTTP/1.1
Host: internal.company.com
Content-Type: application/x-www-form-urlencoded

username=admin&password=PACKET_SNIFFER

---

Frame 3: 256 bytes on wire
HTTP/1.1 200 OK
Set-Cookie: session=authenticated
`.trim();

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-[#1a1a2e] p-4 border border-border overflow-x-auto">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Network Capture - Wireshark</span>
        </div>
        <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{packets}</pre>
      </div>

      <p className="text-sm text-muted-foreground">
        Analyze the captured network traffic. Look for credentials transmitted in plain text. 
        This is why HTTPS is important!
      </p>
    </div>
  );
}

// Metadata Challenge
function MetadataChallenge() {
  const metadata = {
    "File Name": "company_photo.jpg",
    "File Size": "2.4 MB",
    "Image Size": "4032 x 3024",
    "Camera Make": "Apple",
    "Camera Model": "iPhone 13 Pro",
    "Date/Time": "2024:01:15 14:32:45",
    "GPS Latitude": "37.7749° N",
    "GPS Longitude": "122.4194° W",
    "Author": "John Smith",
    "Comment": "FLAG: EXIF_HUNTER",
    "Software": "Adobe Photoshop 2024",
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4">
          <span className="text-muted-foreground">company_photo.jpg</span>
        </div>
        <h4 className="font-medium text-foreground mb-3">EXIF Metadata</h4>
        <div className="space-y-1 text-sm font-mono">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key} className="flex justify-between py-1 border-b border-border last:border-0">
              <span className="text-muted-foreground">{key}:</span>
              <span className={cn(
                "text-foreground",
                key === "Comment" && "text-primary font-bold"
              )}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Images often contain hidden metadata. The EXIF data can reveal camera info, 
        GPS coordinates, and sometimes hidden comments!
      </p>
    </div>
  );
}

// Port Scanner Challenge
function PortScannerChallenge() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const runScan = () => {
    setScanning(true);
    setResults([]);
    
    const ports = [
      "21/tcp    closed  ftp",
      "22/tcp    open    ssh",
      "23/tcp    closed  telnet",
      "25/tcp    closed  smtp",
      "80/tcp    open    http",
      "443/tcp   open    https",
      "3306/tcp  filtered mysql",
      "8080/tcp  closed  http-proxy",
      "31337/tcp open    Elite (flag: ELITE_HACKER)",
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < ports.length) {
        setResults(prev => [...prev, ports[index]]);
        index++;
      } else {
        setScanning(false);
        clearInterval(interval);
      }
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-[#1a1a2e] p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Terminal</span>
        </div>
        <div className="font-mono text-sm">
          <p className="text-green-400">$ nmap -sV 192.168.1.100</p>
          <p className="text-muted-foreground mt-2">Starting Nmap scan...</p>
          {results.map((result, i) => (
            <p key={i} className={cn(
              "text-sm",
              result.includes("open") ? "text-green-400" : 
              result.includes("filtered") ? "text-yellow-400" : "text-red-400"
            )}>
              {result}
            </p>
          ))}
          {scanning && <p className="text-muted-foreground animate-pulse">Scanning...</p>}
        </div>
      </div>

      <Button onClick={runScan} disabled={scanning} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        {scanning ? "Scanning..." : "Run Port Scan"}
      </Button>

      <p className="text-sm text-muted-foreground">
        Port 31337 is legendary in hacker culture. 31337 = ELEET = ELITE
      </p>
    </div>
  );
}

// Phishing Challenge
function PhishingChallenge() {
  const [flagsFound, setFlagsFound] = useState<string[]>([]);
  const redFlags = [
    "Suspicious sender domain (amaz0n-support.ru)",
    "Urgency and threatening language",
    "Suspicious link URL",
    "Generic greeting",
    "Spelling/grammar errors",
  ];

  const toggleFlag = (flag: string) => {
    if (flagsFound.includes(flag)) {
      setFlagsFound(flagsFound.filter(f => f !== flag));
    } else {
      setFlagsFound([...flagsFound, flag]);
    }
  };

  const allFound = flagsFound.length >= 4;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">From:</span>
            <span className="text-red-400">security@amaz0n-support.ru</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Subject:</span>
            <span className="text-foreground">URGENT: Your acount will be suspnded!</span>
          </div>
          <div className="pt-2 text-foreground">
            <p>Dear Valued Customer,</p>
            <p className="mt-2">
              We have detected unusual activity on your account. Click the link below 
              immediatly or your account will be PERMANENTLY DELETED within 24 hours!
            </p>
            <p className="mt-2 text-blue-400 underline cursor-pointer">
              https://amaz0n-verify.suspicious-site.ru/login
            </p>
            <p className="mt-2">Sincerely,<br />Amazon Security Team</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Identify the red flags (select at least 4):</p>
        {redFlags.map((flag) => (
          <button
            key={flag}
            onClick={() => toggleFlag(flag)}
            className={cn(
              "w-full text-left p-3 rounded-lg border transition-all text-sm",
              flagsFound.includes(flag)
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-secondary/30 border-border text-foreground hover:border-primary/30"
            )}
          >
            {flagsFound.includes(flag) && <CheckCircle2 className="inline h-4 w-4 mr-2" />}
            {flag}
          </button>
        ))}
      </div>

      {allFound && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20 animate-in zoom-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-primary inline mr-2" />
          <span className="font-medium text-primary">Excellent! You found enough red flags!</span>
          <p className="text-sm text-foreground mt-1">Flag: PHISHING_EXPERT</p>
        </div>
      )}
    </div>
  );
}

// Password Cracker Challenge
function PasswordCrackerChallenge() {
  const [input, setInput] = useState("");
  const [cracking, setCracking] = useState(false);
  const [result, setResult] = useState("");
  const targetHash = "5f4dcc3b5aa765d61d8327deb882cf99"; // MD5 of "password"

  const commonPasswords = ["123456", "password", "admin", "letmein", "welcome", "monkey"];

  const crack = () => {
    setCracking(true);
    setResult("");
    
    setTimeout(() => {
      if (input.toLowerCase() === targetHash) {
        setResult("Hash cracked! Password: 'password' | Flag: HASHCAT");
      } else {
        setResult("Hash not found in database. Try the full hash.");
      }
      setCracking(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">MD5 Hash from database dump:</p>
        <p className="text-sm font-mono text-primary break-all">{targetHash}</p>
      </div>

      <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          <strong>Hint:</strong> MD5 is a weak hash. Try searching for this hash online at 
          sites like crackstation.net, or try common passwords from wordlists.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Enter hash to look up:</label>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste the hash here"
          className="font-mono text-sm"
        />
      </div>

      <Button onClick={crack} disabled={cracking} className="w-full">
        <Search className="h-4 w-4 mr-2" />
        {cracking ? "Searching rainbow tables..." : "Crack Hash"}
      </Button>

      {result && (
        <div className={cn(
          "rounded-lg p-4 border",
          result.includes("cracked") 
            ? "bg-primary/10 border-primary/20 text-primary" 
            : "bg-destructive/10 border-destructive/20 text-destructive"
        )}>
          <p className="text-sm font-medium">{result}</p>
        </div>
      )}
    </div>
  );
}

// Assembly Challenge
function AssemblyChallenge() {
  const [eax, setEax] = useState(0);
  const [step, setStep] = useState(0);
  const instructions = [
    { code: "MOV EAX, 10", desc: "Move 10 into EAX", action: () => 10 },
    { code: "ADD EAX, 5", desc: "Add 5 to EAX", action: (v: number) => v + 5 },
    { code: "MUL EAX, 2", desc: "Multiply EAX by 2", action: (v: number) => v * 2 },
    { code: "SUB EAX, 7", desc: "Subtract 7 from EAX", action: (v: number) => v - 7 },
    { code: "ADD EAX, 40", desc: "Add 40 to EAX", action: (v: number) => v + 40 },
  ];

  const runStep = () => {
    if (step < instructions.length) {
      const newValue = instructions[step].action(eax);
      setEax(newValue);
      setStep(step + 1);
    }
  };

  const reset = () => {
    setEax(0);
    setStep(0);
  };

  const finalValue = 63; // (10 + 5) * 2 - 7 + 40 = 63

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-[#1a1a2e] p-4 border border-border font-mono text-sm">
        {instructions.map((inst, i) => (
          <div key={i} className={cn(
            "py-1",
            i < step ? "text-green-400" : i === step ? "text-yellow-400" : "text-muted-foreground"
          )}>
            {i < step && "✓ "}{inst.code}
            {i === step && " ← current"}
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Register EAX:</span>
          <span className="text-2xl font-mono text-primary font-bold">{eax}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={runStep} disabled={step >= instructions.length} className="flex-1">
          <Play className="h-4 w-4 mr-2" />
          Step
        </Button>
        <Button onClick={reset} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {step >= instructions.length && eax === finalValue && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <p className="text-sm font-medium text-primary">
            Final value: {eax} | Flag: ASSEMBLY
          </p>
        </div>
      )}
    </div>
  );
}

// Deobfuscation Challenge
function DeobfuscationChallenge() {
  const [output, setOutput] = useState("");
  const obfuscatedCode = `
var _0x = [68,69,79,66,70,85,83,67,65,84,69,68];
var result = '';
for(var i=0; i<_0x.length; i++) {
  result += String.fromCharCode(_0x[i]);
}
console.log(result);
`.trim();

  const runCode = () => {
    const chars = [68, 69, 79, 66, 70, 85, 83, 67, 65, 84, 69, 68];
    const result = chars.map(c => String.fromCharCode(c)).join("");
    setOutput(result);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-[#1a1a2e] p-4 border border-border overflow-x-auto">
        <pre className="text-xs text-green-400 font-mono">{obfuscatedCode}</pre>
      </div>

      <Button onClick={runCode} className="w-full">
        <Play className="h-4 w-4 mr-2" />
        Run Code
      </Button>

      {output && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Console Output:</p>
          <p className="text-lg font-mono text-primary font-bold">{output}</p>
          <p className="text-sm text-foreground mt-2">Flag: {output}</p>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        String.fromCharCode() converts ASCII codes to characters. 
        68 = 'D', 69 = 'E', etc.
      </p>
    </div>
  );
}

// DNS Challenge
function DNSChallenge() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const runQuery = () => {
    setResults([]);
    const domain = query.toLowerCase();
    
    setTimeout(() => {
      if (domain.includes("suspicious") || domain === "") {
        setResults([
          "A Record: 192.168.1.50",
          "MX Record: mail.suspicious-domain.com",
          "TXT Record: v=spf1 include:_spf.google.com ~all",
          "TXT Record: FLAG=DNS_MASTER",
          "NS Record: ns1.suspicious-domain.com",
        ]);
      } else {
        setResults(["No records found for this domain"]);
      }
    }, 500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Target Domain:</p>
        <p className="text-primary font-mono">suspicious-domain.com</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Domain to query:</label>
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="suspicious-domain.com"
            className="font-mono"
          />
          <Button onClick={runQuery}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="rounded-lg bg-[#1a1a2e] p-4 border border-border font-mono text-sm">
          <p className="text-muted-foreground mb-2">DNS Records:</p>
          {results.map((r, i) => (
            <p key={i} className={cn(
              "py-1",
              r.includes("FLAG") ? "text-primary font-bold" : "text-green-400"
            )}>{r}</p>
          ))}
        </div>
      )}
    </div>
  );
}

// Steganography Challenge
function SteganographyChallenge() {
  const [extracted, setExtracted] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-secondary/50 p-4 border border-border">
        <div className="flex items-center justify-center h-40 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg mb-4 relative">
          <span className="text-muted-foreground">secret_image.png</span>
          {extracted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <p className="text-primary font-mono font-bold">STEGANOGRAPHY</p>
            </div>
          )}
        </div>
      </div>

      <Button onClick={() => setExtracted(true)} className="w-full">
        <Search className="h-4 w-4 mr-2" />
        Extract LSB Data
      </Button>

      {extracted && (
        <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Hidden message found:</p>
          <p className="text-lg font-mono text-primary font-bold">STEGANOGRAPHY</p>
          <p className="text-sm text-foreground mt-2">
            Steganography hides data in the least significant bits of image pixels.
          </p>
        </div>
      )}
    </div>
  );
}

// Challenge content renderer
function ChallengeContent({ challengeId }: { challengeId: string }) {
  switch (challengeId) {
    case "crypto-caesar":
      return <CaesarCipherTool onSolve={() => {}} />;
    case "crypto-base64":
      return <Base64Tool />;
    case "crypto-binary":
      return <BinaryTool />;
    case "crypto-hex":
      return <HexTool />;
    case "crypto-xor":
      return <XORTool />;
    case "web-inspector":
      return <WebInspectorChallenge />;
    case "web-cookies":
      return <CookieChallenge />;
    case "web-sql":
      return <SQLInjectionChallenge />;
    case "web-xss":
      return <XSSChallenge />;
    case "forensics-packet":
      return <PacketAnalysisChallenge />;
    case "forensics-metadata":
      return <MetadataChallenge />;
    case "forensics-stego":
      return <SteganographyChallenge />;
    case "network-ports":
      return <PortScannerChallenge />;
    case "network-dns":
      return <DNSChallenge />;
    case "misc-phishing":
      return <PhishingChallenge />;
    case "misc-password":
      return <PasswordCrackerChallenge />;
    case "reverse-assembly":
      return <AssemblyChallenge />;
    case "reverse-obfuscation":
      return <DeobfuscationChallenge />;
    default:
      return <p className="text-muted-foreground">Challenge content not found.</p>;
  }
}

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const { solveChallenge, useHint, addAttempt, isSolved, getHintsUsed, getAttempts } = useCTF();
  
  const challengeId = params.challengeId as string;
  const challenge = challenges.find(c => c.id === challengeId);

  const [flagInput, setFlagInput] = useState("");
  const [showHintCount, setShowHintCount] = useState(0);

  useEffect(() => {
    if (challenge) {
      setShowHintCount(getHintsUsed(challenge.id));
    }
  }, [challenge, getHintsUsed]);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Challenge Not Found</h1>
          <p className="text-muted-foreground mb-4">The challenge you're looking for doesn't exist.</p>
          <Link href="/ctf">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = categoryIcons[challenge.category as keyof typeof categoryIcons];
  const solved = isSolved(challenge.id);
  const hintsUsed = getHintsUsed(challenge.id);
  const attempts = getAttempts(challenge.id);

  const handleSubmit = () => {
    if (!flagInput.trim()) {
      addToast("Please enter a flag", "warning");
      return;
    }

    addAttempt(challenge.id);

    const cleanInput = flagInput.trim().toUpperCase().replace(/^CTF\{|\}$/g, "");
    const cleanFlag = challenge.flag.toUpperCase();

    if (cleanInput === cleanFlag || `CTF{${cleanInput}}` === `CTF{${cleanFlag}}`) {
      if (!solved) {
        solveChallenge(challenge.id, challenge.points);
        addToast(`Correct! You earned ${challenge.points - (hintsUsed * 10)} points!`, "success");
      } else {
        addToast("You've already solved this challenge!", "info");
      }
    } else {
      addToast("Incorrect flag. Try again!", "error");
    }
    setFlagInput("");
  };

  const handleHint = () => {
    if (showHintCount < challenge.hints.length) {
      useHint(challenge.id);
      setShowHintCount(showHintCount + 1);
      addToast("Hint revealed! (-10 points if you solve it)", "warning");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main id="main-content" className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8 max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/ctf" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenges
          </Link>

          {/* Challenge Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className={categoryColors[challenge.category]}>
                <Icon className="h-3 w-3 mr-1" />
                {challenge.category}
              </Badge>
              <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
                {challenge.difficulty}
              </Badge>
              <Badge variant="outline">{challenge.points} pts</Badge>
              {solved && (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-2">{challenge.title}</h1>
            <p className="text-muted-foreground">{challenge.description}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {challenge.author}
              </span>
              <span className="flex items-center gap-1">
                <Flag className="h-4 w-4" />
                {challenge.solves} solves
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {challenge.createdAt}
              </span>
            </div>
          </div>

          {/* Challenge Content */}
          <Card className="border-border mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <CardHeader>
              <CardTitle className="text-lg">Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <ChallengeContent challengeId={challenge.id} />
            </CardContent>
          </Card>

          {/* Hints Section */}
          {showHintCount > 0 && (
            <Card className="border-border mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Hints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {challenge.hints.slice(0, showHintCount).map((hint, i) => (
                  <div key={i} className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                    <p className="text-sm text-foreground">
                      <span className="font-medium text-yellow-600 dark:text-yellow-400">Hint {i + 1}:</span> {hint}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Flag Submission */}
          <Card className="border-border animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle className="text-lg">Submit Flag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {solved ? (
                <div className="rounded-lg bg-primary/10 border border-primary/20 p-6 text-center">
                  <Trophy className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-primary mb-1">Challenge Completed!</h3>
                  <p className="text-muted-foreground">
                    You earned {challenge.points - (hintsUsed * 10)} points
                    {hintsUsed > 0 && ` (${hintsUsed * 10} point penalty for hints)`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input
                      value={flagInput}
                      onChange={(e) => setFlagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="Enter flag (e.g., CTF{FLAG} or just FLAG)"
                      className="font-mono"
                    />
                    <Button onClick={handleSubmit}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {showHintCount < challenge.hints.length && (
                      <Button variant="outline" size="sm" onClick={handleHint}>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Get Hint ({challenge.hints.length - showHintCount} left)
                      </Button>
                    )}
                    {attempts > 0 && (
                      <span className="text-sm text-muted-foreground">
                        Attempts: {attempts}
                      </span>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
