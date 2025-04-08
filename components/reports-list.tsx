"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Download,
  Share2,
  Printer,
  Mail,
  MoreHorizontal,
  X,
  Eye,
  BarChart2,
  Users,
  Home,
  FileBarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample reports data
const reports = [
  {
    id: 1,
    name: "Monthly Financial Summary",
    type: "financial",
    date: "2023-05-01",
    format: "PDF",
    size: "1.2 MB",
    views: 32,
    shared: true,
  },
  {
    id: 2,
    name: "Property Performance Report",
    type: "property",
    date: "2023-04-15",
    format: "Excel",
    size: "3.5 MB",
    views: 28,
    shared: false,
  },
  {
    id: 3,
    name: "Tenant Payment History",
    type: "tenant",
    date: "2023-04-30",
    format: "PDF",
    size: "0.8 MB",
    views: 21,
    shared: true,
  },
  {
    id: 4,
    name: "Q1 Tax Preparation",
    type: "tax",
    date: "2023-04-10",
    format: "PDF",
    size: "2.1 MB",
    views: 15,
    shared: false,
  },
  {
    id: 5,
    name: "Annual Portfolio Review",
    type: "financial",
    date: "2023-01-15",
    format: "PDF",
    size: "4.3 MB",
    views: 42,
    shared: true,
  },
  {
    id: 6,
    name: "Maintenance Cost Analysis",
    type: "property",
    date: "2023-03-22",
    format: "Excel",
    size: "1.8 MB",
    views: 18,
    shared: false,
  },
]

type ReportsListProps = {
  searchQuery: string
}

export function ReportsList({ searchQuery }: ReportsListProps) {
  const [selectedReport, setSelectedReport] = useState<number | null>(null)

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

  const getReportIcon = (type: string) => {
    switch (type) {
      case "financial":
        return <BarChart2 className="h-5 w-5 text-primary" />
      case "property":
        return <Home className="h-5 w-5 text-primary" />
      case "tenant":
        return <Users className="h-5 w-5 text-primary" />
      case "tax":
        return <FileBarChart className="h-5 w-5 text-primary" />
      default:
        return <FileText className="h-5 w-5 text-primary" />
    }
  }

  const report = selectedReport ? reports.find((r) => r.id === selectedReport) : null

  return (
    <div className="space-y-4">
      {filteredReports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-primary-foreground mb-2">No reports found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or create a new report</p>
          <Button>Create New Report</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((report) => (
            <motion.div
              key={report.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50 cursor-pointer"
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getReportIcon(report.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-primary-foreground">{report.name}</h3>
                    <p className="text-xs text-muted-foreground">Generated: {formatDate(report.date)}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedReport(report.id)
                      }}
                    >
                      View Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Download</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Share</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Print</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {report.format}
                  </Badge>
                  <span>{report.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {report.views}
                  </div>
                  {report.shared && <Share2 className="h-3 w-3" />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
            >
              {report && (
                <>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {getReportIcon(report.type)}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-primary-foreground">{report.name}</h2>
                          <p className="text-muted-foreground">
                            Generated: {formatDate(report.date)} • {report.format} • {report.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </Button>
                    </div>

                    {/* Report preview placeholder */}
                    <div className="bg-card/30 border border-border rounded-lg p-6 min-h-[500px] flex flex-col items-center justify-center">
                      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-primary-foreground mb-2">Report Preview</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-6">
                        This is a preview of the {report.name}. The full report contains detailed analytics and insights
                        about your portfolio.
                      </p>
                      <Button>
                        <Eye className="mr-2 h-4 w-4" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
