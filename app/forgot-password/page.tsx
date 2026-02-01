"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Mail, ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email) {
      setIsSubmitted(true);
    } else {
      setError("Please enter your email address");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              CyberShield
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground leading-tight text-balance">
            Reset your password securely
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We take account security seriously. Follow our secure password reset
            process to regain access to your training account.
          </p>

          <div className="rounded-xl bg-secondary/50 p-6 space-y-4">
            <h3 className="font-semibold text-foreground">
              Password Reset Tips
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-medium">
                  1
                </div>
                <span>Use a strong, unique password with at least 12 characters</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-medium">
                  2
                </div>
                <span>Include uppercase, lowercase, numbers, and special characters</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-medium">
                  3
                </div>
                <span>Never reuse passwords across different accounts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-medium">
                  4
                </div>
                <span>Consider using a password manager for secure storage</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Security awareness starts with strong authentication
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">
              CyberShield
            </span>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {!isSubmitted ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Forgot your password?
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Enter your email address and we will send you a link to reset your
                  password.
                </p>
              </div>

              <Card className="border-border bg-card">
                <CardHeader className="pb-0">
                  {error && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        "Sending reset link..."
                      ) : (
                        <>
                          Send reset link
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Check your email
                </h2>
                <p className="text-muted-foreground mb-6">
                  We have sent a password reset link to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  The link will expire in 1 hour. If you do not see the email, check
                  your spam folder.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full border-border"
                  >
                    Try a different email
                  </Button>
                  <Link href="/login">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Return to login
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
