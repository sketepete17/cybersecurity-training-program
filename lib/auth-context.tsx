"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for simulation with passwords
const demoUsers: Record<string, User & { password: string }> = {
  "admin@company.com": {
    id: "admin-001",
    email: "admin@company.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    department: "IT Security",
    jobTitle: "Security Administrator",
    password: "admin123",
  },
  "user@company.com": {
    id: "user-001",
    email: "user@company.com",
    firstName: "Jane",
    lastName: "Doe",
    role: "user",
    department: "Finance",
    jobTitle: "Financial Analyst",
    password: "user123",
  },
};

// Routes that require admin access
const adminRoutes = ["/admin"];

// Routes that are public (no auth required)
const publicRoutes = ["/login", "/forgot-password"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const storedUser = localStorage.getItem("cybershield_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch {
      localStorage.removeItem("cybershield_user");
    }
    setIsLoading(false);
  }, [mounted]);

  // Route protection
  useEffect(() => {
    if (!mounted || isLoading) return;

    const isPublicRoute = publicRoutes.includes(pathname);
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!user && !isPublicRoute) {
      router.push("/login");
      return;
    }

    if (user && isAdminRoute && user.role !== "admin") {
      router.push("/");
      return;
    }

    if (user && pathname === "/login") {
      router.push(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, pathname, isLoading, router, mounted]);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if user exists in demo users
    const demoUser = demoUsers[email.toLowerCase()];
    
    if (!demoUser) {
      // User not found
      return false;
    }

    // Verify password
    if (demoUser.password !== password) {
      return false;
    }

    // Verify role matches - admin can't login as employee, employee can't login as admin
    if (demoUser.role !== role) {
      return false;
    }

    // Create user data without password
    const userData: User = {
      id: demoUser.id,
      email: demoUser.email,
      firstName: demoUser.firstName,
      lastName: demoUser.lastName,
      role: demoUser.role,
      department: demoUser.department,
      jobTitle: demoUser.jobTitle,
    };

    setUser(userData);
    localStorage.setItem("cybershield_user", JSON.stringify(userData));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cybershield_user");
    router.push("/login");
  };

  // Show loading state during SSR and initial mount
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          isLoading: true,
          login: async () => false,
          logout: () => {},
          isAdmin: false,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
