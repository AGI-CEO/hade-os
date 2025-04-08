"use client"

import type React from "react"

import { useState } from "react"
import {
  Scroll,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  FileUp,
  Download,
  Sparkles,
  Lightbulb,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LeaseAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const startAnalysis = () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setUploadProgress(0)
    setAnalysisProgress(0)

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Simulate analysis progress after upload completes
    setTimeout(() => {
      clearInterval(uploadInterval)
      setUploadProgress(100)

      const analysisInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(analysisInterval)
            setIsAnalyzing(false)
            setIsAnalyzed(true)
            return 100
          }
          return prev + 2
        })
      }, 100)
    }, 2000)
  }

  const resetAnalysis = () => {
    setIsAnalyzing(false)
    setIsAnalyzed(false)
    setSelectedFile(null)
    setUploadProgress(0)
    setAnalysisProgress(0)
  }

  // Sample lease analysis results
  const leaseAnalysis = {
    score: 78,
    keyTerms: [
      { term: "Lease Term", value: "12 months", status: "standard" },
      { term: "Monthly Rent", value: "$1,850", status: "standard" },
      { term: "Security Deposit", value: "$1,850", status: "standard" },
      { term: "Late Fee", value: "$75 after 5 days", status: "standard" },
      { term: "Pet Deposit", value: "$500 non-refundable", status: "concern" },
      { term: "Maintenance Responsibility", value: "Tenant responsible for all repairs under $200", status: "concern" },
      { term: "Early Termination", value: "2 months' rent penalty", status: "concern" },
      { term: "Renewal Terms", value: "Automatic renewal with 60-day notice", status: "favorable" },
    ],
    risks: [
      "Tenant responsible for more maintenance costs than standard",
      "Pet deposit is non-refundable, which may not be legal in some jurisdictions",
      "Early termination penalty is higher than market average",
    ],
    recommendations: [
      "Negotiate maintenance responsibility to standard $100 threshold",
      "Request partial refundability of pet deposit based on condition",
      "Consider requesting reduction of early termination penalty to 1.5 months' rent",
      "Add specific language about property condition documentation",
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Scroll className="mr-2 h-5 w-5 text-primary" />
              Lease Analyzer
            </CardTitle>
            <CardDescription>
              Upload a lease document to analyze terms, identify risks, and get recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isAnalyzed ? (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-10 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileUp className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-primary-foreground">Upload Lease Document</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Drag and drop your lease document, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PDF, DOCX, and JPG formats up to 10MB
                      </p>
                    </div>
                    <div className="relative">
                      <Button variant="outline" className="relative z-10">
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        accept=".pdf,.docx,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </div>

                {selectedFile && (
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm font-medium text-primary-foreground">{selectedFile.name}</span>
                      </div>
                      <Badge variant="outline">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>

                    {isAnalyzing && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Uploading</span>
                            <span className="text-primary-foreground">{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-1.5" />
                        </div>

                        {uploadProgress === 100 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Analyzing Document</span>
                              <span className="text-primary-foreground">{analysisProgress}%</span>
                            </div>
                            <Progress value={analysisProgress} className="h-1.5" />
                          </div>
                        )}
                      </div>
                    )}

                    {!isAnalyzing && (
                      <div className="flex justify-end mt-2">
                        <Button onClick={startAnalysis}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Analyze Lease
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium text-primary-foreground">
                      {selectedFile?.name || "Lease_Document.pdf"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-primary/20 text-primary border-primary/20">AI Analyzed</Badge>
                    <Button variant="outline" size="sm" onClick={resetAnalysis}>
                      Analyze Another
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-primary-foreground">Lease Analysis Score</h3>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <span className="text-lg font-bold text-primary">{leaseAnalysis.score}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Progress
                      value={leaseAnalysis.score}
                      className="h-2.5 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-green-500"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>High Risk</span>
                      <span>Moderate</span>
                      <span>Favorable</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3">
                    This lease has some standard terms but includes several clauses that may be unfavorable or present
                    risks.
                  </p>
                </div>

                <Tabs defaultValue="key-terms" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="key-terms">Key Terms</TabsTrigger>
                    <TabsTrigger value="risks">Risks</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="key-terms" className="mt-4 space-y-4">
                    {leaseAnalysis.keyTerms.map((term, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-primary-foreground">{term.term}</span>
                          <Badge
                            className={
                              term.status === "favorable"
                                ? "bg-green-500"
                                : term.status === "concern"
                                  ? "bg-amber-500"
                                  : "bg-primary/20"
                            }
                          >
                            {term.status.charAt(0).toUpperCase() + term.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{term.value}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="risks" className="mt-4 space-y-4">
                    {leaseAnalysis.risks.map((risk, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border bg-card/50 flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-primary-foreground">{risk}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-4 space-y-4">
                    {leaseAnalysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border bg-card/50 flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-primary-foreground">{recommendation}</p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Analysis
                  </Button>
                  <Button>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Negotiation Points
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Info className="mr-2 h-5 w-5 text-primary" />
              About Lease Analysis
            </CardTitle>
            <CardDescription>How our AI analyzes your lease</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Our AI scans your lease document and extracts key terms and conditions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Terms are compared against standard market practices and legal requirements
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Potential risks and unfavorable terms are identified and highlighted
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Recommendations for negotiation or modification are provided
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Lightbulb className="mr-2 h-5 w-5 text-primary" />
              Lease Analysis Tips
            </CardTitle>
            <CardDescription>Get the most accurate analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Upload clear, high-quality scans or digital documents
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Include all pages and addendums for comprehensive analysis
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Review the analysis with a legal professional before making decisions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Use the negotiation points as a starting point for discussions
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
