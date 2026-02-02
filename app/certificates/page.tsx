"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, MobileHeader } from "@/components/training/sidebar";
import { modules, mockUserProgress } from "@/lib/training-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  Award,
  Download,
  Share2,
  Calendar,
  Clock,
  ExternalLink,
  Trophy,
  Target,
  Shield,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Certificate {
  id: string;
  moduleId: string;
  moduleTitle: string;
  issueDate: string;
  expiryDate: string;
  score: number;
  status: "valid" | "expiring" | "expired";
  credentialId: string;
}

const mockCertificates: Certificate[] = [
  {
    id: "cert-001",
    moduleId: "phishing",
    moduleTitle: "Phishing & Social Engineering",
    issueDate: "Jan 15, 2026",
    expiryDate: "Jan 15, 2027",
    score: 92,
    status: "valid",
    credentialId: "CS-PHI-2026-001234",
  },
  {
    id: "cert-002",
    moduleId: "password",
    moduleTitle: "Password Security Best Practices",
    issueDate: "Jan 10, 2026",
    expiryDate: "Feb 10, 2026",
    score: 88,
    status: "expiring",
    credentialId: "CS-PWD-2026-001235",
  },
  {
    id: "cert-003",
    moduleId: "data-protection",
    moduleTitle: "Data Protection & Privacy",
    issueDate: "Dec 01, 2025",
    expiryDate: "Dec 01, 2025",
    score: 85,
    status: "expired",
    credentialId: "CS-DPR-2025-001122",
  },
];

export default function CertificatesPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState<string | null>(null);

  const handleDownload = async (cert: Certificate) => {
    setIsDownloading(cert.id);
    
    // Simulate download generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Create a canvas to generate PNG certificate
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      // Inner border
      ctx.strokeStyle = "#10b98140";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      
      // Title
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 36px Arial";
      ctx.textAlign = "center";
      ctx.fillText("CERTIFICATE OF COMPLETION", canvas.width / 2, 120);
      
      // Shield icon (simple representation)
      ctx.fillStyle = "#10b98130";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 150);
      ctx.lineTo(canvas.width / 2 + 40, 170);
      ctx.lineTo(canvas.width / 2 + 40, 210);
      ctx.lineTo(canvas.width / 2, 240);
      ctx.lineTo(canvas.width / 2 - 40, 210);
      ctx.lineTo(canvas.width / 2 - 40, 170);
      ctx.closePath();
      ctx.fill();
      
      // Certifies text
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "18px Arial";
      ctx.fillText("This is to certify that", canvas.width / 2, 280);
      
      // Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px Arial";
      ctx.fillText("Jane Doe", canvas.width / 2, 330);
      
      // Has completed text
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "18px Arial";
      ctx.fillText("has successfully completed the training module", canvas.width / 2, 380);
      
      // Module title
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 24px Arial";
      ctx.fillText(cert.moduleTitle, canvas.width / 2, 420);
      
      // Score
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${cert.score}%`, canvas.width / 2, 470);
      
      // Date and credential
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "14px Arial";
      ctx.fillText(`Issue Date: ${cert.issueDate}  |  Credential ID: ${cert.credentialId}`, canvas.width / 2, 520);
      
      // Footer
      ctx.fillStyle = "#10b981";
      ctx.font = "16px Arial";
      ctx.fillText("CyberShield Security Training Platform", canvas.width / 2, 560);
    }
    
    // Convert to PNG and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate-${cert.credentialId}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    }, "image/png");
    
    setIsDownloading(null);
    addToast(`Certificate downloaded as PNG!`, "success");
  };

  const handleShare = async (cert: Certificate) => {
    setIsSharing(cert.id);
    
    const shareData = {
      title: `${cert.moduleTitle} Certificate`,
      text: `I've completed ${cert.moduleTitle} training with a score of ${cert.score}%! Credential ID: ${cert.credentialId}`,
      url: `https://cybershield.app/verify/${cert.credentialId}`,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        addToast("Certificate shared successfully!", "success");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `${shareData.text}\nVerify at: ${shareData.url}`
        );
        addToast("Certificate link copied to clipboard!", "success");
      }
    } catch {
      // User cancelled or error
      addToast("Share cancelled", "info");
    }
    
    setIsSharing(null);
  };

  const handleRenew = (cert: Certificate) => {
    addToast(`Redirecting to ${cert.moduleTitle} training...`, "info");
    // Navigate to the module
    router.push(`/modules/${cert.moduleId}`);
  };

  const handleVerificationPortal = () => {
    addToast("Opening verification portal...", "info");
    // In a real app, this would open the verification portal
    window.open("https://cybershield.app/verify", "_blank");
  };

  // Calculate completion stats
  const completedModules = modules.filter((m) =>
    m.lessons.every((l) =>
      mockUserProgress.some(
        (p) => p.moduleId === m.id && p.lessonId === l.id && p.completed
      )
    )
  ).length;

  const getStatusBadge = (status: Certificate["status"]) => {
    switch (status) {
      case "valid":
        return (
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
            <Shield className="h-3 w-3 mr-1" />
            Valid
          </Badge>
        );
      case "expiring":
        return (
          <Badge className="bg-warning/20 text-warning hover:bg-warning/30">
            <Clock className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="destructive">
            <Lock className="h-3 w-3 mr-1" />
            Expired
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
            <h1 className="text-3xl font-bold text-foreground">
              My Certificates
            </h1>
            <p className="mt-2 text-muted-foreground">
              View and download your security training certificates.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Earned
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {mockCertificates.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active & Valid
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {mockCertificates.filter((c) => c.status === "valid").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Expiring Soon
                    </p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {mockCertificates.filter((c) => c.status === "expiring").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {Math.round(
                        mockCertificates.reduce((acc, c) => acc + c.score, 0) /
                          mockCertificates.length
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Certificates List */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">
                    Your Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockCertificates.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => setSelectedCert(cert)}
                      className={cn(
                        "rounded-lg border p-4 cursor-pointer transition-all",
                        selectedCert?.id === cert.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Award className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {cert.moduleTitle}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Credential ID: {cert.credentialId}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(cert.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Issue Date
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {cert.issueDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Expiry Date
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {cert.expiryDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="text-sm font-medium text-primary">
                            {cert.score}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-border"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(cert);
                          }}
                          disabled={isDownloading === cert.id}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {isDownloading === cert.id ? "Downloading..." : "Download"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-border"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(cert);
                          }}
                          disabled={isSharing === cert.id}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          {isSharing === cert.id ? "Sharing..." : "Share"}
                        </Button>
                        {cert.status === "expired" && (
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 ml-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenew(cert);
                            }}
                          >
                            Renew Certificate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Certificate Preview */}
              {selectedCert && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Certificate Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-card to-secondary border border-border p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-4 left-4 opacity-10">
                        <Shield className="h-20 w-20 text-primary" />
                      </div>
                      <div className="absolute bottom-4 right-4 opacity-10">
                        <Award className="h-20 w-20 text-primary" />
                      </div>

                      <div className="relative z-10">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 mx-auto mb-4">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1">
                          Certificate of Completion
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          This certifies that
                        </p>
                        <p className="text-xl font-semibold text-primary mb-3">
                          Jane Doe
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          has successfully completed
                        </p>
                        <p className="text-sm font-medium text-foreground mb-4">
                          {selectedCert.moduleTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Score: {selectedCert.score}% | {selectedCert.issueDate}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button 
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => handleDownload(selectedCert)}
                        disabled={isDownloading === selectedCert.id}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading === selectedCert.id ? "Generating..." : "Download PNG"}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-border"
                        onClick={() => handleShare(selectedCert)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Certifications */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Available to Earn
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {modules.slice(0, 3).map((module) => {
                    const hasCert = mockCertificates.some(
                      (c) => c.moduleId === module.id
                    );
                    if (hasCert) return null;

                    return (
                      <div
                        key={module.id}
                        className="flex items-center gap-3 rounded-lg bg-secondary/30 p-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Trophy className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {module.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Complete to earn certificate
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <p className="text-sm text-muted-foreground pt-2">
                    Complete {modules.length - completedModules} more modules to
                    earn all certificates.
                  </p>
                </CardContent>
              </Card>

              {/* Verification Info */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Verify Certificates
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        All certificates can be verified using the credential ID
                        at our verification portal.
                      </p>
                      <Button
                        variant="link"
                        className="h-auto p-0 mt-2 text-primary"
                        onClick={handleVerificationPortal}
                      >
                        Visit Verification Portal
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
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
