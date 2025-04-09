"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, BarChart2, Calendar, Filter, Plus, Clock, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ReportsList } from "@/components/reports-list"
import { ReportBuilder } from "@/components/report-builder"
import { ScheduledReports } from "@/components/scheduled-reports"
import { ReportTemplates } from "@/components/report-templates"

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateReport, setShowCreateReport] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">Reports</h1>
        <p className="text-muted-foreground">Generate, schedule, and analyze detailed reports for your portfolio</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9 bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setShowCreateReport(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="recent" className="mt-0">
                <ReportsList searchQuery={searchQuery} />
              </TabsContent>
            </motion.div>

            <motion.div
              key="scheduled"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="scheduled" className="mt-0">
                <ScheduledReports searchQuery={searchQuery} />
              </TabsContent>
            </motion.div>

            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="templates" className="mt-0">
                <ReportTemplates searchQuery={searchQuery} />
              </TabsContent>
            </motion.div>

            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="builder" className="mt-0">
                <ReportBuilder />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Report Analytics
            </CardTitle>
            <CardDescription>Insights from your most viewed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Reports</div>
                  <div className="text-2xl font-bold text-primary-foreground">24</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Generated This Month</div>
                  <div className="text-2xl font-bold text-primary-foreground">12</div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/50">
                  <div className="text-sm text-muted-foreground mb-1">Scheduled Reports</div>
                  <div className="text-2xl font-bold text-primary-foreground">5</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary-foreground">Most Viewed Reports</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Monthly Financial Summary</h4>
                        <p className="text-xs text-muted-foreground">Last generated: May 1, 2023</p>
                      </div>
                    </div>
                    <Badge className="bg-primary">32 views</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Property Performance</h4>
                        <p className="text-xs text-muted-foreground">Last generated: Apr 15, 2023</p>
                      </div>
                    </div>
                    <Badge className="bg-primary">28 views</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-primary-foreground">Tenant Payment History</h4>
                        <p className="text-xs text-muted-foreground">Last generated: Apr 30, 2023</p>
                      </div>
                    </div>
                    <Badge className="bg-primary">21 views</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Upcoming Reports
            </CardTitle>
            <CardDescription>Scheduled reports due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-primary-foreground">Monthly Financial Summary</h4>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Clock className="mr-1 h-3 w-3" />2 days
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Scheduled for June 1, 2023</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" className="w-full">
                    <FileText className="mr-2 h-3 w-3" />
                    Generate Now
                  </Button>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-primary-foreground">Quarterly Tax Report</h4>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Clock className="mr-1 h-3 w-3" />
                    15 days
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Scheduled for June 15, 2023</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button size="sm" className="w-full">
                    <FileText className="mr-2 h-3 w-3" />
                    Generate Now
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showCreateReport && <CreateReportModal onClose={() => setShowCreateReport(false)} />}
      </AnimatePresence>
    </div>
  )
}

function CreateReportModal({ onClose }: { onClose: () => void }) {
  const [reportType, setReportType] = useState<"financial" | "property" | "tenant" | "tax">("financial")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4">Create New Report</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Report Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className={`p-3 rounded-lg border ${
                    reportType === "financial"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-card/70"
                  }`}
                  onClick={() => setReportType("financial")}
                >
                  <BarChart2 className="h-5 w-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Financial</div>
                </button>
                <button
                  className={`p-3 rounded-lg border ${
                    reportType === "property"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-card/70"
                  }`}
                  onClick={() => setReportType("property")}
                >
                  <FileText className="h-5 w-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Property</div>
                </button>
                <button
                  className={`p-3 rounded-lg border ${
                    reportType === "tenant"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-card/70"
                  }`}
                  onClick={() => setReportType("tenant")}
                >
                  <FileText className="h-5 w-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Tenant</div>
                </button>
                <button
                  className={`p-3 rounded-lg border ${
                    reportType === "tax"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-card/70"
                  }`}
                  onClick={() => setReportType("tax")}
                >
                  <FileText className="h-5 w-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Tax</div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Report Name</label>
              <Input placeholder="Enter report name" className="bg-card border-border" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Time Period</label>
              <div className="grid grid-cols-3 gap-2">
                <button className="p-2 rounded-lg border border-primary bg-primary/10 text-primary text-sm">
                  Monthly
                </button>
                <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-card/70 text-sm">
                  Quarterly
                </button>
                <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-card/70 text-sm">
                  Yearly
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Properties</label>
              <select className="w-full h-10 px-3 rounded-md border border-border bg-card text-primary-foreground">
                <option>All Properties</option>
                <option>123 Main St, Austin, TX</option>
                <option>456 Oak Ave, San Antonio, TX</option>
                <option>789 Pine Blvd, Houston, TX</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Format</label>
              <div className="grid grid-cols-3 gap-2">
                <button className="p-2 rounded-lg border border-primary bg-primary/10 text-primary text-sm flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </button>
                <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-card/70 text-sm flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Excel
                </button>
                <button className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-card/70 text-sm flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-1" />
                  CSV
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="schedule-report"
                  className="h-4 w-4 rounded border-border bg-card text-primary focus:ring-primary"
                />
                <label htmlFor="schedule-report" className="ml-2 text-sm font-medium text-primary-foreground">
                  Schedule this report
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Advanced Options
              </Button>
              <Button>Generate Report</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
