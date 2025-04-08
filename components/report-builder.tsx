"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { FileText, GripVertical, X, Plus, Save, Eye, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Sample report sections
const availableSections = [
  {
    id: "financial-summary",
    name: "Financial Summary",
    description: "Overview of key financial metrics",
    type: "chart",
  },
  {
    id: "property-list",
    name: "Property List",
    description: "List of all properties with details",
    type: "table",
  },
  {
    id: "income-breakdown",
    name: "Income Breakdown",
    description: "Detailed breakdown of income sources",
    type: "chart",
  },
  {
    id: "expense-breakdown",
    name: "Expense Breakdown",
    description: "Detailed breakdown of expenses",
    type: "chart",
  },
  {
    id: "cash-flow-analysis",
    name: "Cash Flow Analysis",
    description: "Analysis of cash flow over time",
    type: "chart",
  },
  {
    id: "tenant-summary",
    name: "Tenant Summary",
    description: "Overview of tenant information",
    type: "table",
  },
  {
    id: "maintenance-records",
    name: "Maintenance Records",
    description: "History of maintenance activities",
    type: "table",
  },
  {
    id: "tax-deductions",
    name: "Tax Deductions",
    description: "Summary of tax deductible expenses",
    type: "table",
  },
]

export function ReportBuilder() {
  const [reportName, setReportName] = useState("Custom Report")
  const [selectedSections, setSelectedSections] = useState<typeof availableSections>([])

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    if (result.source.droppableId === "available" && result.destination.droppableId === "selected") {
      // Add section from available to selected
      const section = availableSections.find((s) => s.id === result.draggableId)
      if (section && !selectedSections.some((s) => s.id === section.id)) {
        setSelectedSections([...selectedSections, section])
      }
    } else if (result.source.droppableId === "selected" && result.destination.droppableId === "selected") {
      // Reorder within selected
      const items = Array.from(selectedSections)
      const [reorderedItem] = items.splice(result.source.index, 1)
      items.splice(result.destination.index, 0, reorderedItem)
      setSelectedSections(items)
    }
  }

  const removeSection = (id: string) => {
    setSelectedSections(selectedSections.filter((section) => section.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary-foreground">Report Name</label>
          <Input
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="bg-card border-border max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
          <Button>
            <Eye className="mr-2 h-4 w-4" />
            Preview Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-primary-foreground mb-4">Available Sections</h3>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="available">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {availableSections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-3 rounded-lg border border-border bg-card/50 cursor-move"
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <h4 className="font-medium text-primary-foreground">{section.name}</h4>
                                  <p className="text-xs text-muted-foreground">{section.description}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium text-primary-foreground mb-4">Report Structure</h3>
              {selectedSections.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-primary-foreground mb-2">No sections added</h3>
                  <p className="text-muted-foreground mb-4">Drag sections from the left to build your report</p>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="selected">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                        {selectedSections.map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="p-4 rounded-lg border border-border bg-card/50"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-3">
                                    <div {...provided.dragHandleProps} className="cursor-move">
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-primary-foreground">{section.name}</h4>
                                      <p className="text-xs text-muted-foreground">{section.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => removeSection(section.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Section preview placeholder */}
                                <div className="mt-3 p-3 rounded bg-background/50 min-h-[100px] flex items-center justify-center">
                                  <p className="text-sm text-muted-foreground">
                                    {section.type === "chart" ? "Chart Preview" : "Table Preview"}
                                  </p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <div className="space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Report Settings
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>
    </div>
  )
}
