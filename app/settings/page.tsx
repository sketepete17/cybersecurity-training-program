"use client";

import { useState } from "react";
import { Sidebar } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Check,
  ChevronRight,
  Camera,
  LogOut,
} from "lucide-react";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language & Region", icon: Globe },
];

export default function SettingsPage() {
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Finance",
    jobTitle: "Financial Analyst",
  });

  const [notifications, setNotifications] = useState({
    emailTraining: true,
    emailReminders: true,
    emailReports: false,
    pushTraining: true,
    pushReminders: false,
    pushSecurityAlerts: true,
  });

  const [theme, setTheme] = useState("dark");

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    addToast("Settings saved successfully!", "success");
  };

  const handleChangePassword = () => {
    addToast("Password change dialog opening...", "info");
    setTimeout(() => {
      addToast("Please check your email for password reset instructions", "success");
    }, 1500);
  };

  const handleManage2FA = () => {
    addToast("Two-factor authentication settings opening...", "info");
  };

  const handleViewSessions = () => {
    addToast("Loading active sessions...", "info");
    setTimeout(() => {
      addToast("You have 2 active sessions: Chrome (Windows) and Safari (iPhone)", "info");
    }, 1000);
  };

  const handleSignOutAll = () => {
    addToast("Signing out from all devices...", "info");
    setTimeout(() => {
      addToast("Signed out from all other devices", "success");
    }, 1500);
  };

  const handleChangeAvatar = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          addToast("File size exceeds 2MB limit", "error");
        } else {
          addToast(`Profile photo "${file.name}" uploaded successfully!`, "success");
        }
      }
    };
    input.click();
  };

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Profile Information
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Update your personal information and profile settings.
              </p>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-border">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-semibold text-primary">
                  JD
                </div>
                <button 
                  onClick={handleChangeAvatar}
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change avatar</span>
                </button>
              </div>
              <div>
                <p className="font-medium text-foreground">Profile Photo</p>
                <p className="text-sm text-muted-foreground">
                  JPG, GIF or PNG. Max size 2MB.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  First Name
                </label>
                <Input
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, firstName: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Last Name
                </label>
                <Input
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone Number
                </label>
                <Input
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Department
                </label>
                <Input
                  value={profileData.department}
                  disabled
                  className="bg-secondary border-border text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Contact your administrator to change department
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Job Title
                </label>
                <Input
                  value={profileData.jobTitle}
                  onChange={(e) =>
                    setProfileData({ ...profileData, jobTitle: e.target.value })
                  }
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Notification Preferences
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage how and when you receive notifications.
              </p>
            </div>

            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-medium text-foreground">Email Notifications</h4>
              </div>

              <div className="ml-8 space-y-3">
                <NotificationToggle
                  label="Training Updates"
                  description="Receive emails about new training modules and updates"
                  checked={notifications.emailTraining}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      emailTraining: !notifications.emailTraining,
                    })
                  }
                />
                <NotificationToggle
                  label="Reminders"
                  description="Get reminded about incomplete training and deadlines"
                  checked={notifications.emailReminders}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      emailReminders: !notifications.emailReminders,
                    })
                  }
                />
                <NotificationToggle
                  label="Weekly Reports"
                  description="Receive weekly progress reports"
                  checked={notifications.emailReports}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      emailReports: !notifications.emailReports,
                    })
                  }
                />
              </div>
            </div>

            {/* Push Notifications */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <h4 className="font-medium text-foreground">Push Notifications</h4>
              </div>

              <div className="ml-8 space-y-3">
                <NotificationToggle
                  label="Training Alerts"
                  description="Get notified about new training content"
                  checked={notifications.pushTraining}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      pushTraining: !notifications.pushTraining,
                    })
                  }
                />
                <NotificationToggle
                  label="Deadline Reminders"
                  description="Receive push notifications for upcoming deadlines"
                  checked={notifications.pushReminders}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      pushReminders: !notifications.pushReminders,
                    })
                  }
                />
                <NotificationToggle
                  label="Security Alerts"
                  description="Important security notifications and updates"
                  checked={notifications.pushSecurityAlerts}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      pushSecurityAlerts: !notifications.pushSecurityAlerts,
                    })
                  }
                />
              </div>
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
                Manage your account security and authentication methods.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-border bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed 30 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-border" onClick={handleChangePassword}>
                      Change
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            Two-Factor Authentication
                          </p>
                          <Badge className="bg-primary/10 text-primary border-0 text-xs">
                            Enabled
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Using authenticator app
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-border" onClick={handleManage2FA}>
                      Manage
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-secondary/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Monitor className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Active Sessions</p>
                        <p className="text-sm text-muted-foreground">
                          2 devices currently logged in
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-border" onClick={handleViewSessions}>
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                variant="outline" 
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={handleSignOutAll}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out of all devices
              </Button>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Appearance
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Customize how CyberShield looks on your device.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Theme</h4>
              <div className="grid grid-cols-3 gap-4">
                <ThemeOption
                  icon={Sun}
                  label="Light"
                  selected={theme === "light"}
                  onClick={() => setTheme("light")}
                />
                <ThemeOption
                  icon={Moon}
                  label="Dark"
                  selected={theme === "dark"}
                  onClick={() => setTheme("dark")}
                />
                <ThemeOption
                  icon={Monitor}
                  label="System"
                  selected={theme === "system"}
                  onClick={() => setTheme("system")}
                />
              </div>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Language & Region
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Set your language and regional preferences.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Language
                </label>
                <select className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Timezone
                </label>
                <select className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Eastern Time (ET)</option>
                  <option>Pacific Time (PT)</option>
                  <option>Central Time (CT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>UTC</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Date Format
                </label>
                <select className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
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
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your account settings and preferences.
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
      <button
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-secondary"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
        <span className="sr-only">{label}</span>
      </button>
    </div>
  );
}

function ThemeOption({
  icon: Icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-secondary/30 hover:bg-secondary/50"
      }`}
    >
      {selected && (
        <div className="absolute right-2 top-2">
          <Check className="h-4 w-4 text-primary" />
        </div>
      )}
      <Icon className={`h-6 w-6 ${selected ? "text-primary" : "text-muted-foreground"}`} />
      <span className={`text-sm font-medium ${selected ? "text-primary" : "text-foreground"}`}>
        {label}
      </span>
    </button>
  );
}
