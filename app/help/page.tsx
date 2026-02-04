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
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Shield,
  Users,
  Settings,
  HelpCircle,
  PlayCircle,
  AlertCircle,
} from "lucide-react";

const categories = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: PlayCircle,
    articles: 8,
  },
  {
    id: "training",
    label: "Training Modules",
    icon: BookOpen,
    articles: 12,
  },
  {
    id: "account",
    label: "Account & Profile",
    icon: Users,
    articles: 6,
  },
  {
    id: "security",
    label: "Security & Privacy",
    icon: Shield,
    articles: 10,
  },
  {
    id: "technical",
    label: "Technical Support",
    icon: Settings,
    articles: 5,
  },
];

const popularArticles = [
  {
    title: "How to complete your first training module",
    category: "Getting Started",
    views: "2.4k",
  },
  {
    title: "Understanding your security score",
    category: "Training",
    views: "1.8k",
  },
  {
    title: "Resetting your password",
    category: "Account",
    views: "1.5k",
  },
  {
    title: "Two-factor authentication setup guide",
    category: "Security",
    views: "1.2k",
  },
  {
    title: "Reporting a phishing simulation",
    category: "Training",
    views: "980",
  },
];

const faqs = [
  {
    question: "How long does each training module take to complete?",
    answer:
      "Training modules typically take between 10-30 minutes to complete, depending on the topic complexity. Each module displays an estimated completion time before you begin. You can also pause and resume training at any time.",
  },
  {
    question: "Can I retake a training module to improve my score?",
    answer:
      "Yes! You can retake any training module as many times as you like. Your highest score will be recorded, and each attempt helps reinforce important security concepts.",
  },
  {
    question: "What happens if I fail a quiz?",
    answer:
      "If you don't pass a quiz, you'll receive feedback on the questions you missed and can review the relevant material before trying again. There's no penalty for retaking quizzes.",
  },
  {
    question: "How do I earn certificates for completed training?",
    answer:
      "Certificates are automatically generated when you complete all lessons within a module and achieve a passing score of 70% or higher. You can download certificates from your Progress page.",
  },
  {
    question: "Who can see my training progress?",
    answer:
      "Your training progress is visible to you and your organization's administrators. Individual quiz answers are private, but completion status and scores are shared with relevant stakeholders.",
  },
  {
    question: "How often is new training content added?",
    answer:
      "We regularly update our training library with new content addressing emerging threats. Most organizations receive new modules monthly, with special alert-based training for urgent security topics.",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<typeof popularArticles | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      // Filter articles based on search
      const results = popularArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults(null);
    }
  };

  const handleArticleClick = (article: typeof popularArticles[0]) => {
    addToast(`Opening article: "${article.title}"`, "info");
    // In a real app, this would navigate to the article
  };

  const handleCategoryClick = (category: typeof categories[0]) => {
    setSelectedCategory(category.id);
    addToast(`Browsing ${category.label} articles`, "info");
    // Filter or navigate to category
  };

  const handleLiveChat = () => {
    addToast("Connecting to live chat support...", "info");
    setTimeout(() => {
      addToast("Live chat is currently available. A support agent will be with you shortly.", "success");
    }, 1500);
  };

  const handleEmailSupport = () => {
    addToast("Opening email client...", "info");
    window.location.href = "mailto:support@cybershield.app?subject=Support%20Request";
  };

  const handlePhoneSupport = () => {
    addToast("Phone support: 1-800-CYBER-SHIELD", "info");
  };

  const handleSubmitTicket = () => {
    router.push("/support");
  };

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />

      <main className="pt-14 lg:pt-0 lg:pl-64">
        <div className="px-4 py-6 lg:px-8 lg:py-8">
          {/* Header with Search */}
          <div className="mb-8 rounded-xl bg-card border border-border p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                How can we help you?
              </h1>
              <p className="text-muted-foreground mb-6">
                Search our knowledge base or browse categories below
              </p>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for articles, guides, and more..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 py-6 text-base bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
                
                {/* Search Results Dropdown */}
                {searchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-lg z-10">
                    {searchResults.map((article, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleArticleClick(article);
                          setSearchQuery("");
                          setSearchResults(null);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-secondary/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <p className="font-medium text-foreground">{article.title}</p>
                        <p className="text-sm text-muted-foreground">{article.category}</p>
                      </button>
                    ))}
                  </div>
                )}
                
                {searchResults && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-card shadow-lg p-4 text-center z-10">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Browse by Category
            </h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`border-border bg-card hover:bg-secondary/50 transition-colors cursor-pointer group ${
                    selectedCategory === category.id ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col items-center text-center">
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary/20"
                          : "bg-primary/10 group-hover:bg-primary/20"
                      }`}>
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground mb-1">
                        {category.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.articles} articles
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Popular Articles */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <FileText className="h-5 w-5 text-primary" />
                    Popular Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {popularArticles.map((article, index) => (
                      <button
                        key={index}
                        onClick={() => handleArticleClick(article)}
                        className="w-full flex items-center justify-between rounded-lg p-3 hover:bg-secondary/50 transition-colors group text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {article.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="border-border text-xs text-muted-foreground"
                            >
                              {article.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {article.views} views
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className={`rounded-lg border overflow-hidden transition-all duration-300 ${
                          expandedFaq === index 
                            ? "border-primary/30 bg-primary/5 shadow-sm" 
                            : "border-border hover:border-primary/20"
                        }`}
                      >
                        <button
                          onClick={() =>
                            setExpandedFaq(expandedFaq === index ? null : index)
                          }
                          className="w-full flex items-center justify-between p-4 text-left transition-colors"
                        >
                          <span className={`font-medium pr-4 transition-colors ${
                            expandedFaq === index ? "text-primary" : "text-foreground"
                          }`}>
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                              expandedFaq === index 
                                ? "rotate-180 text-primary" 
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${
                          expandedFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}>
                          <div className="px-4 pb-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Support */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {"Can't find what you're looking for? Our support team is here to help."}
                  </p>

                  <div className="space-y-3">
                    <button 
                      onClick={handleLiveChat}
                      className="w-full flex items-center gap-3 rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">Live Chat</p>
                        <p className="text-sm text-muted-foreground">
                          Available 24/7
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </button>

                    <button 
                      onClick={handleEmailSupport}
                      className="w-full flex items-center gap-3 rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">
                          Email Support
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Response within 24h
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </button>

                    <button 
                      onClick={handlePhoneSupport}
                      className="w-full flex items-center gap-3 rounded-lg bg-secondary/50 p-4 hover:bg-secondary transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-foreground">
                          Phone Support
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Mon-Fri, 9am-6pm ET
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Ticket */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mx-auto">
                      <AlertCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Need More Help?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Submit a support ticket and our team will get back to you.
                    </p>
                    <Button 
                      onClick={handleSubmitTicket}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Submit a Ticket
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      System Status
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Release Notes
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Privacy Policy
                    </a>
                    <a
                      href="#"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Terms of Service
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
