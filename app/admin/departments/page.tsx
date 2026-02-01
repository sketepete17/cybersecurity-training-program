"use client";

import { useState } from "react";
import { Sidebar } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Search,
  Plus,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Shield,
  Award,
  Clock,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const departments = [
  {
    id: 1,
    name: "Engineering",
    head: "Michael Chen",
    userCount: 156,
    completionRate: 87,
    avgScore: 92,
    trend: "up",
    overdue: 12,
    certifications: 134,
  },
  {
    id: 2,
    name: "Sales",
    head: "Sarah Johnson",
    userCount: 89,
    completionRate: 78,
    avgScore: 85,
    trend: "up",
    overdue: 8,
    certifications: 71,
  },
  {
    id: 3,
    name: "Marketing",
    head: "Emily Davis",
    userCount: 45,
    completionRate: 92,
    avgScore: 94,
    trend: "up",
    overdue: 2,
    certifications: 43,
  },
  {
    id: 4,
    name: "Finance",
    head: "Robert Wilson",
    userCount: 32,
    completionRate: 95,
    avgScore: 96,
    trend: "up",
    overdue: 1,
    certifications: 31,
  },
  {
    id: 5,
    name: "Human Resources",
    head: "Lisa Anderson",
    userCount: 18,
    completionRate: 100,
    avgScore: 98,
    trend: "stable",
    overdue: 0,
    certifications: 18,
  },
  {
    id: 6,
    name: "Operations",
    head: "James Brown",
    userCount: 67,
    completionRate: 72,
    avgScore: 81,
    trend: "down",
    overdue: 15,
    certifications: 52,
  },
  {
    id: 7,
    name: "Customer Support",
    head: "Amanda Martinez",
    userCount: 53,
    completionRate: 83,
    avgScore: 88,
    trend: "up",
    overdue: 6,
    certifications: 45,
  },
  {
    id: 8,
    name: "Legal",
    head: "David Thompson",
    userCount: 12,
    completionRate: 100,
    avgScore: 97,
    trend: "stable",
    overdue: 0,
    certifications: 12,
  },
];

export default function DepartmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = departments.reduce((sum, d) => sum + d.userCount, 0);
  const avgCompletion = Math.round(
    departments.reduce((sum, d) => sum + d.completionRate, 0) /
      departments.length
  );
  const totalOverdue = departments.reduce((sum, d) => sum + d.overdue, 0);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Departments
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage departments and view training progress by team.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Departments
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {departments.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Employees
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalUsers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg. Completion
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {avgCompletion}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <Clock className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Overdue Training
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {totalOverdue}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
          </div>

          {/* Departments Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredDepartments.map((dept) => (
              <Card
                key={dept.id}
                className="border-border bg-card hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {dept.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Lead: {dept.head}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="text-foreground">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Users
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 rounded-lg bg-secondary/30">
                      <p className="text-lg font-semibold text-foreground">
                        {dept.userCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Users</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/30">
                      <p className="text-lg font-semibold text-foreground">
                        {dept.avgScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary/30">
                      <p className="text-lg font-semibold text-foreground">
                        {dept.certifications}
                      </p>
                      <p className="text-xs text-muted-foreground">Certified</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Completion Rate
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {dept.completionRate}%
                        </span>
                        {dept.trend === "up" && (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        )}
                        {dept.trend === "down" && (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>
                    <Progress
                      value={dept.completionRate}
                      className="h-2 bg-secondary"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    {dept.overdue > 0 ? (
                      <Badge className="bg-destructive/10 text-destructive border-0">
                        {dept.overdue} overdue
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/10 text-primary border-0">
                        All on track
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary/80"
                    >
                      View Details
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
