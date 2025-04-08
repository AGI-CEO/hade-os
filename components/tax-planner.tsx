"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Calculator, Calendar, CheckCircle, AlertTriangle, Download, Plus } from "lucide-react"

// Sample tax data
const taxDeductions = [
  {
    id: 1,
    name: "Mortgage Interest",
    amount: 8400,
    status: "verified",
    category: "interest",
    description: "Interest paid on property mortgages",
  },
  {
    id: 2,
    name: "Property Tax",
    amount: 4200,
    status: "verified",
    category: "tax",
    description: "Annual property taxes paid",
  },
  {
    id: 3,
    name: "Insurance",
    amount: 1800,
    status: "verified",
    category: "insurance",
    description: "Property insurance premiums",
  },
  {
    id: 4,
    name: "Maintenance & Repairs",
    amount: 3600,
    status: "pending",
    category: "maintenance",
    description: "Costs for property upkeep and repairs",
  },
  {
    id: 5,
    name: "Depreciation",
    amount: 10200,
    status: "verified",
    category: "depreciation",
    description: "Annual depreciation of property value",
  },
  {
    id: 6,
    name: "Professional Services",
    amount: 1200,
    status: "pending",
    category: "services",
    description: "Property management and accounting fees",
  },
]

const taxReminders = [
  {
    id: 1,
    title: "Q2 Estimated Tax Payment",
    dueDate: "2023-06-15",
    status: "upcoming",
    description: "Second quarter estimated tax payment due",
  },
  {
    id: 2,
    title: "Property Tax Payment",
    dueDate: "2023-07-31",
    status: "upcoming",
    description: "Annual property tax payment for 123 Main St",
  },
  {
    id: 3,
    title: "Q1 Estimated Tax Payment",
    dueDate: "2023-04-15",
    status: "completed",
    description: "First quarter estimated tax payment",
  },
]

type TaxPlannerProps = {
  timeFrame: "monthly" | "quarterly" | "yearly"
}

export function TaxPlanner({ timeFrame }: TaxPlannerProps) {
  const [selectedDeduction, setSelectedDeduction] = useState<number | null>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate total deductions
  const totalDeductions = taxDeductions.reduce((sum, item) => sum + item.amount, 0)
  const verifiedDeductions = taxDeductions
    .filter((item) => item.status === "verified")
    .reduce((sum, item) => sum + item.amount, 0)

  // Calculate percentage of verified deductions
  const verifiedPercentage = Math.round((verifiedDeductions / totalDeductions) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-primary-foreground">Total Deductions</h3>
            </div>
            <p className="text-2xl font-bold text-primary-foreground">{formatCurrency(totalDeductions)}</p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Verified: {formatCurrency(verifiedDeductions)}</span>
                <span className="text-primary-foreground">{verifiedPercentage}%</span>
              </div>
              <Progress value={verifiedPercentage} className="h-1.5 [&>div]:bg-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-primary-foreground">Tax Documents</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Uploaded</span>
                <span className="text-primary-foreground">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending</span>
                <span className="text-primary-foreground">3</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-primary-foreground">Tax Calendar</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Upcoming Deadlines</span>
                <span className="text-primary-foreground">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Next Deadline</span>
                <span className="text-primary-foreground">Jun 15, 2023</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-4">Tax Deductions</h3>
            <div className="space-y-3">
              {taxDeductions.map((deduction) => (
                <div
                  key={deduction.id}
                  className="p-3 rounded-lg border border-border bg-card/50 cursor-pointer hover:bg-card/70 transition-colors"
                  onClick={() => setSelectedDeduction(deduction.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {deduction.status === "verified" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">{deduction.name}</h4>
                        <p className="text-xs text-muted-foreground">{deduction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-foreground">{formatCurrency(deduction.amount)}</p>
                      <Badge
                        className={
                          deduction.status === "verified"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }
                        variant="outline"
                      >
                        {deduction.status === "verified" ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" />
              Export Tax Report
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-4">Tax Reminders</h3>
            <div className="space-y-3">
              {taxReminders.map((reminder) => (
                <div key={reminder.id} className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-primary-foreground">{reminder.title}</h4>
                      <p className="text-xs text-muted-foreground">{reminder.description}</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">Due: {formatDate(reminder.dueDate)}</span>
                      </div>
                    </div>
                    <Badge className={reminder.status === "completed" ? "bg-green-500" : "bg-amber-500"}>
                      {reminder.status === "completed" ? "Completed" : "Upcoming"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
