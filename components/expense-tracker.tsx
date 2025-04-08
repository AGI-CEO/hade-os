"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  PieChart as RechartsePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { Badge } from "@/components/ui/badge"

// Sample expense data
const monthlyExpenseData = [
  { name: "Mortgage", value: 1200, percent: 42.9 },
  { name: "Property Tax", value: 350, percent: 12.5 },
  { name: "Insurance", value: 150, percent: 5.4 },
  { name: "Maintenance", value: 300, percent: 10.7 },
  { name: "Utilities", value: 200, percent: 7.1 },
  { name: "Property Management", value: 250, percent: 8.9 },
  { name: "Other", value: 350, percent: 12.5 },
]

const monthlyExpenseByPropertyData = [
  {
    name: "123 Main St",
    mortgage: 800,
    tax: 200,
    insurance: 100,
    maintenance: 150,
    utilities: 100,
    management: 150,
    other: 200,
  },
  {
    name: "456 Oak Ave",
    mortgage: 400,
    tax: 150,
    insurance: 50,
    maintenance: 150,
    utilities: 100,
    management: 100,
    other: 150,
  },
]

const quarterlyExpenseData = [
  { name: "Mortgage", value: 3600, percent: 42.1 },
  { name: "Property Tax", value: 1050, percent: 12.3 },
  { name: "Insurance", value: 450, percent: 5.3 },
  { name: "Maintenance", value: 950, percent: 11.1 },
  { name: "Utilities", value: 600, percent: 7.0 },
  { name: "Property Management", value: 750, percent: 8.8 },
  { name: "Other", value: 1150, percent: 13.4 },
]

const yearlyExpenseData = [
  { name: "Mortgage", value: 14400, percent: 42.9 },
  { name: "Property Tax", value: 4200, percent: 12.5 },
  { name: "Insurance", value: 1800, percent: 5.4 },
  { name: "Maintenance", value: 3600, percent: 10.7 },
  { name: "Utilities", value: 2400, percent: 7.1 },
  { name: "Property Management", value: 3000, percent: 8.9 },
  { name: "Other", value: 4200, percent: 12.5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFCC00"]

type ExpenseTrackerProps = {
  timeFrame: "monthly" | "quarterly" | "yearly"
}

export function ExpenseTracker({ timeFrame }: ExpenseTrackerProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Select data based on timeFrame
  const expenseData =
    timeFrame === "monthly" ? monthlyExpenseData : timeFrame === "quarterly" ? quarterlyExpenseData : yearlyExpenseData

  // Calculate total expenses
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-4">Expense Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsePieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${percent.toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </RechartsePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-4">Expense Details</h3>
            <div className="space-y-4">
              {expenseData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-primary-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary-foreground">{formatCurrency(item.value)}</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {item.percent}%
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <span className="font-medium text-primary-foreground">Total</span>
                <span className="font-medium text-primary-foreground">{formatCurrency(totalExpenses)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-primary-foreground mb-4">Expenses by Property</h3>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                mortgage: {
                  label: "Mortgage",
                  color: COLORS[0],
                },
                tax: {
                  label: "Property Tax",
                  color: COLORS[1],
                },
                insurance: {
                  label: "Insurance",
                  color: COLORS[2],
                },
                maintenance: {
                  label: "Maintenance",
                  color: COLORS[3],
                },
                utilities: {
                  label: "Utilities",
                  color: COLORS[4],
                },
                management: {
                  label: "Management",
                  color: COLORS[5],
                },
                other: {
                  label: "Other",
                  color: COLORS[6],
                },
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExpenseByPropertyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="mortgage" stackId="a" fill={COLORS[0]} name="Mortgage" />
                  <Bar dataKey="tax" stackId="a" fill={COLORS[1]} name="Property Tax" />
                  <Bar dataKey="insurance" stackId="a" fill={COLORS[2]} name="Insurance" />
                  <Bar dataKey="maintenance" stackId="a" fill={COLORS[3]} name="Maintenance" />
                  <Bar dataKey="utilities" stackId="a" fill={COLORS[4]} name="Utilities" />
                  <Bar dataKey="management" stackId="a" fill={COLORS[5]} name="Management" />
                  <Bar dataKey="other" stackId="a" fill={COLORS[6]} name="Other" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
