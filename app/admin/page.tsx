"use client";

import { Sidebar } from "@/components/training/sidebar";
import { mockMetrics } from "@/lib/training-data";
import {
  Users,
  GraduationCap,
  Target,
  AlertTriangle,
  TrendingUp,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Define colors for charts - must be actual color values, not CSS variables
const CHART_COLORS = {
  primary: "#4ade80",
  secondary: "#60a5fa",
  muted: "#6b7280",
  accent: "#f472b6",
  warning: "#fbbf24",
};

export default function AdminMetricsPage() {
  const completionRate = Math.round(
    (mockMetrics.completedTraining / mockMetrics.totalEmployees) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Security Metrics Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Organization-wide training analytics and security posture.
                </p>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                Last updated: Today
              </Badge>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Employees
                    </p>
                    <p className="mt-2 text-3xl font-bold text-card-foreground">
                      {mockMetrics.totalEmployees}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Enrolled in training
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Training Completion
                    </p>
                    <p className="mt-2 text-3xl font-bold text-card-foreground">
                      {completionRate}%
                    </p>
                    <p className="mt-1 text-sm text-primary flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% this month
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Average Score
                    </p>
                    <p className="mt-2 text-3xl font-bold text-card-foreground">
                      {mockMetrics.averageScore}%
                    </p>
                    <p className="mt-1 text-sm text-primary flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +3% improvement
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phishing Test Pass Rate
                    </p>
                    <p className="mt-2 text-3xl font-bold text-card-foreground">
                      {mockMetrics.phishingTestPassRate}%
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mockMetrics.incidentReports} incidents reported
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Training Progress Over Time */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Training Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    completed: {
                      label: "Completed",
                      color: CHART_COLORS.primary,
                    },
                    enrolled: {
                      label: "Enrolled",
                      color: CHART_COLORS.secondary,
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockMetrics.monthlyProgress}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS.primary }}
                        name="Completed"
                      />
                      <Line
                        type="monotone"
                        dataKey="enrolled"
                        stroke={CHART_COLORS.secondary}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS.secondary }}
                        name="Enrolled"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: {
                      label: "Score",
                      color: CHART_COLORS.primary,
                    },
                    completion: {
                      label: "Completion",
                      color: CHART_COLORS.secondary,
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockMetrics.departmentScores}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="department" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="score"
                        fill={CHART_COLORS.primary}
                        name="Avg. Score"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="completion"
                        fill={CHART_COLORS.secondary}
                        name="Completion %"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Threat Detection */}
            <Card className="border-border bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Threat Detection & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMetrics.threatTypes.map((threat) => {
                    const reportRate = Math.round(
                      (threat.reported / threat.incidents) * 100
                    );
                    return (
                      <div key={threat.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-card-foreground">
                              {threat.type}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {threat.incidents} incidents
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                reportRate >= 80
                                  ? "text-primary"
                                  : reportRate >= 60
                                    ? "text-warning"
                                    : "text-destructive"
                              )}
                            >
                              {reportRate}% reported
                            </span>
                            {reportRate >= 80 ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </div>
                        <Progress value={reportRate} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        Security Insight
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Phishing detection improved by 15% after the latest
                        training module rollout. Consider additional BEC
                        training for the Operations team.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Risk Level",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Low Risk", value: 65, fill: CHART_COLORS.primary },
                          { name: "Medium Risk", value: 25, fill: CHART_COLORS.warning },
                          { name: "High Risk", value: 10, fill: "#ef4444" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {[
                          { name: "Low Risk", value: 65, fill: CHART_COLORS.primary },
                          { name: "Medium Risk", value: 25, fill: CHART_COLORS.warning },
                          { name: "High Risk", value: 10, fill: "#ef4444" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.primary }}
                      />
                      <span className="text-muted-foreground">Low Risk</span>
                    </div>
                    <span className="font-medium text-card-foreground">65%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.warning }}
                      />
                      <span className="text-muted-foreground">Medium Risk</span>
                    </div>
                    <span className="font-medium text-card-foreground">25%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: "#ef4444" }}
                      />
                      <span className="text-muted-foreground">High Risk</span>
                    </div>
                    <span className="font-medium text-card-foreground">10%</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Overall security posture has improved compared to last
                    quarter. Continue focus on high-risk departments.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
