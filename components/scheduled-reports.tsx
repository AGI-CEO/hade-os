"use client"

import { useState } from "react"
import { Calendar, Clock, FileText, MoreHorizontal, Settings, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"

// Sample scheduled reports data
const scheduledReports = [
  {
    id: 1,
    name: "Monthly Financial Summary",
    type: "financial",
    frequency: "Monthly",
    nextDate: "2023-06-01",
    format: "PDF",
    recipients: ["you@example.com"],
    active: true,
  },
  {
    id: 2,
    name: "Quarterly Tax Report",
    type: "tax",
    frequency: "Quarterly",
    nextDate: "2023-06-15",
    format: "Excel",
    recipients: ["you@example.com", "accountant@example.com"],
    active: true,
  },
  {
    id: 3,
    name: "Property Maintenance Summary",
    type: "property",
    frequency: "Monthly",
    nextDate: "2023-06-05",
    format: "PDF",
    recipients: ["you@example.com", "manager@example.com"],
    active: true,
  },
  {
    id: 4,
    name: "Tenant Payment Report",
    type: "tenant",
    frequency: "Weekly",
    nextDate: "2023-05-29",
    format: "PDF",
    recipients: ["you@example.com"],
    active: false,
  },
  {
    id: 5,
    name: "Annual Portfolio Review",
    type: "financial",
    frequency: "Yearly",
    nextDate: "2024-01-15",
    format: "PDF",
    recipients: ["you@example.com", "advisor@example.com"],
    active: true,
  },
]

type ScheduledReportsProps = {
  searchQuery: string
}

export function ScheduledReports({ searchQuery }: ScheduledReportsProps) {
  const [reports, setReports] = useState(scheduledReports)

  // Filter reports based on search query
  const filteredReports = reports.filter((report) => {
    return (
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const toggleReportActive = (id: number) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, active: !report.active } : report)))
  }

  return (
    <div className="space-y-4">
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-primary-foreground mb-2">No scheduled reports found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or schedule a new report</p>
          <Button>Schedule New Report</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const daysUntil = getDaysUntil(report.nextDate)
            return (
              <div key={report.id} className="p-4 rounded-lg border border-border bg-card/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary-foreground">{report.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {report.frequency}
                        </Badge>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Next: {formatDate(report.nextDate)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntil <= 0 ? "Today" : `${daysUntil} days`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={report.active} onCheckedChange={() => toggleReportActive(report.id)} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Delete Schedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
