"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"

// Sample projection data
const initialData = [
  { year: 2023, cashFlow: 12000, equity: 50000, valuation: 450000 },
  { year: 2024, cashFlow: 12600, equity: 65000, valuation: 472500 },
  { year: 2025, cashFlow: 13230, equity: 81000, valuation: 496125 },
  { year: 2026, cashFlow: 13892, equity: 98000, valuation: 520931 },
  { year: 2027, cashFlow: 14586, equity: 116000, valuation: 546978 },
  { year: 2028, cashFlow: 15315, equity: 135000, valuation: 574327 },
]

export function FinancialProjections() {
  const [timeScale, setTimeScale] = useState("5Y")
  const [rentIncrease, setRentIncrease] = useState(5)
  const [expenseChange, setExpenseChange] = useState(3)
  const [interestRate, setInterestRate] = useState(6.5)

  // Calculate projected data based on sliders
  const calculateProjections = () => {
    return initialData.map((item) => {
      const yearsSince2023 = item.year - 2023
      const rentFactor = Math.pow(1 + rentIncrease / 100, yearsSince2023)
      const expenseFactor = Math.pow(1 + expenseChange / 100, yearsSince2023)

      return {
        ...item,
        cashFlow: Math.round(12000 * rentFactor - 7200 * expenseFactor),
        equity: Math.round(50000 + yearsSince2023 * 16000 + (yearsSince2023 * 1000 * (10 - interestRate)) / 3),
        valuation: Math.round(450000 * Math.pow(1 + (5 + (rentIncrease - expenseChange) / 10) / 100, yearsSince2023)),
      }
    })
  }

  const projectedData = calculateProjections()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground glow-text">Financial Projections</h2>
          <p className="text-muted-foreground">Analyze your portfolio's future performance</p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary-foreground">5-Year Projection</CardTitle>
          <CardDescription>Visualize your portfolio's growth over time</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="chart" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>

            <TabsContent value="chart" className="space-y-2">
              <div className="grid grid-cols-4 gap-1">
                <Button
                  variant={timeScale === "1Y" ? "default" : "outline"}
                  onClick={() => setTimeScale("1Y")}
                  size="sm"
                  className="h-8 text-xs"
                >
                  1Y
                </Button>
                <Button
                  variant={timeScale === "3Y" ? "default" : "outline"}
                  onClick={() => setTimeScale("3Y")}
                  size="sm"
                  className="h-8 text-xs"
                >
                  3Y
                </Button>
                <Button
                  variant={timeScale === "5Y" ? "default" : "outline"}
                  onClick={() => setTimeScale("5Y")}
                  size="sm"
                  className="h-8 text-xs"
                >
                  5Y
                </Button>
                <Button
                  variant={timeScale === "10Y" ? "default" : "outline"}
                  onClick={() => setTimeScale("10Y")}
                  size="sm"
                  className="h-8 text-xs"
                >
                  10Y
                </Button>
              </div>

              <div className="w-full" style={{ height: "400px" }}>
                <ChartContainer
                  config={{
                    cashFlow: {
                      label: "Cash Flow",
                      color: "hsl(var(--chart-1))",
                    },
                    equity: {
                      label: "Equity",
                      color: "hsl(var(--chart-2))",
                    },
                    valuation: {
                      label: "Valuation",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="w-full h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={projectedData.slice(0, timeScale === "1Y" ? 2 : timeScale === "3Y" ? 4 : 6)}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 12 }} />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                        tick={{ fontSize: 12 }}
                        width={45}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} iconSize={8} iconType="circle" />
                      <Line
                        type="monotone"
                        dataKey="cashFlow"
                        stroke="var(--color-cashFlow)"
                        name="Cash Flow"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 1 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="equity"
                        stroke="var(--color-equity)"
                        name="Equity"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 1 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="valuation"
                        stroke="var(--color-valuation)"
                        name="Valuation"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </TabsContent>

            <TabsContent value="variables" className="space-y-3 pt-0">
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label htmlFor="rent-increase">Rent Increase (%)</Label>
                    <span className="text-primary-foreground">{rentIncrease}%</span>
                  </div>
                  <Slider
                    id="rent-increase"
                    min={0}
                    max={10}
                    step={0.5}
                    value={[rentIncrease]}
                    onValueChange={(value) => setRentIncrease(value[0])}
                    className="[&>span]:bg-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label htmlFor="expense-change">Expense Change (%)</Label>
                    <span className="text-primary-foreground">{expenseChange}%</span>
                  </div>
                  <Slider
                    id="expense-change"
                    min={-5}
                    max={10}
                    step={0.5}
                    value={[expenseChange]}
                    onValueChange={(value) => setExpenseChange(value[0])}
                    className="[&>span]:bg-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <span className="text-primary-foreground">{interestRate}%</span>
                  </div>
                  <Slider
                    id="interest-rate"
                    min={3}
                    max={10}
                    step={0.1}
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    className="[&>span]:bg-primary"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  Save Scenario
                </Button>
                <Button size="sm">Compare Scenarios</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Monthly</span>
                <span className="text-primary-foreground font-medium">$4,700</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Projected (1 Year)</span>
                <span className="text-primary-foreground font-medium">$5,100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Growth Rate</span>
                <span className="text-green-500 font-medium">+8.5%</span>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  View Detailed Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Portfolio Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Value</span>
                <span className="text-primary-foreground font-medium">$1,280,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Projected (5 Years)</span>
                <span className="text-primary-foreground font-medium">$1,617,430</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Appreciation</span>
                <span className="text-green-500 font-medium">+26.4%</span>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Run Valuation Model
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
