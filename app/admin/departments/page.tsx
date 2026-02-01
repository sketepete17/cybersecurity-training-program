"use client";

import { useState } from "react";
import { Sidebar } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/toast";
import { useDepartments, type Department } from "@/lib/departments-store";
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
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DepartmentsPage() {
  const { addToast } = useToast();
  const { departments, addDepartment, deleteDepartment } = useDepartments();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");

  const handleAddDepartment = () => {
    if (!newDeptName.trim()) {
      addToast("Please enter a department name", "error");
      return;
    }
    addDepartment(newDeptName, newDeptHead);
    addToast(`Department "${newDeptName}" created successfully!`, "success");
    setShowAddModal(false);
    setNewDeptName("");
    setNewDeptHead("");
  };

  const handleEditDepartment = (dept: Department) => {
    addToast(`Editing ${dept.name} department...`, "info");
  };

  const handleAddUsers = (dept: Department) => {
    addToast(`Opening user assignment for ${dept.name}...`, "info");
  };

  const handleDeleteDepartment = (dept: Department) => {
    deleteDepartment(dept.id);
    addToast(`${dept.name} department deleted`, "success");
  };

  const handleViewDetails = (dept: Department) => {
    setSelectedDept(dept);
    addToast(`Viewing ${dept.name} details`, "info");
  };

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
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowAddModal(true)}
            >
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
                        <DropdownMenuItem 
                          className="text-foreground cursor-pointer"
                          onClick={() => handleEditDepartment(dept)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-foreground cursor-pointer"
                          onClick={() => handleAddUsers(dept)}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add Users
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive cursor-pointer"
                          onClick={() => handleDeleteDepartment(dept)}
                        >
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
                      onClick={() => handleViewDetails(dept)}
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

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Add New Department</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Department Name
                </label>
                <Input
                  placeholder="e.g., Product Development"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Department Head
                </label>
                <Input
                  placeholder="e.g., John Smith"
                  value={newDeptHead}
                  onChange={(e) => setNewDeptHead(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleAddDepartment}
                >
                  Create Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Department Details Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">{selectedDept.name} Department</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedDept(null)}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-secondary/30 p-4">
                  <p className="text-sm text-muted-foreground">Department Head</p>
                  <p className="text-lg font-semibold text-foreground">{selectedDept.head}</p>
                </div>
                <div className="rounded-lg bg-secondary/30 p-4">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-lg font-semibold text-foreground">{selectedDept.userCount}</p>
                </div>
                <div className="rounded-lg bg-secondary/30 p-4">
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-lg font-semibold text-primary">{selectedDept.avgScore}%</p>
                </div>
                <div className="rounded-lg bg-secondary/30 p-4">
                  <p className="text-sm text-muted-foreground">Certified</p>
                  <p className="text-lg font-semibold text-foreground">{selectedDept.certifications}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium text-foreground">{selectedDept.completionRate}%</span>
                </div>
                <Progress value={selectedDept.completionRate} className="h-3 bg-secondary" />
              </div>

              {selectedDept.overdue > 0 && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                  <p className="text-sm text-destructive font-medium">
                    {selectedDept.overdue} users have overdue training
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => {
                    handleAddUsers(selectedDept);
                    setSelectedDept(null);
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Users
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    handleEditDepartment(selectedDept);
                    setSelectedDept(null);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
