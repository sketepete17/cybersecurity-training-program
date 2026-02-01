"use client";

import { useState } from "react";
import { Sidebar } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Bell,
  Send,
  Users,
  Clock,
  Plus,
  Filter,
  Search,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ChevronRight,
  Trash2,
  Edit,
  Eye,
  Copy,
  X,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Training Deadline Reminder",
    message:
      "Your SOC 2 compliance training is due in 3 days. Please complete it to maintain certification.",
    type: "reminder",
    audience: "All Users",
    sentAt: "2026-01-31 09:00",
    delivered: 456,
    opened: 389,
    status: "sent",
  },
  {
    id: 2,
    title: "New Module Available: AI Security",
    message:
      "A new training module on AI Security Best Practices has been added. Start learning today!",
    type: "announcement",
    audience: "Engineering",
    sentAt: "2026-01-30 14:30",
    delivered: 156,
    opened: 142,
    status: "sent",
  },
  {
    id: 3,
    title: "Compliance Alert: HIPAA Update",
    message:
      "Important HIPAA regulation updates require additional training. Deadline: Feb 15, 2026.",
    type: "alert",
    audience: "Healthcare Team",
    sentAt: "2026-01-29 11:00",
    delivered: 45,
    opened: 45,
    status: "sent",
  },
  {
    id: 4,
    title: "Weekly Progress Summary",
    message:
      "Your weekly training progress summary is ready. View your achievements and upcoming tasks.",
    type: "summary",
    audience: "All Users",
    scheduledFor: "2026-02-03 08:00",
    status: "scheduled",
  },
  {
    id: 5,
    title: "Certificate Expiry Warning",
    message:
      "Your Phishing Awareness certificate expires in 30 days. Complete the refresher course to renew.",
    type: "warning",
    audience: "Expiring Certificates",
    scheduledFor: "2026-02-05 09:00",
    status: "draft",
  },
];

const templates = [
  {
    id: 1,
    name: "Training Reminder",
    description: "Remind users about upcoming training deadlines",
  },
  {
    id: 2,
    name: "New Module Announcement",
    description: "Announce new training modules to users",
  },
  {
    id: 3,
    name: "Compliance Alert",
    description: "Alert users about compliance requirements",
  },
  {
    id: 4,
    name: "Achievement Celebration",
    description: "Congratulate users on completing training",
  },
];

export default function NotificationsPage() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | "scheduled" | "drafts">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "announcement",
    audience: "All Users",
  });

  const handleCreateNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    addToast(`Notification "${newNotification.title}" created and sent!`, "success");
    setShowCreateModal(false);
    setNewNotification({ title: "", message: "", type: "announcement", audience: "All Users" });
  };

  const handleCopyNotification = (notification: typeof notifications[0]) => {
    addToast(`Notification "${notification.title}" copied to draft`, "success");
  };

  const handleEditNotification = (notification: typeof notifications[0]) => {
    setNewNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      audience: notification.audience,
    });
    setShowCreateModal(true);
    addToast(`Editing "${notification.title}"`, "info");
  };

  const handleDeleteNotification = (notification: typeof notifications[0]) => {
    addToast(`Notification "${notification.title}" deleted`, "success");
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    setNewNotification({
      ...newNotification,
      title: template.name,
      message: template.description,
    });
    setShowCreateModal(true);
    addToast(`Template "${template.name}" loaded`, "info");
  };

  const handleSelectAudience = (audience: string) => {
    setNewNotification({ ...newNotification, audience });
    addToast(`Audience set to "${audience}"`, "info");
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "scheduled") return n.status === "scheduled";
    if (activeTab === "drafts") return n.status === "draft";
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return <Clock className="h-4 w-4" />;
      case "announcement":
        return <MessageSquare className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "summary":
        return <Mail className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "bg-blue-500/10 text-blue-500";
      case "announcement":
        return "bg-primary/10 text-primary";
      case "alert":
        return "bg-destructive/10 text-destructive";
      case "summary":
        return "bg-purple-500/10 text-purple-500";
      case "warning":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-secondary text-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Notifications
              </h1>
              <p className="mt-2 text-muted-foreground">
                Send and manage notifications to users across the organization.
              </p>
            </div>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Notification
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Sent This Month
                    </p>
                    <p className="text-2xl font-bold text-foreground">127</p>
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
                      Total Reach
                    </p>
                    <p className="text-2xl font-bold text-foreground">8,456</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                    <Eye className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Rate</p>
                    <p className="text-2xl font-bold text-foreground">84%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                    <Calendar className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Scheduled</p>
                    <p className="text-2xl font-bold text-foreground">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Notifications List */}
            <div className="lg:col-span-2">
              {/* Tabs & Search */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2 border-b border-border">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "all"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("scheduled")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "scheduled"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Scheduled
                  </button>
                  <button
                    onClick={() => setActiveTab("drafts")}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "drafts"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Drafts
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48 bg-input border-border text-foreground"
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className="border-border bg-card hover:border-primary/30 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeColor(notification.type)}`}
                        >
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {notification.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <Badge
                              className={`shrink-0 border-0 ${
                                notification.status === "sent"
                                  ? "bg-primary/10 text-primary"
                                  : notification.status === "scheduled"
                                    ? "bg-blue-500/10 text-blue-500"
                                    : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {notification.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {notification.audience}
                            </span>
                            {notification.sentAt && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Sent {notification.sentAt}
                              </span>
                            )}
                            {notification.scheduledFor && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Scheduled for {notification.scheduledFor}
                              </span>
                            )}
                          </div>

                          {notification.delivered && (
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2 text-xs">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                <span className="text-muted-foreground">
                                  {notification.delivered} delivered
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <Eye className="h-3 w-3 text-blue-500" />
                                <span className="text-muted-foreground">
                                  {notification.opened} opened (
                                  {Math.round(
                                    (notification.opened /
                                      notification.delivered) *
                                      100
                                  )}
                                  %)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => handleCopyNotification(notification)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => handleEditNotification(notification)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteNotification(notification)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Templates Sidebar */}
            <div>
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Quick Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleUseTemplate(template)}
                      className="w-full p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <p className="font-medium text-foreground">
                        {template.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.description}
                      </p>
                    </button>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full border-border mt-4"
                    onClick={() => addToast("Template builder coming soon!", "info")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>

              {/* Audience Groups */}
              <Card className="border-border bg-card mt-6">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Audience Groups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "All Users", count: 472 },
                    { name: "Engineering", count: 156 },
                    { name: "New Employees", count: 34 },
                    { name: "Overdue Training", count: 45 },
                    { name: "Expiring Certs", count: 23 },
                  ].map((group) => (
                    <button
                      key={group.name}
                      onClick={() => handleSelectAudience(group.name)}
                      className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-sm text-foreground">
                        {group.name}
                      </span>
                      <Badge className="bg-secondary text-muted-foreground border-0">
                        {group.count}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-foreground">Create Notification</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCreateModal(false)}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input
                  placeholder="Notification title..."
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  className="bg-input border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea
                  placeholder="Write your notification message..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="reminder">Reminder</option>
                    <option value="alert">Alert</option>
                    <option value="warning">Warning</option>
                    <option value="summary">Summary</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Audience</label>
                  <select
                    value={newNotification.audience}
                    onChange={(e) => setNewNotification({ ...newNotification, audience: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Sales">Sales</option>
                    <option value="New Employees">New Employees</option>
                    <option value="Overdue Training">Overdue Training</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 border-border"
                  onClick={() => {
                    addToast("Notification saved as draft", "success");
                    setShowCreateModal(false);
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCreateNotification}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
