"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"

// Sample investment performance data
const monthlyPerformanceData = [
  { month: "Jan", roi: 0.7, equity: 50000, valuation: 450000 },
  { month: "Feb", roi: 0.7, equity: 51000, valuation: 452000 },
  { month: "Mar", roi: 0.8, equity: 52500, valuation: 455000 },
  { month: "Apr", roi: 0.7, equity: 53500, valuation: 458000 },
  { month: "May", roi: 0.8, equity: 55000, valuation: 462000 },
  { month: "Jun", roi: 0.7, equity: 56500, valuation: 465000 },
]

const quarterlyPerformanceData = [
  { quarter: "Q1", roi: 2.2, equity: 52500, valuation: 455000 },
  { quarter: "Q2", roi: 2.3, equity: 56500, valuation: 465000 },
  { quarter: "Q3", roi: 2.4, equity: 61000, valuation: 475000 },
  { quarter: "Q4", roi: 2.5, equity: 65000, valuation: 485000 },
]

const yearlyPerformanceData = [
  { year: "2020", roi: 7.5, equity: 30000, valuation: 400000 },
  { year: "2021", roi: 8.2, equity: 42000, valuation: 425000 },
  { year: "2022", roi: 8.0, equity: 50000, valuation: 450000 },
  { year: "2023", roi: 8.5, equity: 65000, valuation: 485000 },
]

type InvestmentPerformanceProps = {
  timeFrame: "monthly" | "quarterly" | "yearly"
}

export function InvestmentPerformance({ timeFrame }: InvestmentPerformanceProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  // Select data based on timeFrame
  const performanceData =
    timeFrame === "monthly"
      ? monthlyPerformanceData
      : timeFrame === "quarterly"
        ? quarterlyPerformanceData
        : yearlyPerformanceData

  // Get the x-axis key based on timeFrame
  const xAxisKey = timeFrame === "monthly" ? "month" : timeFrame === "quarterly" ? "quarter" : "year"

  // Calculate current values
  const currentEquity = performanceData[performanceData.length - 1].equity
  const currentValuation = performanceData[performanceData.length - 1].valuation
  const currentROI = performanceData[performanceData.length - 1].roi

  // Calculate changes
  const equityChange = (currentEquity / performanceData[0].equity - 1) * 100
  const valuationChange = (currentValuation / performanceData[0].valuation - 1) * 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Current Equity</p>
              <p className="text-xl font-bold text-primary-foreground">{formatCurrency(currentEquity)}</p>
              <div className="flex items-center text-green-500 text-sm">
                <Badge className="bg-green-500">+{equityChange.toFixed(1)}%</Badge>
                <span className="ml-2">
                  {timeFrame === "monthly" ? "This month" : timeFrame === "quarterly" ? "This quarter" : "This year"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Property Valuation</p>
              <p className="text-xl font-bold text-primary-foreground">{formatCurrency(currentValuation)}</p>
              <div className="flex items-center text-green-500 text-sm">
                <Badge className="bg-green-500">+{valuationChange.toFixed(1)}%</Badge>
                <span className="ml-2">
                  {timeFrame === "monthly" ? "This month" : timeFrame === "quarterly" ? "This quarter" : "This year"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <p className="text-xl font-bold text-primary-foreground">{formatPercentage(currentROI)}</p>
              <div className="flex items-center text-green-500 text-sm">
                <Badge className="bg-green-500">+0.3%</Badge>
                <span className="ml-2">
                  {timeFrame === "monthly"
                    ? "vs last month"
                    : timeFrame === "quarterly"
                      ? "vs last quarter"
                      : "vs last year"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                equity: {
                  label: "Equity",
                  color: "hsl(var(--chart-1))",
                },
                valuation: {
                  label: "Valuation",
                  color: "hsl(var(--chart-2))",
                },
                roi: {
                  label: "ROI",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="equity"
                    stroke="var(--color-equity)"
                    name="Equity"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 1 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="valuation"
                    stroke="var(--color-valuation)"
                    name="Valuation"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 1 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="roi"
                    stroke="var(--color-roi)"
                    name="ROI (%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-3">Investment Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cash on Cash Return</span>
                <span className="text-primary-foreground font-medium">8.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cap Rate</span>
                <span className="text-primary-foreground font-medium">5.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gross Yield</span>
                <span className="text-primary-foreground font-medium">7.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Net Yield</span>
                <span className="text-primary-foreground font-medium">4.9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-3">Property Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">123 Main St, Austin</span>
                <Badge className="bg-green-500">+9.2% ROI</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">456 Oak Ave, San Antonio</span>
                <Badge className="bg-amber-500">+6.5% ROI</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">789 Pine Blvd, Houston</span>
                <Badge className="bg-green-500">+8.7% ROI</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
