"use client";

import { useState } from "react";
import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { ModuleCard } from "@/components/training/module-card";
import { modules, mockUserProgress } from "@/lib/training-data";
import { Search, Filter, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Core Security",
  "Financial Security",
  "Data Protection",
  "Access Security",
  "Response",
];

export default function ModulesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getModuleStats = () => {
    const completed = modules.filter((m) =>
      m.lessons.every((l) =>
        mockUserProgress.some(
          (p) => p.moduleId === m.id && p.lessonId === l.id && p.completed
        )
      )
    ).length;

    const inProgress = modules.filter((m) => {
      const moduleProgress = mockUserProgress.filter(
        (p) => p.moduleId === m.id
      );
      const completedLessons = moduleProgress.filter((p) => p.completed).length;
      return completedLessons > 0 && completedLessons < m.lessons.length;
    }).length;

    return { completed, inProgress, total: modules.length };
  };

  const stats = getModuleStats();

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Training Modules
            </h1>
            <p className="mt-2 text-muted-foreground">
              Complete interactive training modules to improve your security
              awareness.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-3 lg:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total:</span>
              <Badge variant="secondary">{stats.total} modules</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Completed:</span>
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                {stats.completed}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">In Progress:</span>
              <Badge variant="outline">{stats.inProgress}</Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48 bg-secondary border-border">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === "grid" && "bg-background"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-8 w-8 p-0",
                  viewMode === "list" && "bg-background"
                )}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Modules Grid */}
          {filteredModules.length > 0 ? (
            <div
              className={cn(
                "grid gap-3 lg:gap-4",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {filteredModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  progress={mockUserProgress}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No modules found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
