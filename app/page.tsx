"use client";

import React from "react"

import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { ModuleCard } from "@/components/training/module-card";
import { StatCard } from "@/components/training/stat-card";
import { modules, mockUserProgress, roles } from "@/lib/training-data";
import {
  BookOpen,
  Trophy,
  Target,
  Clock,
  ChevronRight,
  Users,
  Briefcase,
  DollarSign,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const roleIconMap: Record<string, React.ComponentType<{ className?: string }>> =
  {
    Users,
    DollarSign,
    Settings,
    Briefcase,
  };

export default function DashboardPage() {
  const completedModules = modules.filter((m) =>
    m.lessons.every((l) =>
      mockUserProgress.some(
        (p) => p.moduleId === m.id && p.lessonId === l.id && p.completed
      )
    )
  ).length;

  const totalLessonsCompleted = mockUserProgress.filter(
    (p) => p.completed
  ).length;
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

  const averageScore =
    mockUserProgress.length > 0
      ? Math.round(
          mockUserProgress.reduce((acc, p) => acc + p.score, 0) /
            mockUserProgress.length
        )
      : 0;

  // Find modules that are in progress or not started
  const recommendedModules = modules.filter((m) => {
    const moduleProgress = mockUserProgress.filter((p) => p.moduleId === m.id);
    const completedLessons = moduleProgress.filter((p) => p.completed).length;
    return completedLessons < m.lessons.length;
  });

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main id="main-content" className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, Jane
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Continue your security awareness training and protect your
                  organization.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 border border-primary/20">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Training Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-6 lg:mb-8 grid gap-3 grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <StatCard
              title="Modules Completed"
              value={`${completedModules}/${modules.length}`}
              subtitle="Keep going!"
              icon={BookOpen}
              trend={{ value: 20, isPositive: true }}
            />
            <StatCard
              title="Lessons Completed"
              value={`${totalLessonsCompleted}/${totalLessons}`}
              subtitle="Great progress"
              icon={Target}
            />
            <StatCard
              title="Average Score"
              value={`${averageScore}%`}
              subtitle="Excellent performance"
              icon={Trophy}
              trend={{ value: 5, isPositive: true }}
            />
            <StatCard
              title="Time Invested"
              value="45m"
              subtitle="This month"
              icon={Clock}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            {/* Training Modules */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Continue Training
                </h2>
                <Link href="/modules">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {recommendedModules.slice(0, 4).map((module) => (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    progress={mockUserProgress}
                  />
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Role-Based Training */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-card-foreground">
                    Your Role: Finance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Training tailored for invoice processing, wire transfers,
                    and financial data protection.
                  </p>
                  <div className="space-y-3">
                    {roles.map((role) => {
                      const Icon = roleIconMap[role.icon] || Users;
                      const isCurrentRole = role.id === "finance";
                      return (
                        <div
                          key={role.id}
                          className={`flex items-center gap-3 rounded-lg p-3 ${
                            isCurrentRole
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-secondary/50"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              isCurrentRole
                                ? "bg-primary/20 text-primary"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                isCurrentRole
                                  ? "text-primary"
                                  : "text-card-foreground"
                              }`}
                            >
                              {role.name}
                            </p>
                          </div>
                          {isCurrentRole && (
                            <Badge
                              variant="outline"
                              className="border-primary/30 text-primary text-xs"
                            >
                              Your Role
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-card-foreground">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUserProgress.slice(0, 3).map((progress, index) => {
                      const module = modules.find(
                        (m) => m.id === progress.moduleId
                      );
                      const lesson = module?.lessons.find(
                        (l) => l.id === progress.lessonId
                      );
                      if (!module || !lesson) return null;

                      return (
                        <div
                          key={`${progress.moduleId}-${progress.lessonId}`}
                          className="flex items-start gap-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {progress.score}%
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {module.title} • {progress.completedAt}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        Security Tip of the Day
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Always verify wire transfer requests by calling the
                        requester directly using a known phone number, not the
                        one provided in the email.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
