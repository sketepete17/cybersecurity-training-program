"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Home,
  BookOpen,
  BarChart3,
  Trophy,
  Settings,
  HelpCircle,
  Award,
  Users,
  Headphones,
  LogOut,
  Building2,
  FileText,
  Bell,
} from "lucide-react";

// User navigation items
const userNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/modules", label: "Training Modules", icon: BookOpen },
  { href: "/progress", label: "My Progress", icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: Award },
];

// Admin navigation items
const adminNavItems = [
  { href: "/admin", label: "Analytics Dashboard", icon: BarChart3 },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

// Shared bottom navigation
const userBottomNavItems = [
  { href: "/support", label: "Support", icon: Headphones },
  { href: "/help", label: "Help & FAQs", icon: HelpCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

const adminBottomNavItems = [
  { href: "/admin/settings", label: "Admin Settings", icon: Settings },
  { href: "/help", label: "Help & FAQs", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin, isLoading } = useAuth();

  const navItems = isAdmin ? adminNavItems : userNavItems;
  const bottomNavItems = isAdmin ? adminBottomNavItems : userBottomNavItems;

  // Show loading skeleton during auth check
  if (isLoading) {
    return (
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-sidebar-foreground">
                CyberShield
              </span>
            </div>
          </div>
          <div className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg bg-sidebar-accent/50 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-sidebar-foreground">
              CyberShield
            </span>
            {isAdmin && (
              <span className="text-xs text-primary font-medium">
                Admin Portal
              </span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <div className="mb-2 px-3">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              {isAdmin ? "Administration" : "Training"}
            </span>
          </div>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" &&
                item.href !== "/admin" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}

          {/* Admin can also view user dashboard */}
          {isAdmin && (
            <>
              <div className="mt-6 mb-2 px-3">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                  View As User
                </span>
              </div>
              <Link
                href="/"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Home className="h-5 w-5" />
                User Dashboard
              </Link>
              <Link
                href="/modules"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname.startsWith("/modules")
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <BookOpen className="h-5 w-5" />
                Training Modules
              </Link>
            </>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border px-3 py-4">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive mt-2"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>

          {/* User Profile */}
          {user && (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-3">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
                  isAdmin
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/20 text-primary"
                )}
              >
                {user.firstName?.[0] || "U"}
                {user.lastName?.[0] || ""}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {isAdmin ? "Administrator" : user.department}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
