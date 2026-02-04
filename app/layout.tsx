import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { DepartmentsProvider } from "@/lib/departments-store";
import { CTFProvider } from "@/lib/ctf-store";
import { MobileSidebarProvider } from "@/components/training/sidebar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CyberShield - Security Awareness Training",
    template: "%s | CyberShield",
  },
  description:
    "Empowering employees with practical cybersecurity skills through role-based, interactive training modules. Protect your organization from cyber threats.",
  keywords: ["cybersecurity", "security awareness", "training", "phishing prevention", "data protection"],
  authors: [{ name: "CyberShield" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CyberShield",
    title: "CyberShield - Security Awareness Training",
    description: "Interactive cybersecurity training for modern organizations",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberShield - Security Awareness Training",
    description: "Interactive cybersecurity training for modern organizations",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
      <body className={`${inter.className} font-sans antialiased`}>
        {/* Skip link for accessibility */}
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
