"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Send,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  ChevronRight,
  User,
  Headphones,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: string;
  lastUpdate: string;
  messages: number;
}

const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Cannot access Phishing module after completion",
    status: "in-progress",
    priority: "medium",
    createdAt: "Jan 28, 2026",
    lastUpdate: "2 hours ago",
    messages: 3,
  },
  {
    id: "TKT-002",
    subject: "Certificate not generating for completed training",
    status: "open",
    priority: "high",
    createdAt: "Jan 27, 2026",
    lastUpdate: "1 day ago",
    messages: 1,
  },
  {
    id: "TKT-003",
    subject: "Question about password policy training content",
    status: "resolved",
    priority: "low",
    createdAt: "Jan 20, 2026",
    lastUpdate: "Jan 22, 2026",
    messages: 5,
  },
];

const categoryOptions = [
  { value: "technical", label: "Technical Issue" },
  { value: "content", label: "Training Content" },
  { value: "access", label: "Access & Permissions" },
  { value: "certificate", label: "Certificates" },
  { value: "other", label: "Other" },
];

export default function SupportPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"new" | "tickets">("new");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReply, setTicketReply] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    addToast("Support ticket submitted successfully!", "success");
  };

  const resetForm = () => {
    setSubject("");
    setCategory("");
    setMessage("");
    setIsSubmitted(false);
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    addToast(`Viewing ticket ${ticket.id}`, "info");
  };

  const handleSendReply = async () => {
    if (!ticketReply.trim() || !selectedTicket) return;
    
    setIsSendingReply(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSendingReply(false);
    setTicketReply("");
    addToast("Reply sent successfully!", "success");
  };

  const handleLiveChat = () => {
    addToast("Connecting to live chat support...", "info");
    // Simulate chat connection
    setTimeout(() => {
      addToast("Live chat is currently available. A support agent will be with you shortly.", "success");
    }, 1500);
  };

  const handleScheduleCall = () => {
    addToast("Opening scheduling calendar...", "info");
    // In a real app, this would open a calendar/scheduling widget
    setTimeout(() => {
      addToast("Please select a time slot for your call", "info");
    }, 1000);
  };

  const handleAttachment = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png,.jpg,.jpeg,.pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          addToast("File size exceeds 10MB limit", "error");
        } else {
          addToast(`File "${file.name}" attached successfully`, "success");
        }
      }
    };
    input.click();
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="border-chart-4 text-chart-4">
            <AlertCircle className="h-3 w-3 mr-1" />
            Open
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="outline" className="border-chart-2 text-chart-2">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
            <p className="mt-2 text-muted-foreground">
              Get help with your training or report technical issues.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1 w-fit mb-8">
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "new"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              New Request
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "tickets"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              My Tickets
              <Badge variant="secondary" className="ml-2">
                {mockTickets.length}
              </Badge>
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === "new" && !isSubmitted && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      Submit a Support Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Subject
                        </label>
                        <Input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Brief description of your issue"
                          required
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Description
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Please describe your issue in detail. Include any error messages, steps to reproduce, and what you expected to happen."
                          required
                          rows={6}
                          className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Attachments (optional)
                        </label>
                        <div 
                          className="rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={handleAttachment}
                        >
                          <Paperclip className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">
                            Drag and drop files here, or{" "}
                            <button
                              type="button"
                              className="text-primary hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAttachment();
                              }}
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Max file size: 10MB. Supported: PNG, JPG, PDF
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                          className="border-border"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isSubmitting ? (
                            "Submitting..."
                          ) : (
                            <>
                              Submit Request
                              <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === "new" && isSubmitted && (
                <Card className="border-border bg-card">
                  <CardContent className="p-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Request Submitted
                    </h2>
                    <p className="text-muted-foreground mb-2">
                      Your support ticket has been created successfully.
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Ticket ID: <span className="font-mono text-primary">TKT-004</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                      Our support team will review your request and respond within 24
                      hours. You will receive an email notification when there is an
                      update.
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={resetForm}
                        className="border-border"
                      >
                        Submit Another
                      </Button>
                      <Button
                        onClick={() => setActiveTab("tickets")}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        View My Tickets
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "tickets" && (
                <div className="space-y-6">
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">My Support Tickets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          onClick={() => handleTicketClick(ticket)}
                          className={`rounded-lg border p-4 transition-colors cursor-pointer group ${
                            selectedTicket?.id === ticket.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-secondary/30"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-muted-foreground">
                                {ticket.id}
                              </span>
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <h3 className="font-medium text-foreground mb-2">
                            {ticket.subject}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Created {ticket.createdAt}</span>
                            <span>Updated {ticket.lastUpdate}</span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {ticket.messages} messages
                            </span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Ticket Detail Panel */}
                  {selectedTicket && (
                    <Card className="border-border bg-card">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-foreground">
                            {selectedTicket.id}: {selectedTicket.subject}
                          </CardTitle>
                          {getStatusBadge(selectedTicket.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="rounded-lg bg-secondary/30 p-4">
                          <p className="text-sm text-muted-foreground mb-2">Your message:</p>
                          <p className="text-foreground">
                            I am experiencing issues with this feature. Please help resolve this as soon as possible.
                          </p>
                        </div>
                        
                        {selectedTicket.status !== "open" && (
                          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                            <p className="text-sm text-muted-foreground mb-2">Support Response:</p>
                            <p className="text-foreground">
                              Thank you for contacting us. We are looking into this issue and will get back to you shortly with a resolution.
                            </p>
                          </div>
                        )}
                        
                        <div className="pt-4 border-t border-border">
                          <label className="text-sm font-medium text-foreground block mb-2">
                            Add a Reply
                          </label>
                          <textarea
                            value={ticketReply}
                            onChange={(e) => setTicketReply(e.target.value)}
                            placeholder="Type your reply here..."
                            rows={3}
                            className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          />
                          <div className="flex justify-end mt-3">
                            <Button
                              onClick={handleSendReply}
                              disabled={!ticketReply.trim() || isSendingReply}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              {isSendingReply ? "Sending..." : "Send Reply"}
                              <Send className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Options */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Need Immediate Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button 
                    onClick={handleLiveChat}
                    className="w-full flex items-center gap-3 rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Headphones className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">Live Chat</p>
                      <p className="text-sm text-muted-foreground">
                        Available 24/7
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>

                  <button 
                    onClick={handleScheduleCall}
                    className="w-full flex items-center gap-3 rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground">
                        Schedule a Call
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Talk to a specialist
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </CardContent>
              </Card>

              {/* Response Times */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Expected Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs">
                        High
                      </Badge>
                      <span className="text-sm text-foreground">Priority</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      4 hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Medium
                      </Badge>
                      <span className="text-sm text-foreground">Priority</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      24 hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Low
                      </Badge>
                      <span className="text-sm text-foreground">Priority</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      48 hours
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    <a
                      href="/help"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Help Center & FAQs
                    </a>
                    <a
                      href="#"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      System Status
                    </a>
                    <a
                      href="#"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Training Documentation
                    </a>
                    <a
                      href="#"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Video Tutorials
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
