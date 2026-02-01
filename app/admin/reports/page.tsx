"use client";

import { useState } from "react";
import { Sidebar } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  Clock,
  Users,
  Shield,
  TrendingUp,
  BarChart3,
  PieChart,
  Filter,
  ChevronRight,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  Send,
  CheckCircle2,
} from "lucide-react";

const savedReports = [
  {
    id: 1,
    name: "Monthly Compliance Summary",
    type: "Compliance",
    lastRun: "2026-01-28",
    schedule: "Monthly",
    format: "PDF",
    status: "completed",
  },
  {
    id: 2,
    name: "Training Progress by Department",
    type: "Progress",
    lastRun: "2026-01-30",
    schedule: "Weekly",
    format: "Excel",
    status: "completed",
  },
  {
    id: 3,
    name: "User Activity Report",
    type: "Activity",
    lastRun: "2026-01-31",
    schedule: "Daily",
    format: "CSV",
    status: "running",
  },
  {
    id: 4,
    name: "Risk Assessment Overview",
    type: "Security",
    lastRun: "2026-01-15",
    schedule: "Quarterly",
    format: "PDF",
    status: "completed",
  },
  {
    id: 5,
    name: "Certification Expiry Report",
    type: "Compliance",
    lastRun: "2026-01-29",
    schedule: "Weekly",
    format: "Excel",
    status: "scheduled",
  },
];

const reportTemplates = [
  {
    id: 1,
    name: "Executive Summary",
    description: "High-level overview of training metrics and compliance status",
    icon: TrendingUp,
    color: "primary",
  },
  {
    id: 2,
    name: "Department Analysis",
    description: "Detailed breakdown of training progress by department",
    icon: BarChart3,
    color: "blue",
  },
  {
    id: 3,
    name: "Compliance Audit",
    description: "Full compliance report for regulatory requirements",
    icon: Shield,
    color: "green",
  },
  {
    id: 4,
    name: "User Engagement",
    description: "Analysis of user activity and engagement patterns",
    icon: Users,
    color: "purple",
  },
  {
    id: 5,
    name: "Risk Assessment",
    description: "Security posture and vulnerability training gaps",
    icon: PieChart,
    color: "orange",
  },
];

const recentExports = [
  {
    name: "training_report_jan2026.pdf",
    size: "2.4 MB",
    date: "2026-01-31",
  },
  {
    name: "user_progress_export.xlsx",
    size: "1.8 MB",
    date: "2026-01-30",
  },
  {
    name: "compliance_summary.pdf",
    size: "856 KB",
    date: "2026-01-28",
  },
  {
    name: "department_metrics.csv",
    size: "342 KB",
    date: "2026-01-27",
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"saved" | "templates" | "exports">(
    "saved"
  );

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="mt-2 text-muted-foreground">
                Generate, schedule, and export training reports.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-border">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Reports
                    </p>
                    <p className="text-2xl font-bold text-foreground">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold text-foreground">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Generated This Month
                    </p>
                    <p className="text-2xl font-bold text-foreground">47</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                    <Download className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Downloads
                    </p>
                    <p className="text-2xl font-bold text-foreground">156</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "saved"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Saved Reports
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "templates"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab("exports")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "exports"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Recent Exports
            </button>
          </div>

          {/* Content */}
          {activeTab === "saved" && (
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Report Name
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Type
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Last Run
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Schedule
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedReports.map((report) => (
                        <tr
                          key={report.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-foreground">
                                  {report.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {report.format}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-secondary text-foreground border-0">
                              {report.type}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(report.lastRun).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {report.schedule}
                          </td>
                          <td className="p-4">
                            <Badge
                              className={`border-0 ${
                                report.status === "completed"
                                  ? "bg-primary/10 text-primary"
                                  : report.status === "running"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {report.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "templates" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reportTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="border-border bg-card hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg mb-4 ${
                        template.color === "primary"
                          ? "bg-primary/10"
                          : template.color === "blue"
                            ? "bg-blue-500/10"
                            : template.color === "green"
                              ? "bg-green-500/10"
                              : template.color === "purple"
                                ? "bg-purple-500/10"
                                : "bg-orange-500/10"
                      }`}
                    >
                      <template.icon
                        className={`h-6 w-6 ${
                          template.color === "primary"
                            ? "text-primary"
                            : template.color === "blue"
                              ? "text-blue-500"
                              : template.color === "green"
                                ? "text-green-500"
                                : template.color === "purple"
                                  ? "text-purple-500"
                                  : "text-orange-500"
                        }`}
                      />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border"
                    >
                      Use Template
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Create Custom Report */}
              <Card className="border-border bg-card border-dashed hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary mb-4">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Create Custom Report
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Build a report from scratch with custom metrics
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "exports" && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">
                  Recent Exports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentExports.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} •{" "}
                            {new Date(file.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
