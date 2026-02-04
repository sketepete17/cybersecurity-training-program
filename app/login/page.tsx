"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth, UserRole } from "@/lib/auth-context";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSSOLoading, setIsSSOLoading] = useState<"google" | "microsoft" | null>(null);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("user");

  const handleSSOLogin = async (provider: "google" | "microsoft") => {
    setIsSSOLoading(provider);
    setError("");
    
    // Simulate SSO authentication delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Demo: SSO login will auto-login based on selected role
    const ssoEmail = selectedRole === "admin" ? "admin@company.com" : "user@company.com";
    const ssoPassword = selectedRole === "admin" ? "admin123" : "user123";
    
    const success = await login(ssoEmail, ssoPassword, selectedRole);
    
    if (success) {
      addToast(`Successfully signed in with ${provider === "google" ? "Google" : "Microsoft"}`, "success");
      if (selectedRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setError(`${provider === "google" ? "Google" : "Microsoft"} SSO is not configured for ${selectedRole === "admin" ? "administrator" : "employee"} accounts.`);
      addToast("SSO login failed", "error");
    }
    
    setIsSSOLoading(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password");
      setIsLoading(false);
      return;
    }

    const success = await login(email, password, selectedRole);

    if (success) {
      // Redirect based on role
      if (selectedRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setError("Invalid credentials. Please try again.");
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
            Empowering your team with security awareness
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Interactive training modules designed to protect your organization
            from cyber threats. Learn at your own pace with role-based content.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-3xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-3xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Training Modules</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-3xl font-bold text-primary">10k+</p>
              <p className="text-sm text-muted-foreground">Users Trained</p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4">
              <p className="text-3xl font-bold text-primary">85%</p>
              <p className="text-sm text-muted-foreground">Threat Reduction</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Trusted by leading enterprises worldwide
        </p>
      </div>

      {/* Right Side - Login Form */}
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

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to continue your security training
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
              {/* Role Selection */}
              <div className="mb-6">
                <label className="text-sm font-medium text-foreground block mb-3">
                  Select your role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("user")}
                    aria-pressed={selectedRole === "user"}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      selectedRole === "user"
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border bg-secondary/30 hover:border-muted-foreground hover:scale-[1.02]"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        selectedRole === "user"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <User className="h-6 w-6" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        selectedRole === "user"
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      Employee
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      Access training modules
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("admin")}
                    aria-pressed={selectedRole === "admin"}
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                      selectedRole === "admin"
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border bg-secondary/30 hover:border-muted-foreground hover:scale-[1.02]"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        selectedRole === "admin"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        selectedRole === "admin"
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      Administrator
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      Manage users & metrics
                    </span>
                  </button>
                </div>
              </div>

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
                      placeholder={
                        selectedRole === "admin"
                          ? "admin@company.com"
                          : "you@company.com"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign in as{" "}
                      {selectedRole === "admin" ? "Administrator" : "Employee"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="border-border bg-secondary hover:bg-secondary/80 text-foreground"
                  onClick={() => handleSSOLogin("google")}
                  disabled={isLoading || isSSOLoading !== null}
                >
                  {isSSOLoading === "google" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {isSSOLoading === "google" ? "Connecting..." : "Google"}
                </Button>
                <Button
                  variant="outline"
                  className="border-border bg-secondary hover:bg-secondary/80 text-foreground"
                  onClick={() => handleSSOLogin("microsoft")}
                  disabled={isLoading || isSSOLoading !== null}
                >
                  {isSSOLoading === "microsoft" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                  )}
                  {isSSOLoading === "microsoft" ? "Connecting..." : "Microsoft"}
                </Button>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 rounded-lg bg-secondary/50 p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Demo Credentials:
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">
                      Employee:
                    </span>{" "}
                    user@company.com / user123
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Admin:</span>{" "}
                    admin@company.com / admin123
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Note: Each account only works with its matching role selection.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="#" className="text-primary hover:underline font-medium">
              Contact your administrator
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
