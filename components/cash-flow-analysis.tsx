"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts"
import { Badge } from "@/components/ui/badge"

// Sample cash flow data
const monthlyCashFlowData = [
  { name: "Jan", income: 4500, expenses: 2700, cashFlow: 1800 },
  { name: "Feb", income: 4500, expenses: 2800, cashFlow: 1700 },
  { name: "Mar", income: 4700, expenses: 2750, cashFlow: 1950 },
  { name: "Apr", income: 4700, expenses: 2900, cashFlow: 1800 },
  { name: "May", income: 4700, expenses: 2800, cashFlow: 1900 },
  { name: "Jun", income: 4700, expenses: 2850, cashFlow: 1850 },
]

const quarterlyCashFlowData = [
  { name: "Q1", income: 13700, expenses: 8250, cashFlow: 5450 },
  { name: "Q2", income: 14100, expenses: 8550, cashFlow: 5550 },
  { name: "Q3", income: 14300, expenses: 8650, cashFlow: 5650 },
  { name: "Q4", income: 14500, expenses: 8750, cashFlow: 5750 },
]

const yearlyCashFlowData = [
  { name: "2020", income: 48000, expenses: 30000, cashFlow: 18000 },
  { name: "2021", income: 52000, expenses: 32000, cashFlow: 20000 },
  { name: "2022", income: 54000, expenses: 33000, cashFlow: 21000 },
  { name: "2023", income: 56600, expenses: 33600, cashFlow: 23000 },
]

type CashFlowAnalysisProps = {
  timeFrame: "monthly" | "quarterly" | "yearly"
}

export function CashFlowAnalysis({ timeFrame }: CashFlowAnalysisProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Select data based on timeFrame
  const data =
    timeFrame === "monthly"
      ? monthlyCashFlowData
      : timeFrame === "quarterly"
        ? quarterlyCashFlowData
        : yearlyCashFlowData

  // Calculate totals
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0)
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0)
  const totalCashFlow = data.reduce((sum, item) => sum + item.cashFlow, 0)

  // Calculate averages
  const avgIncome = totalIncome / data.length
  const avgExpenses = totalExpenses / data.length
  const avgCashFlow = totalCashFlow / data.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-xl font-bold text-primary-foreground">{formatCurrency(totalIncome)}</p>
              </div>
              <Badge className="bg-green-500">
                +{Math.round((data[data.length - 1].income / data[0].income - 1) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold text-primary-foreground">{formatCurrency(totalExpenses)}</p>
              </div>
              <Badge className="bg-red-500">
                +{Math.round((data[data.length - 1].expenses / data[0].expenses - 1) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                <p className="text-xl font-bold text-primary-foreground">{formatCurrency(totalCashFlow)}</p>
              </div>
              <Badge className="bg-primary">
                +{Math.round((data[data.length - 1].cashFlow / data[0].cashFlow - 1) * 100)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="h-[400px]">
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "hsl(var(--chart-1))",
                },
                expenses: {
                  label: "Expenses",
                  color: "hsl(var(--chart-2))",
                },
                cashFlow: {
                  label: "Cash Flow",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="income" fill="var(--color-income)" name="Income" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="var(--color-expenses)" name="Expenses" radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="cashFlow"
                    stroke="var(--color-cashFlow)"
                    name="Cash Flow"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 1 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Income</p>
              <p className="text-xl font-bold text-primary-foreground">{formatCurrency(avgIncome)}</p>
              <p className="text-xs text-muted-foreground">
                Per {timeFrame === "monthly" ? "month" : timeFrame === "quarterly" ? "quarter" : "year"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Expenses</p>
              <p className="text-xl font-bold text-primary-foreground">{formatCurrency(avgExpenses)}</p>
              <p className="text-xs text-muted-foreground">
                Per {timeFrame === "monthly" ? "month" : timeFrame === "quarterly" ? "quarter" : "year"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Cash Flow</p>
              <p className="text-xl font-bold text-primary-foreground">{formatCurrency(avgCashFlow)}</p>
              <p className="text-xs text-muted-foreground">
                Per {timeFrame === "monthly" ? "month" : timeFrame === "quarterly" ? "quarter" : "year"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
