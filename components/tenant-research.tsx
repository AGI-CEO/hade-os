"use client"

import { useState } from "react"
import { UserPlus, Upload, CheckCircle, AlertTriangle, XCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function TenantResearch() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<null | {
    score: number
    recommendation: "approve" | "review" | "reject"
    credit: number
    rentalHistory: "good" | "average" | "poor"
    background: "clear" | "flags"
  }>(null)

  const runCheck = () => {
    setIsRunning(true)
    setProgress(0)
    setResult(null)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          // Simulate result
          setResult({
            score: 78,
            recommendation: "review",
            credit: 680,
            rentalHistory: "good",
            background: "clear",
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-border bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-primary-foreground">AI Tenant Screening</h3>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Premium
          </Badge>
        </div>

        {!isRunning && !result && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Applicant Name</label>
              <Input placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Email</label>
              <Input type="email" placeholder="Enter email address" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
              <Button onClick={runCheck} className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Run Check
              </Button>
            </div>
          </div>
        )}

        {isRunning && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Analyzing applicant data...</span>
                <span className="text-primary-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 [&>div]:bg-primary" />
            </div>
            <div className="text-sm text-muted-foreground">
              {progress < 30 && "Checking credit score..."}
              {progress >= 30 && progress < 60 && "Verifying rental history..."}
              {progress >= 60 && progress < 90 && "Running background check..."}
              {progress >= 90 && "Generating recommendation..."}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor:
                      result.recommendation === "approve"
                        ? "rgba(34, 197, 94, 0.1)"
                        : result.recommendation === "review"
                          ? "rgba(234, 179, 8, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                    color:
                      result.recommendation === "approve"
                        ? "rgb(34, 197, 94)"
                        : result.recommendation === "review"
                          ? "rgb(234, 179, 8)"
                          : "rgb(239, 68, 68)",
                  }}
                >
                  {result.recommendation === "approve" ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : result.recommendation === "review" ? (
                    <AlertTriangle className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-foreground">{result.score}</h3>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                </div>
              </div>
              <Badge
                className={
                  result.recommendation === "approve"
                    ? "bg-green-500"
                    : result.recommendation === "review"
                      ? "bg-amber-500"
                      : "bg-red-500"
                }
              >
                {result.recommendation === "approve"
                  ? "Approve"
                  : result.recommendation === "review"
                    ? "Review"
                    : "Reject"}
              </Badge>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Credit Score</span>
                <span className="text-sm font-medium text-primary-foreground">{result.credit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rental History</span>
                <span className="text-sm font-medium text-primary-foreground capitalize">{result.rentalHistory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Background Check</span>
                <span className="text-sm font-medium text-primary-foreground capitalize">{result.background}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">
                <Lock className="mr-2 h-4 w-4" />
                Full Report
              </Button>
              <Button className="flex-1">Save Results</Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Powered by AI Tenant Research.{" "}
          <a href="#" className="text-primary underline">
            Upgrade
          </a>{" "}
          for unlimited checks.
        </p>
      </div>
    </div>
  )
}
