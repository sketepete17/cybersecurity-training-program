"use client";

import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { modules, mockUserProgress } from "@/lib/training-data";
import {
  Trophy,
  Target,
  Clock,
  Award,
  TrendingUp,
  CheckCircle2,
  Circle,
  ChevronRight,
  Calendar,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  // Calculate overall statistics
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = mockUserProgress.filter((p) => p.completed).length;
  const overallProgress = Math.round((completedLessons / totalLessons) * 100);

  const averageScore =
    mockUserProgress.length > 0
      ? Math.round(
          mockUserProgress.reduce((acc, p) => acc + p.score, 0) /
            mockUserProgress.length
        )
      : 0;

  const completedModules = modules.filter((m) =>
    m.lessons.every((l) =>
      mockUserProgress.some(
        (p) => p.moduleId === m.id && p.lessonId === l.id && p.completed
      )
    )
  ).length;

  // Get module progress details
  const moduleProgress = modules.map((module) => {
    const lessonProgress = module.lessons.map((lesson) => {
      const progress = mockUserProgress.find(
        (p) => p.moduleId === module.id && p.lessonId === lesson.id
      );
      return {
        ...lesson,
        completed: progress?.completed || false,
        score: progress?.score || 0,
        completedAt: progress?.completedAt,
      };
    });

    const completedCount = lessonProgress.filter((l) => l.completed).length;
    const avgScore =
      completedCount > 0
        ? Math.round(
            lessonProgress
              .filter((l) => l.completed)
              .reduce((acc, l) => acc + l.score, 0) / completedCount
          )
        : 0;

    return {
      ...module,
      lessons: lessonProgress,
      completedLessons: completedCount,
      totalLessons: module.lessons.length,
      percentage: Math.round((completedCount / module.lessons.length) * 100),
      averageScore: avgScore,
      status:
        completedCount === 0
          ? "not-started"
          : completedCount === module.lessons.length
            ? "completed"
            : "in-progress",
    };
  });

  // Achievements
  const achievements = [
    {
      id: "first-module",
      title: "First Steps",
      description: "Complete your first training module",
      icon: Star,
      earned: completedModules >= 1,
    },
    {
      id: "perfect-score",
      title: "Perfect Score",
      description: "Score 100% on any quiz",
      icon: Target,
      earned: mockUserProgress.some((p) => p.score === 100),
    },
    {
      id: "streak",
      title: "Consistent Learner",
      description: "Complete lessons 3 days in a row",
      icon: TrendingUp,
      earned: true,
    },
    {
      id: "phishing-pro",
      title: "Phishing Pro",
      description: "Complete the Phishing module",
      icon: Award,
      earned: moduleProgress.find((m) => m.id === "phishing")?.status === "completed",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main id="main-content" className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Progress</h1>
            <p className="mt-2 text-muted-foreground">
              Track your training progress and achievements.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Overall Progress
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {overallProgress}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Average Score
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {averageScore}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Modules Completed
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {completedModules}/{modules.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Lessons Completed
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {completedLessons}/{totalLessons}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Module Progress */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">
                    Module Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {moduleProgress.map((module) => (
                    <div
                      key={module.id}
                      className="rounded-lg border border-border p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-card-foreground">
                              {module.title}
                            </h3>
                            <Badge
                              variant={
                                module.status === "completed"
                                  ? "default"
                                  : module.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className={cn(
                                module.status === "completed" &&
                                  "bg-primary/20 text-primary hover:bg-primary/30"
                              )}
                            >
                              {module.status === "completed"
                                ? "Completed"
                                : module.status === "in-progress"
                                  ? "In Progress"
                                  : "Not Started"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {module.completedLessons} of {module.totalLessons}{" "}
                            lessons completed
                            {module.averageScore > 0 &&
                              ` • Avg. Score: ${module.averageScore}%`}
                          </p>
                        </div>
                        <Link href={`/modules/${module.id}`}>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>

                      <Progress value={module.percentage} className="h-2 mb-3" />

                      {/* Lesson Details */}
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {lesson.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span
                                className={cn(
                                  lesson.completed
                                    ? "text-card-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                {lesson.title}
                              </span>
                            </div>
                            {lesson.completed && (
                              <div className="flex items-center gap-3 text-muted-foreground">
                                <span className="font-medium text-primary">
                                  {lesson.score}%
                                </span>
                                {lesson.completedAt && (
                                  <span className="flex items-center gap-1 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    {lesson.completedAt}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Achievements & Activity */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg p-3",
                        achievement.earned
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-secondary/50 opacity-60"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full",
                          achievement.earned
                            ? "bg-primary/20 text-primary"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <achievement.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium",
                            achievement.earned
                              ? "text-card-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {achievement.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUserProgress.map((progress) => {
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
                          className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                              progress.score >= 80
                                ? "bg-primary/20 text-primary"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {progress.score}%
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-card-foreground truncate">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {module.title}
                            </p>
                            {progress.completedAt && (
                              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {progress.completedAt}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        Keep Going!
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        You're making great progress. Complete 2 more modules to
                        earn your Security Champion badge!
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
