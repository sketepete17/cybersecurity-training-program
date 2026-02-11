import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CyberShield - Phish or Legit?",
  description:
    "A real-time multiplayer cybersecurity game. Read suspicious emails, spot phishing attacks, and outscore your opponents.",
};

export default function CyberShieldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
