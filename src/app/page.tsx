"use client"

import React, { useState, useRef } from "react";
import { Bot, Upload, Play, RefreshCw, Copy, Download, AlertCircle, CheckCircle2, ShieldAlert, Zap, FileCode, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { aiCodeReviewFeedback, type AICodeReviewFeedbackOutput } from "@/ai/flows/ai-code-review-feedback";
import { aiCodeRewriteOptimization, type AICodeRewriteOptimizationOutput } from "@/ai/flows/ai-code-rewrite-optimization";
import { cn } from "@/lib/utils";

const LANGUAGES = ["Python", "JavaScript", "Java", "C++"] as const;
const FOCUS_AREAS = [
  { id: "Bug detection", label: "Bug Detection", icon: AlertCircle },
  { id: "Performance optimization", label: "Performance", icon: Zap },
  { id: "Security analysis", label: "Security", icon: ShieldAlert },
  { id: "Best coding practices", label: "Best Practices", icon: CheckCircle2 },
] as const;

export default function AICodeReviewPage() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>("JavaScript");
  const [focusAreas, setFocusAreas] = useState<string[]>(["Bug detection", "Best coding practices"]);
  const [reviewResult, setReviewResult] = useState<AICodeReviewFeedbackOutput | null>(null);
  const [rewriteResult, setRewriteResult] = useState<AICodeRewriteOptimizationOutput | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleReview = async () => {
    if (!code.trim()) {
      toast({ title: "Error", description: "Please enter some code to review.", variant: "destructive" });
      return;
    }
    setIsReviewing(true);
    try {
      const result = await aiCodeReviewFeedback({
        code,
        language,
        focusAreas: focusAreas as any,
      });
      setReviewResult(result);
      toast({ title: "Review Complete", description: "AI has finished reviewing your code." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate review. Please try again.", variant: "destructive" });
    } finally {
      setIsReviewing(false);
    }
  };

  const handleRewrite = async () => {
    if (!code.trim()) {
      toast({ title: "Error", description: "Please enter some code to rewrite.", variant: "destructive" });
      return;
    }
    setIsRewriting(true);
    try {
      const result = await aiCodeRewriteOptimization({
        code,
        language,
        focusAreas: focusAreas as any,
        reviewFeedback: reviewResult ? JSON.stringify(reviewResult.review) : undefined,
      });
      setRewriteResult(result);
      toast({ title: "Rewrite Complete", description: "Your code has been optimized and rewritten." });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to rewrite code. Please try again.", variant: "destructive" });
    } finally {
      setIsRewriting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Code copied to clipboard." });
  };

  const downloadCode = (text: string, lang: string) => {
    const extension = lang === "Python" ? "py" : lang === "JavaScript" ? "js" : lang === "Java" ? "java" : "cpp";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `optimized_code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-headline font-bold tracking-tight">AI Code Review & Rewrite Agent</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline text-lg">Source Code</CardTitle>
                  <CardDescription>Paste your code to get AI-powered insights</CardDescription>
                </div>
                <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
                  <SelectTrigger className="w-[140px] bg-background border-border">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative group">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// Paste your code here..."
                  className="min-h-[500px] font-code text-sm p-6 bg-[#12131a] border-none focus-visible:ring-0 resize-none rounded-none"
                />
              </div>
            </CardContent>
            <div className="p-4 border-t border-border bg-muted/20 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4">
                {FOCUS_AREAS.map((area) => (
                  <label key={area.id} className="flex items-center gap-2 cursor-pointer group">
                    <Checkbox
                      id={area.id}
                      checked={focusAreas.includes(area.id)}
                      onCheckedChange={(checked) => {
                        if (checked) setFocusAreas([...focusAreas, area.id]);
                        else setFocusAreas(focusAreas.filter(a => a !== area.id));
                      }}
                    />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                      <area.icon className="w-3.5 h-3.5" />
                      {area.label}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={handleReview} disabled={isReviewing || !code} className="flex-1 sm:flex-none shadow-lg shadow-primary/20">
                  {isReviewing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                  Review Code
                </Button>
                <Button variant="secondary" onClick={handleRewrite} disabled={isRewriting || !code} className="flex-1 sm:flex-none">
                  {isRewriting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Rewrite Code
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Output */}
        <div className="space-y-6">
          <Tabs defaultValue="review" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
              <TabsTrigger value="review" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Review Results</TabsTrigger>
              <TabsTrigger value="rewrite" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">Optimized Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="review" className="mt-4 space-y-4">
              {reviewResult ? (
                <ScrollArea className="h-[calc(100vh-280px)] rounded-xl border border-border/50 bg-card p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-headline font-semibold text-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-accent" />
                        AI Analysis Findings
                      </h3>
                      <Badge variant="outline" className="font-code">{reviewResult.review.length} Issues</Badge>
                    </div>
                    {reviewResult.review.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                        <CheckCircle2 className="w-12 h-12 text-green-500/50" />
                        <p>No issues detected. Your code looks great!</p>
                      </div>
                    ) : (
                      reviewResult.review.map((issue, idx) => (
                        <div key={idx} className="p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2">
                              <Badge className={cn("text-[10px] uppercase font-bold px-2 py-0", getSeverityColor(issue.severity))}>
                                {issue.severity}
                              </Badge>
                              <span className="text-sm font-semibold text-accent">{issue.type}</span>
                            </div>
                            {issue.lineNumbers && issue.lineNumbers.length > 0 && (
                              <span className="text-xs font-code text-muted-foreground">Line {issue.lineNumbers.join(", ")}</span>
                            )}
                          </div>
                          <p className="text-sm mb-3 leading-relaxed">{issue.description}</p>
                          <div className="bg-card rounded p-3 text-sm border-l-2 border-primary/50">
                            <span className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">Suggestion</span>
                            <div className="text-muted-foreground italic leading-relaxed">
                              {issue.suggestions}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                  <Bot className="w-12 h-12 mb-4 opacity-20" />
                  <p>Submit your code for AI review</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rewrite" className="mt-4 space-y-4">
              {rewriteResult ? (
                <div className="space-y-4">
                   <div className="rounded-xl border border-border bg-card overflow-hidden">
                    <div className="bg-muted/30 px-4 py-2 flex items-center justify-between border-b border-border">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-accent" />
                        <span className="text-xs font-headline font-medium uppercase tracking-wider text-muted-foreground">Rewritten Code</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(rewriteResult.rewrittenCode)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadCode(rewriteResult.rewrittenCode, language)}>
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-[400px] bg-[#12131a]">
                      <pre className="p-6 text-sm font-code leading-relaxed text-blue-100/90 whitespace-pre-wrap">
                        {rewriteResult.rewrittenCode}
                      </pre>
                    </ScrollArea>
                  </div>

                  <Card className="border-accent/20 bg-accent/5">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-headline flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        Optimization Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        {rewriteResult.commentsSummary}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Original</span>
                      <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-3 h-32 overflow-hidden opacity-60">
                         <pre className="text-[10px] font-code line-clamp-6">{code}</pre>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent px-1">Improved</span>
                      <div className="rounded-lg bg-green-950/20 border border-green-500/20 p-3 h-32 overflow-hidden">
                         <pre className="text-[10px] font-code line-clamp-6">{rewriteResult.rewrittenCode}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                  <RefreshCw className="w-12 h-12 mb-4 opacity-20" />
                  <p>Optimize and refactor your code</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Code Review & Rewrite Agent. Powered by Groq & Llama 3.3.
          </p>
        </div>
      </footer>
    </div>
  );
}
