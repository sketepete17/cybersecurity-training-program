"use client";

import { useState, useEffect, createContext, useContext } from "react";
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
  Activity,
  Menu,
  X,
  Flag,
} from "lucide-react";

// Mobile sidebar context
const MobileSidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

export function useMobileSidebar() {
  return useContext(MobileSidebarContext);
}

// User navigation items
const userNavItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/modules", label: "Training Modules", icon: BookOpen },
  { href: "/ctf", label: "CTF Practice", icon: Flag },
  { href: "/progress", label: "My Progress", icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: Award },
];

// Admin navigation items
const adminNavItems = [
  { href: "/admin", label: "Analytics Dashboard", icon: BarChart3 },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/activity", label: "Activity Log", icon: Activity },
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

export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <MobileSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function MobileHeader() {
  const { isOpen, setIsOpen } = useMobileSidebar();
  const { isAdmin } = useAuth();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <Link href={isAdmin ? "/admin" : "/"} className="flex items-center gap-3 transition-opacity hover:opacity-80">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <ShieldCheck className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">CyberShield</span>
        {isAdmin && (
          <span className="text-xs text-primary font-medium">Admin</span>
        )}
      </Link>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-secondary"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>
    </header>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin, isLoading } = useAuth();
  const { isOpen, setIsOpen } = useMobileSidebar();

  const navItems = isAdmin ? adminNavItems : userNavItems;
  const bottomNavItems = isAdmin ? adminBottomNavItems : userBottomNavItems;

  // Show loading skeleton during auth check
  if (isLoading) {
    return (
      <>
        {/* Mobile overlay */}
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm hidden" />
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar hidden lg:block">
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
      </>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-sidebar transition-transform duration-300 ease-in-out",
        "lg:translate-x-0 lg:z-40",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
      <div className="flex h-full flex-col">
        {/* Logo */}
        <Link 
          href={isAdmin ? "/admin" : "/"} 
          className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6 transition-all duration-200 hover:bg-sidebar-accent/50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-transform duration-200 hover:scale-105">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
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
        </Link>

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
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-primary shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-200",
                  !isActive && "group-hover:scale-110"
                )} />
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                )}
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
    </>
  );
}
