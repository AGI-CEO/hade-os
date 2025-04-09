"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Mic,
  FileText,
  Brain,
  BarChart2,
  Sparkles,
  Zap,
  Plus,
  ChevronRight,
  Lightbulb,
  Scroll,
  FileSearch,
  Bot,
  Wand2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AIChat } from "@/components/ai-chat"
import { VoiceAssistant } from "@/components/voice-assistant"
import { LeaseAnalyzer } from "@/components/lease-analyzer"
import { DocumentAnalysis } from "@/components/document-analysis"

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState("chatbot")

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">AI Tools</h1>
        <p className="text-muted-foreground">
          Leverage artificial intelligence to enhance your real estate investment strategy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI-Powered</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">Assistants</h2>
              <p className="text-sm text-muted-foreground">Chat and voice support</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FileSearch className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Document</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">Analysis</h2>
              <p className="text-sm text-muted-foreground">Extract insights from documents</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Wand2 className="h-8 w-8 text-primary glow-icon" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Intelligent</p>
              <h2 className="text-2xl font-bold text-primary-foreground glow-text">Automation</h2>
              <p className="text-sm text-muted-foreground">Streamline your workflow</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chatbot" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="chatbot">
            <MessageSquare className="mr-2 h-4 w-4" />
            AI Chatbot
          </TabsTrigger>
          <TabsTrigger value="voice">
            <Mic className="mr-2 h-4 w-4" />
            Voice AI
          </TabsTrigger>
          <TabsTrigger value="lease">
            <Scroll className="mr-2 h-4 w-4" />
            Lease Analyzer
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 h-4 w-4" />
            Document Analysis
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="chatbot" className="mt-0">
                <AIChat />
              </TabsContent>

              <TabsContent value="voice" className="mt-0">
                <VoiceAssistant />
              </TabsContent>

              <TabsContent value="lease" className="mt-0">
                <LeaseAnalyzer />
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <DocumentAnalysis />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>Personalized insights based on your portfolio and market trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">Market Prediction</h3>
                    <p className="text-xs text-muted-foreground">AI-powered market forecast</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Based on current trends and your portfolio, our AI predicts a 7.2% increase in property values in
                  Austin, TX over the next 12 months.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Confidence Level</span>
                    <span className="text-primary-foreground">82%</span>
                  </div>
                  <Progress value={82} className="h-1.5 [&>div]:bg-primary" />
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  View Detailed Forecast
                </Button>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">Investment Opportunities</h3>
                    <p className="text-xs text-muted-foreground">AI-detected potential investments</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Plus className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground">
                        The South Austin neighborhood shows strong growth potential with new development projects and
                        improving infrastructure.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Plus className="h-3 w-3 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground">
                        Multi-family properties in Houston are showing higher than average cash flow potential due to
                        increasing rental demand.
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Explore Opportunities
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">Portfolio Optimization</h3>
                    <p className="text-xs text-muted-foreground">AI recommendations for your portfolio</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-border bg-card/30">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-primary-foreground">Refinance Opportunity</h4>
                      <Badge className="bg-green-500">High Impact</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Refinancing your Oak Street property could save approximately $320/month with current rates.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-card/30">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-primary-foreground">Rent Adjustment</h4>
                      <Badge className="bg-amber-500">Medium Impact</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your Pine Avenue property rent is 8% below market rate. Consider a rent increase at next renewal.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  View All Recommendations
                </Button>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">AI Learning Center</h3>
                    <p className="text-xs text-muted-foreground">Enhance your AI tools experience</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm text-muted-foreground">Train the AI with your preferences</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm text-muted-foreground">Learn advanced AI prompting techniques</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1 h-1 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm text-muted-foreground">Customize AI analysis parameters</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  Open Learning Center
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
