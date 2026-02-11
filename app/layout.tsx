import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { DepartmentsProvider } from "@/lib/departments-store";
import { CTFProvider } from "@/lib/ctf-store";
import { MobileSidebarProvider } from "@/components/training/sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    default: "CyberShield - Phish or Legit?",
    template: "%s | CyberShield",
  },
  description:
    "A real-time multiplayer party game for cybersecurity awareness. Read suspicious emails, spot phishing attacks, and outscore your opponents.",
  keywords: ["cybersecurity", "phishing", "game", "training", "multiplayer", "party game", "cybershield"],
  authors: [{ name: "CyberShield" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CyberShield",
    title: "CyberShield - Phish or Legit?",
    description: "A real-time multiplayer party game for cybersecurity awareness training",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ToastProvider>
            <DepartmentsProvider>
              <CTFProvider>
                <MobileSidebarProvider>
                  {children}
                </MobileSidebarProvider>
              </CTFProvider>
            </DepartmentsProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
