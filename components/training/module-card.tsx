"use client";

import React from "react"

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Module, UserProgress } from "@/lib/training-data";
import {
  Mail,
  AlertTriangle,
  FileText,
  Lock,
  Shield,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  AlertTriangle,
  FileText,
  Lock,
  Shield,
};

interface ModuleCardProps {
  module: Module;
  progress?: UserProgress[];
  className?: string;
}

export function ModuleCard({ module, progress = [], className }: ModuleCardProps) {
  const Icon = iconMap[module.icon] || Shield;
  
  const completedLessons = module.lessons.filter((lesson) =>
    progress.some((p) => p.moduleId === module.id && p.lessonId === lesson.id && p.completed)
  ).length;
  
  const totalLessons = module.lessons.length;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isCompleted = completedLessons === totalLessons && totalLessons > 0;
  const isStarted = completedLessons > 0;

  return (
    <Link href={`/modules/${module.id}`}>
      <Card
        className={cn(
          "group relative overflow-hidden border-border bg-card transition-all duration-300 ease-out",
          "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
          "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20",
          className
        )}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <Icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            {isCompleted ? (
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            ) : isStarted ? (
              <Badge variant="secondary">In Progress</Badge>
            ) : (
              <Badge variant="outline">Not Started</Badge>
            )}
          </div>

          {/* Content */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {module.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {module.description}
            </p>
          </div>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {module.duration}
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span className="font-medium">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute bottom-6 right-6 opacity-0 transition-opacity group-hover:opacity-100">
            <ChevronRight className="h-5 w-5 text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
