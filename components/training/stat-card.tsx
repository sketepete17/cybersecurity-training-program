"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn(
      "border-border bg-card group transition-all duration-300 ease-out",
      "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-bold text-card-foreground">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs lg:text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
            {trend && (
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
                    trend.isPositive 
                      ? "bg-primary/10 text-primary" 
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}%
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
            <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
