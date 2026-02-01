"use client";

import { useState } from "react";
import { Sidebar } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Bell,
  Shield,
  Mail,
  Clock,
  Users,
  FileText,
  Database,
  Key,
  Globe,
  Check,
  ChevronRight,
  AlertTriangle,
  Server,
  Zap,
  Lock,
  RefreshCw,
} from "lucide-react";

const settingsSections = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "compliance", label: "Compliance", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Zap },
  { id: "security", label: "Security", icon: Lock },
  { id: "backup", label: "Backup & Data", icon: Database },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("organization");
  const [isSaving, setIsSaving] = useState(false);

  const [orgSettings, setOrgSettings] = useState({
    companyName: "Acme Corporation",
    industry: "Technology",
    employeeCount: "500-1000",
    complianceFramework: "SOC 2",
    trainingFrequency: "quarterly",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    trainingReminders: true,
    complianceAlerts: true,
    weeklyReports: true,
    monthlyDigest: false,
    securityIncidents: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "organization":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Organization Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your organization&apos;s profile and training
                preferences.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Company Name
                </label>
                <Input
                  value={orgSettings.companyName}
                  onChange={(e) =>
                    setOrgSettings({
                      ...orgSettings,
                      companyName: e.target.value,
                    })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Industry
                </label>
                <select
                  value={orgSettings.industry}
                  onChange={(e) =>
                    setOrgSettings({ ...orgSettings, industry: e.target.value })
                  }
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Technology</option>
                  <option>Healthcare</option>
                  <option>Finance</option>
                  <option>Education</option>
                  <option>Government</option>
                  <option>Retail</option>
                  <option>Manufacturing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Employee Count
                </label>
                <select
                  value={orgSettings.employeeCount}
                  onChange={(e) =>
                    setOrgSettings({
                      ...orgSettings,
                      employeeCount: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>1-50</option>
                  <option>51-200</option>
                  <option>201-500</option>
                  <option>500-1000</option>
                  <option>1000-5000</option>
                  <option>5000+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Training Frequency
                </label>
                <select
                  value={orgSettings.trainingFrequency}
                  onChange={(e) =>
                    setOrgSettings({
                      ...orgSettings,
                      trainingFrequency: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="biannually">Bi-annually</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                Department Structure
              </h4>
              <div className="space-y-3">
                {[
                  { name: "Engineering", users: 156 },
                  { name: "Sales", users: 89 },
                  { name: "Marketing", users: 45 },
                  { name: "Finance", users: 32 },
                  { name: "HR", users: 18 },
                  { name: "Operations", users: 67 },
                ].map((dept) => (
                  <div
                    key={dept.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {dept.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground">
                        {dept.users} users
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-4 border-border">
                + Add Department
              </Button>
            </div>
          </div>
        );

      case "compliance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Compliance Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage compliance frameworks and training requirements.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                Active Compliance Frameworks
              </h4>
              {[
                {
                  name: "SOC 2 Type II",
                  status: "active",
                  modules: 12,
                  deadline: "2026-03-15",
                },
                {
                  name: "HIPAA",
                  status: "active",
                  modules: 8,
                  deadline: "2026-04-01",
                },
                {
                  name: "GDPR",
                  status: "pending",
                  modules: 6,
                  deadline: "2026-05-20",
                },
                {
                  name: "PCI DSS",
                  status: "inactive",
                  modules: 10,
                  deadline: null,
                },
              ].map((framework) => (
                <Card
                  key={framework.name}
                  className="border-border bg-secondary/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {framework.name}
                            </p>
                            <Badge
                              className={`text-xs border-0 ${
                                framework.status === "active"
                                  ? "bg-primary/10 text-primary"
                                  : framework.status === "pending"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {framework.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {framework.modules} required modules
                            {framework.deadline &&
                              ` • Due ${new Date(framework.deadline).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border"
                      >
                        Configure
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                Compliance Deadlines
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoReminders"
                    defaultChecked
                    className="h-4 w-4 rounded border-border bg-input text-primary"
                  />
                  <label
                    htmlFor="autoReminders"
                    className="text-sm text-foreground"
                  >
                    Send automatic reminders before deadlines
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="escalation"
                    defaultChecked
                    className="h-4 w-4 rounded border-border bg-input text-primary"
                  />
                  <label
                    htmlFor="escalation"
                    className="text-sm text-foreground"
                  >
                    Escalate to managers for overdue training
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="blockAccess"
                    className="h-4 w-4 rounded border-border bg-input text-primary"
                  />
                  <label
                    htmlFor="blockAccess"
                    className="text-sm text-foreground"
                  >
                    Block system access for non-compliant users
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Notification Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure system-wide notification preferences.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                Admin Notifications
              </h4>
              <div className="space-y-3">
                <NotificationToggle
                  label="Training Completion Alerts"
                  description="Get notified when users complete training modules"
                  checked={notificationSettings.trainingReminders}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      trainingReminders: !notificationSettings.trainingReminders,
                    })
                  }
                />
                <NotificationToggle
                  label="Compliance Status Alerts"
                  description="Receive alerts about compliance deadlines and violations"
                  checked={notificationSettings.complianceAlerts}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      complianceAlerts: !notificationSettings.complianceAlerts,
                    })
                  }
                />
                <NotificationToggle
                  label="Weekly Summary Reports"
                  description="Receive weekly training progress summaries"
                  checked={notificationSettings.weeklyReports}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      weeklyReports: !notificationSettings.weeklyReports,
                    })
                  }
                />
                <NotificationToggle
                  label="Monthly Analytics Digest"
                  description="Comprehensive monthly analytics report"
                  checked={notificationSettings.monthlyDigest}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      monthlyDigest: !notificationSettings.monthlyDigest,
                    })
                  }
                />
                <NotificationToggle
                  label="Security Incident Alerts"
                  description="Immediate alerts for security-related incidents"
                  checked={notificationSettings.securityIncidents}
                  onChange={() =>
                    setNotificationSettings({
                      ...notificationSettings,
                      securityIncidents:
                        !notificationSettings.securityIncidents,
                    })
                  }
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                User Notification Defaults
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Set default notification preferences for all users.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Reminder Frequency
                  </label>
                  <select className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Bi-weekly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Days Before Deadline
                  </label>
                  <select className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground">
                    <option>3 days</option>
                    <option>7 days</option>
                    <option>14 days</option>
                    <option>30 days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Integrations
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Connect CyberShield with your existing tools and services.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: "Microsoft 365",
                  description: "Sync users and send notifications via Teams",
                  connected: true,
                  icon: "M365",
                },
                {
                  name: "Okta SSO",
                  description: "Single sign-on authentication",
                  connected: true,
                  icon: "SSO",
                },
                {
                  name: "Slack",
                  description: "Training notifications and reminders",
                  connected: false,
                  icon: "SLK",
                },
                {
                  name: "ServiceNow",
                  description: "Incident management integration",
                  connected: false,
                  icon: "SNW",
                },
                {
                  name: "Workday",
                  description: "HR system user synchronization",
                  connected: false,
                  icon: "WD",
                },
              ].map((integration) => (
                <Card
                  key={integration.name}
                  className="border-border bg-secondary/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-foreground">
                          {integration.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">
                              {integration.name}
                            </p>
                            {integration.connected && (
                              <Badge className="bg-primary/10 text-primary border-0 text-xs">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {integration.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={integration.connected ? "outline" : "default"}
                        size="sm"
                        className={
                          integration.connected
                            ? "border-border"
                            : "bg-primary text-primary-foreground"
                        }
                      >
                        {integration.connected ? "Configure" : "Connect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                API Access
              </h4>
              <Card className="border-border bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">API Key</p>
                        <p className="text-sm text-muted-foreground">
                          Use for custom integrations
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-border">
                      Regenerate
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-secondary px-3 py-2 text-sm text-muted-foreground font-mono">
                      cs_live_••••••••••••••••••••••••
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border"
                    >
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Security Settings
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure security policies and authentication settings.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                Authentication
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">
                        Require Two-Factor Authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Enforce 2FA for all users
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Session Timeout
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Auto logout after inactivity
                      </p>
                    </div>
                  </div>
                  <select className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>1 hour</option>
                    <option>4 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        Password Policy
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Minimum 12 characters, special chars required
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-border">
                    Configure
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                IP Allowlist
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Restrict access to specific IP addresses or ranges.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter IP address or CIDR range"
                    className="bg-input border-border text-foreground"
                  />
                  <Button variant="outline" className="border-border">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "backup":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Backup & Data Management
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage data exports, backups, and retention policies.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">
                Automatic Backups
              </h4>
              <Card className="border-border bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">
                          Daily Backup
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last backup: Today at 3:00 AM
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-0">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-border">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Backup Now
                    </Button>
                    <Button variant="outline" size="sm" className="border-border">
                      View History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                Data Export
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-border bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium text-foreground">
                        Training Reports
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export all training completion data
                    </p>
                    <Button variant="outline" size="sm" className="border-border">
                      Export CSV
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-border bg-secondary/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium text-foreground">User Data</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Export user profiles and progress
                    </p>
                    <Button variant="outline" size="sm" className="border-border">
                      Export CSV
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-4">
                Data Retention
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">
                      Training Records
                    </p>
                    <p className="text-sm text-muted-foreground">
                      How long to keep completed training records
                    </p>
                  </div>
                  <select className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground">
                    <option>1 year</option>
                    <option>2 years</option>
                    <option>5 years</option>
                    <option>7 years</option>
                    <option>Indefinitely</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Audit Logs</p>
                    <p className="text-sm text-muted-foreground">
                      System activity and access logs
                    </p>
                  </div>
                  <select className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground">
                    <option>90 days</option>
                    <option>1 year</option>
                    <option>2 years</option>
                    <option>5 years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Danger Zone</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Permanently delete all organization data. This action
                      cannot be undone.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <div className="px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Admin Settings
            </h1>
            <p className="mt-2 text-muted-foreground">
              Configure organization-wide settings and policies.
            </p>
          </div>

          <div className="flex gap-8">
            {/* Settings Navigation */}
            <Card className="h-fit w-64 shrink-0 border-border bg-card">
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {settingsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <section.icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>

            {/* Settings Content */}
            <Card className="flex-1 border-border bg-card">
              <CardContent className="p-6">
                {renderContent()}

                {/* Save Button */}
                <div className="mt-8 flex justify-end border-t border-border pt-6">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-4">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
      </label>
    </div>
  );
}
