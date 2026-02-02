"use client";

import { useState } from "react";
import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Activity,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  Eye,
  BookOpen,
  LogIn,
  UserPlus,
  AlertTriangle,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Extended activity data
const allActivities = [
  { id: 1, user: "John Smith", action: "Completed Phishing module", time: "5 min ago", type: "completion", department: "Engineering" },
  { id: 2, user: "Lisa Brown", action: "Started Password Security", time: "12 min ago", type: "start", department: "Sales" },
  { id: 3, user: "Mark Johnson", action: "Failed quiz attempt", time: "25 min ago", type: "fail", department: "Operations" },
  { id: 4, user: "Sarah Chen", action: "Earned certificate", time: "1 hour ago", type: "certificate", department: "Finance" },
  { id: 5, user: "Tom Wilson", action: "Completed Data Protection", time: "2 hours ago", type: "completion", department: "HR" },
  { id: 6, user: "Emily Davis", action: "Logged in", time: "2 hours ago", type: "login", department: "Marketing" },
  { id: 7, user: "James Brown", action: "Started Incident Response", time: "3 hours ago", type: "start", department: "Operations" },
  { id: 8, user: "Amanda Lee", action: "Completed quiz with 95%", time: "3 hours ago", type: "completion", department: "Finance" },
  { id: 9, user: "Robert Wilson", action: "Earned certificate", time: "4 hours ago", type: "certificate", department: "Legal" },
  { id: 10, user: "Jennifer Martinez", action: "Failed quiz - 2nd attempt", time: "4 hours ago", type: "fail", department: "Customer Support" },
  { id: 11, user: "Michael Chen", action: "Completed Access Control", time: "5 hours ago", type: "completion", department: "Engineering" },
  { id: 12, user: "Laura Taylor", action: "Started Social Engineering", time: "5 hours ago", type: "start", department: "Sales" },
  { id: 13, user: "David Thompson", action: "Logged in", time: "6 hours ago", type: "login", department: "Legal" },
  { id: 14, user: "Rachel Green", action: "Completed Network Security", time: "6 hours ago", type: "completion", department: "Engineering" },
  { id: 15, user: "Chris Evans", action: "Earned certificate", time: "7 hours ago", type: "certificate", department: "Marketing" },
  { id: 16, user: "Jessica White", action: "Started Phishing module", time: "8 hours ago", type: "start", department: "HR" },
  { id: 17, user: "Daniel Harris", action: "Failed quiz attempt", time: "8 hours ago", type: "fail", department: "Operations" },
  { id: 18, user: "Sophia Clark", action: "Completed Malware Prevention", time: "9 hours ago", type: "completion", department: "Finance" },
  { id: 19, user: "Matthew Lewis", action: "Logged in", time: "10 hours ago", type: "login", department: "Sales" },
  { id: 20, user: "Olivia Walker", action: "Started Data Protection", time: "11 hours ago", type: "start", department: "Customer Support" },
  { id: 21, user: "Andrew King", action: "Completed quiz with 88%", time: "12 hours ago", type: "completion", department: "Engineering" },
  { id: 22, user: "Emma Scott", action: "Earned certificate", time: "1 day ago", type: "certificate", department: "Marketing" },
  { id: 23, user: "Ryan Adams", action: "Started Incident Response", time: "1 day ago", type: "start", department: "Operations" },
  { id: 24, user: "Hannah Nelson", action: "Completed Password Security", time: "1 day ago", type: "completion", department: "HR" },
  { id: 25, user: "Joshua Hill", action: "Failed quiz - final attempt", time: "1 day ago", type: "fail", department: "Sales" },
];

const activityTypes = [
  { value: "all", label: "All Activity" },
  { value: "completion", label: "Completions" },
  { value: "start", label: "Started Training" },
  { value: "certificate", label: "Certificates" },
  { value: "fail", label: "Failed Attempts" },
  { value: "login", label: "Logins" },
];

export default function ActivityPage() {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "completion":
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      case "start":
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "certificate":
        return <Award className="h-4 w-4 text-yellow-500" />;
      case "login":
        return <LogIn className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "completion":
        return <Badge className="bg-primary/10 text-primary border-0">Completed</Badge>;
      case "start":
        return <Badge className="bg-blue-500/10 text-blue-500 border-0">Started</Badge>;
      case "fail":
        return <Badge className="bg-destructive/10 text-destructive border-0">Failed</Badge>;
      case "certificate":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-0">Certificate</Badge>;
      case "login":
        return <Badge className="bg-secondary text-muted-foreground border-0">Login</Badge>;
      default:
        return <Badge className="bg-secondary text-muted-foreground border-0">Activity</Badge>;
    }
  };

  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || activity.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExport = async () => {
    addToast("Exporting activity log...", "info");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const exportData = filteredActivities
      .map((a) => `${a.time} | ${a.user} | ${a.department} | ${a.action}`)
      .join("\n");

    const blob = new Blob([`Activity Log Export\n${"=".repeat(50)}\n\n${exportData}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity_log_${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast("Activity log exported!", "success");
  };

  const handleRefresh = () => {
    addToast("Refreshing activity feed...", "info");
    setTimeout(() => {
      addToast("Activity feed updated!", "success");
    }, 1000);
  };

  // Calculate stats
  const todayCompletions = allActivities.filter((a) => a.type === "completion").length;
  const todayCertificates = allActivities.filter((a) => a.type === "certificate").length;
  const todayFailures = allActivities.filter((a) => a.type === "fail").length;

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
              <p className="mt-2 text-muted-foreground">
                Monitor all training activity across your organization in real-time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-border" onClick={handleRefresh}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="border-border" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Activities</p>
                    <p className="text-2xl font-bold text-foreground">{allActivities.length}</p>
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
                    <p className="text-sm text-muted-foreground">Completions</p>
                    <p className="text-2xl font-bold text-foreground">{todayCompletions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Award className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="text-2xl font-bold text-foreground">{todayCertificates}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Failed Attempts</p>
                    <p className="text-2xl font-bold text-foreground">{todayFailures}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-border bg-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user, action, or department..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 bg-input border-border text-foreground"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-muted-foreground ml-auto">
                  Showing {paginatedActivities.length} of {filteredActivities.length} activities
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Activity List */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paginatedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{activity.user}</span>
                        {getActivityBadge(activity.type)}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      <p className="text-xs text-muted-foreground">{activity.department}</p>
                    </div>
                  </div>
                ))}

                {paginatedActivities.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No activities found matching your filters.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="border-border"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="border-border"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
