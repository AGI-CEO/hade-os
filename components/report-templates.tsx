"use client"

import { motion } from "framer-motion"
import { FileText, BarChart2, Users, Home, FileBarChart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample report templates data
const reportTemplates = [
  {
    id: 1,
    name: "Monthly Financial Summary",
    type: "financial",
    description: "Overview of income, expenses, and cash flow for the month",
    popularity: "high",
  },
  {
    id: 2,
    name: "Property Performance",
    type: "property",
    description: "Detailed analysis of property value, ROI, and occupancy rates",
    popularity: "high",
  },
  {
    id: 3,
    name: "Tenant Payment History",
    type: "tenant",
    description: "Track tenant payment records, late fees, and outstanding balances",
    popularity: "medium",
  },
  {
    id: 4,
    name: "Tax Preparation",
    type: "tax",
    description: "Summary of tax deductions, expenses, and documentation for tax filing",
    popularity: "high",
  },
  {
    id: 5,
    name: "Maintenance Cost Analysis",
    type: "property",
    description: "Breakdown of maintenance costs by property and category",
    popularity: "medium",
  },
  {
    id: 6,
    name: "Cash Flow Projection",
    type: "financial",
    description: "Forecast future cash flow based on historical data and trends",
    popularity: "medium",
  },
  {
    id: 7,
    name: "Tenant Satisfaction Survey",
    type: "tenant",
    description: "Analysis of tenant feedback and satisfaction metrics",
    popularity: "low",
  },
  {
    id: 8,
    name: "Portfolio Growth",
    type: "financial",
    description: "Track portfolio value growth, equity accumulation, and appreciation",
    popularity: "medium",
  },
]

type ReportTemplatesProps = {
  searchQuery: string
}

export function ReportTemplates({ searchQuery }: ReportTemplatesProps) {
  // Filter templates based on search query
  const filteredTemplates = reportTemplates.filter((template) => {
    return (
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getTemplateIcon = (type: string) => {
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

  const getPopularityBadge = (popularity: string) => {
    switch (popularity) {
      case "high":
        return <Badge className="bg-green-500">Popular</Badge>
      case "medium":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            Common
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-primary-foreground mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or create a custom template</p>
          <Button>Create Custom Template</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-4 rounded-lg border border-border bg-card/50 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getTemplateIcon(template.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-primary-foreground">{template.name}</h3>
                      {getPopularityBadge(template.popularity)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </div>
                </div>
              </div>
              <Button size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Use Template
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
