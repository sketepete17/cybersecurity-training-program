"use client";

import { useState } from "react";
import { Sidebar } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreHorizontal,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "pending";
  progress: number;
  lastActivity: string;
  score: number;
  modulesCompleted: number;
  totalModules: number;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@company.com",
    department: "Finance",
    role: "Financial Analyst",
    status: "active",
    progress: 75,
    lastActivity: "2 hours ago",
    score: 92,
    modulesCompleted: 6,
    totalModules: 8,
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@company.com",
    department: "HR",
    role: "HR Manager",
    status: "active",
    progress: 100,
    lastActivity: "1 day ago",
    score: 88,
    modulesCompleted: 8,
    totalModules: 8,
  },
  {
    id: "3",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    department: "Finance",
    role: "Senior Accountant",
    status: "active",
    progress: 88,
    lastActivity: "3 hours ago",
    score: 98,
    modulesCompleted: 7,
    totalModules: 8,
  },
  {
    id: "4",
    name: "Michael Roberts",
    email: "michael.roberts@company.com",
    department: "Operations",
    role: "Operations Lead",
    status: "inactive",
    progress: 50,
    lastActivity: "2 weeks ago",
    score: 76,
    modulesCompleted: 4,
    totalModules: 8,
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Sales",
    role: "Sales Representative",
    status: "active",
    progress: 63,
    lastActivity: "5 hours ago",
    score: 85,
    modulesCompleted: 5,
    totalModules: 8,
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@company.com",
    department: "IT",
    role: "IT Administrator",
    status: "active",
    progress: 100,
    lastActivity: "1 hour ago",
    score: 94,
    modulesCompleted: 8,
    totalModules: 8,
  },
  {
    id: "7",
    name: "Amanda Lee",
    email: "amanda.lee@company.com",
    department: "Marketing",
    role: "Marketing Manager",
    status: "pending",
    progress: 0,
    lastActivity: "Never",
    score: 0,
    modulesCompleted: 0,
    totalModules: 8,
  },
  {
    id: "8",
    name: "Robert Brown",
    email: "robert.brown@company.com",
    department: "Finance",
    role: "Financial Controller",
    status: "active",
    progress: 25,
    lastActivity: "1 week ago",
    score: 72,
    modulesCompleted: 2,
    totalModules: 8,
  },
];

const departments = ["All", "Finance", "HR", "Operations", "Sales", "IT", "Marketing"];
const statuses = ["All", "Active", "Inactive", "Pending"];

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "progress" | "score">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || emp.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === "All" ||
      emp.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "name") return a.name.localeCompare(b.name) * modifier;
    if (sortBy === "progress") return (a.progress - b.progress) * modifier;
    if (sortBy === "score") return (a.score - b.score) * modifier;
    return 0;
  });

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: "name" | "progress" | "score") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedEmployees.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedEmployees.map((e) => e.id));
    }
  };

  const handleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const getStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-warning text-warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const activeCount = mockEmployees.filter((e) => e.status === "active").length;
  const completedCount = mockEmployees.filter((e) => e.progress === 100).length;
  const overdueCount = mockEmployees.filter(
    (e) => e.progress < 50 && e.status === "active"
  ).length;

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
                  User Management
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Manage employee training assignments and track progress.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="border-border">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {mockEmployees.length}
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
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {activeCount}
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
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {completedCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Need Attention</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {overdueCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-border bg-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-input border-border"
                    />
                  </div>

                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept === "All" ? "All Departments" : dept}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "All" ? "All Statuses" : status}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedUsers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {selectedUsers.length} selected
                    </span>
                    <Button size="sm" variant="outline" className="border-border">
                      <Send className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button size="sm" variant="outline" className="border-border">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-border bg-card">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="p-4 text-left">
                        <input
                          type="checkbox"
                          checked={
                            selectedUsers.length === paginatedEmployees.length &&
                            paginatedEmployees.length > 0
                          }
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="p-4 text-left">
                        <button
                          onClick={() => handleSort("name")}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          User
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-foreground">
                        Department
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-foreground">
                        Status
                      </th>
                      <th className="p-4 text-left">
                        <button
                          onClick={() => handleSort("progress")}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Progress
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="p-4 text-left">
                        <button
                          onClick={() => handleSort("score")}
                          className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
                        >
                          Score
                          <ArrowUpDown className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-foreground">
                        Last Activity
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-b border-border hover:bg-secondary/20 transition-colors"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(employee.id)}
                            onChange={() => handleSelectUser(employee.id)}
                            className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {employee.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {employee.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm text-foreground">
                              {employee.department}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {employee.role}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(employee.status)}</td>
                        <td className="p-4">
                          <div className="w-32">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">
                                {employee.modulesCompleted}/{employee.totalModules}
                              </span>
                              <span className="font-medium text-foreground">
                                {employee.progress}%
                              </span>
                            </div>
                            <Progress value={employee.progress} className="h-1.5" />
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "font-medium",
                              employee.score >= 80
                                ? "text-primary"
                                : employee.score >= 60
                                  ? "text-warning"
                                  : "text-destructive"
                            )}
                          >
                            {employee.score > 0 ? `${employee.score}%` : "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {employee.lastActivity}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-border p-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, sortedEmployees.length)} of{" "}
                  {sortedEmployees.length} users
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-border"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        page === currentPage
                          ? "bg-primary text-primary-foreground"
                          : "border-border"
                      )}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-border"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
