import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cyber Clash - Phish or Legit?",
  description:
    "A multiplayer cybersecurity awareness game. Read suspicious emails, spot phishing attacks, and outscore your opponents in real-time.",
};

export default function CyberClashLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
