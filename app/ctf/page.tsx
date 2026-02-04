"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCTF, challenges, categoryColors, difficultyColors, type Category, type Difficulty } from "@/lib/ctf-store";
import {
  Flag,
  Key,
  Globe,
  Search,
  Network,
  Code,
  Puzzle,
  CheckCircle2,
  Trophy,
  Zap,
  Star,
  Target,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<Category, React.ElementType> = {
  crypto: Key,
  web: Globe,
  forensics: Search,
  network: Network,
  reverse: Code,
  misc: Puzzle,
};

export default function CTFPage() {
  const { solvedChallenges, totalPoints, resetProgress } = useCTF();
  const [filter, setFilter] = useState<Category | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all");

  const maxPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const progress = (solvedChallenges.length / challenges.length) * 100;

  const filteredChallenges = challenges.filter(c => {
    if (filter !== "all" && c.category !== filter) return false;
    if (difficultyFilter !== "all" && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  const categoryCounts = challenges.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

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
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Flag className="h-5 w-5 text-primary-foreground" />
                  </div>
                  CTF Practice Arena
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Test your cybersecurity skills with hands-on capture the flag challenges
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetProgress}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Progress
                </Button>
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 border border-primary/20">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold text-primary">{totalPoints}</span>
                  <span className="text-sm text-muted-foreground">/ {maxPoints} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <Card className="border-border bg-card hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Flag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{solvedChallenges.length}</p>
                    <p className="text-xs text-muted-foreground">Solved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card hover:border-yellow-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card hover:border-blue-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Target className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{challenges.length - solvedChallenges.length}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card hover:border-green-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <Star className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{Math.round(progress)}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="border-border mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{solvedChallenges.length} / {challenges.length} challenges</span>
              </div>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({challenges.length})
            </Button>
            {(Object.keys(categoryIcons) as Category[]).map(cat => {
              const Icon = categoryIcons[cat];
              const count = categoryCounts[cat] || 0;
              return (
                <Button
                  key={cat}
                  variant={filter === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(cat)}
                  className="capitalize"
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  {cat} ({count})
                </Button>
              );
            })}
          </div>

          {/* Difficulty Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              variant={difficultyFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDifficultyFilter("all")}
            >
              All Levels
            </Button>
            {(["beginner", "intermediate", "advanced", "expert"] as Difficulty[]).map(diff => (
              <Button
                key={diff}
                variant={difficultyFilter === diff ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setDifficultyFilter(diff)}
                className="capitalize"
              >
                {diff}
              </Button>
            ))}
          </div>

          {/* Challenge Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            {filteredChallenges.map(challenge => {
              const Icon = categoryIcons[challenge.category];
              const isSolved = solvedChallenges.includes(challenge.id);
              
              return (
                <Link key={challenge.id} href={`/ctf/${challenge.id}`}>
                  <Card
                    className={cn(
                      "border-border cursor-pointer transition-all duration-300 h-full",
                      "hover:-translate-y-1 hover:shadow-lg hover:border-primary/30",
                      isSolved && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl border",
                          categoryColors[challenge.category]
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
                            {challenge.difficulty}
                          </Badge>
                          {isSolved && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {challenge.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold">{challenge.points} pts</span>
                          <span className="text-muted-foreground text-sm">|</span>
                          <span className="text-muted-foreground text-sm">{challenge.solves} solves</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No challenges found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
