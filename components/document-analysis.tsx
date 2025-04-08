"use client"

import type React from "react"

import { useState } from "react"
import {
  FileText,
  Upload,
  FileUp,
  Download,
  Sparkles,
  Lightbulb,
  Zap,
  Search,
  FileSearch,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export function DocumentAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  // Sample document analysis results
  const documentAnalysis = {
    summary:
      "This document is a purchase agreement for a residential property located at 123 Main Street, Austin, TX. The purchase price is $425,000 with a closing date of June 15, 2023. The agreement includes standard contingencies for financing, inspection, and appraisal.",
    keyPoints: [
      { category: "Property", point: "123 Main Street, Austin, TX 78701", importance: "high" },
      { category: "Price", point: "$425,000 purchase price", importance: "high" },
      { category: "Closing Date", point: "June 15, 2023", importance: "high" },
      { category: "Earnest Money", point: "$8,500 (2% of purchase price)", importance: "medium" },
      { category: "Financing", point: "Conventional loan with 20% down payment", importance: "medium" },
      { category: "Inspection Period", point: "10 days from effective date", importance: "medium" },
      {
        category: "Appraisal Contingency",
        point: "Property must appraise at or above purchase price",
        importance: "medium",
      },
      { category: "Seller Disclosure", point: "Provided within 3 days of effective date", importance: "medium" },
    ],
    potentialIssues: [
      "Inspection period is shorter than the standard 14 days",
      "No specific provisions for repairs negotiation process",
      "Earnest money becomes non-refundable after inspection period regardless of financing approval",
      "Survey responsibility is assigned to the buyer rather than the standard seller provision",
    ],
    entities: [
      { name: "John Smith", role: "Buyer" },
      { name: "Jane Doe", role: "Seller" },
      { name: "ABC Realty", role: "Listing Broker" },
      { name: "XYZ Mortgage", role: "Lender" },
      { name: "First American Title", role: "Title Company" },
    ],
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <FileSearch className="mr-2 h-5 w-5 text-primary" />
              Document Analysis
            </CardTitle>
            <CardDescription>
              Upload real estate documents to extract key information and identify important details
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
                      <h3 className="text-lg font-medium text-primary-foreground">Upload Document</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Drag and drop your document, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports PDF, DOCX, and JPG formats up to 25MB
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
                          Analyze Document
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
                      {selectedFile?.name || "Purchase_Agreement.pdf"}
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
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Info className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-foreground">Document Summary</h3>
                      <p className="text-xs text-muted-foreground">AI-generated overview</p>
                    </div>
                  </div>
                  <p className="text-sm text-primary-foreground">{documentAnalysis.summary}</p>
                  <div className="flex justify-end mt-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Summary
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search within document analysis..."
                      className="pl-9 bg-card border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <Tabs defaultValue="key-points" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="key-points">Key Points</TabsTrigger>
                    <TabsTrigger value="issues">Potential Issues</TabsTrigger>
                    <TabsTrigger value="entities">Entities</TabsTrigger>
                  </TabsList>

                  <TabsContent value="key-points" className="mt-4 space-y-4">
                    {documentAnalysis.keyPoints.map((point, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="mb-1">
                            {point.category}
                          </Badge>
                          <Badge
                            className={
                              point.importance === "high"
                                ? "bg-green-500"
                                : point.importance === "medium"
                                  ? "bg-amber-500"
                                  : "bg-primary/20"
                            }
                          >
                            {point.importance.charAt(0).toUpperCase() + point.importance.slice(1)} Importance
                          </Badge>
                        </div>
                        <p className="text-sm text-primary-foreground mt-1">{point.point}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="issues" className="mt-4 space-y-4">
                    {documentAnalysis.potentialIssues.map((issue, index) => (
                      <div key={index} className="p-3 rounded-lg border border-border bg-card/50 flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-primary-foreground">{issue}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="entities" className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {documentAnalysis.entities.map((entity, index) => (
                        <div key={index} className="p-3 rounded-lg border border-border bg-card/50">
                          <Badge variant="outline" className="mb-1">
                            {entity.role}
                          </Badge>
                          <p className="text-sm font-medium text-primary-foreground">{entity.name}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Analysis
                  </Button>
                  <Button>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Questions
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
              About Document Analysis
            </CardTitle>
            <CardDescription>How our AI analyzes your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Our AI uses advanced OCR to extract text from various document formats
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Natural language processing identifies key information, entities, and terms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    Comparison against standard practices flags potential issues or unusual terms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">
                    AI generates a comprehensive summary and actionable insights
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
              Supported Documents
            </CardTitle>
            <CardDescription>Documents our AI can analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">Purchase and Sale Agreements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">Lease Agreements and Rental Contracts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">Property Inspection Reports</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">Title Reports and Deeds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-primary-foreground">Mortgage and Loan Documents</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
