"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

// Define types for the projection data
type ProjectionDataPoint = {
  year: number;
  cashFlow: number;
  equity: number;
  valuation: number;
};

type CurrentStats = {
  totalValue: number;
  monthlyIncome: number;
  equity: number;
  netCashFlow: number;
};

type HistoricalRates = {
  valueGrowth: number;
  incomeGrowth: number;
};

type ProjectionResponse = {
  projectionData: ProjectionDataPoint[];
  currentStats: CurrentStats;
  historicalRates: HistoricalRates;
};

export function FinancialProjections() {
  const [timeScale, setTimeScale] = useState("5Y");
  const [rentIncrease, setRentIncrease] = useState(5);
  const [expenseChange, setExpenseChange] = useState(3);
  const [interestRate, setInterestRate] = useState(6.5);
  const [projectedData, setProjectedData] = useState<ProjectionDataPoint[]>([]);
  const [currentStats, setCurrentStats] = useState<CurrentStats | null>(null);
  const [historicalRates, setHistoricalRates] =
    useState<HistoricalRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch projection data from API
  useEffect(() => {
    const fetchProjections = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = new URL(
          "/api/portfolio/projections",
          window.location.origin
        );
        url.searchParams.append("rentIncrease", rentIncrease.toString());
        url.searchParams.append("expenseChange", expenseChange.toString());
        url.searchParams.append("interestRate", interestRate.toString());
        url.searchParams.append("timeScale", timeScale);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch financial projections");
        }

        const data: ProjectionResponse = await response.json();
        setProjectedData(data.projectionData);
        setCurrentStats(data.currentStats);
        setHistoricalRates(data.historicalRates);
      } catch (err) {
        console.error("Error fetching projections:", err);
        setError("Failed to load financial projections. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
  }, [timeScale, rentIncrease, expenseChange, interestRate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary-foreground glow-text">
            Financial Projections
          </h2>
          <p className="text-muted-foreground">
            Analyze your portfolio's future performance
          </p>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary-foreground">
            5-Year Projection
          </CardTitle>
          <CardDescription>
            Visualize your portfolio's growth over time
          </CardDescription>
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
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <span className="ml-2 text-muted-foreground">
                      Loading projections...
                    </span>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-red-500 mb-2">{error}</p>
                    <Button
                      onClick={() => window.location.reload()}
                      variant="outline"
                      size="sm"
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
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
                        data={projectedData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(var(--border))"
                        />
                        <XAxis
                          dataKey="year"
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          tickFormatter={(value) =>
                            `$${Math.round(value / 1000)}k`
                          }
                          tick={{ fontSize: 12 }}
                          width={45}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend
                          wrapperStyle={{
                            fontSize: "12px",
                            paddingTop: "10px",
                          }}
                          iconSize={8}
                          iconType="circle"
                        />
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
                )}
              </div>
            </TabsContent>

            <TabsContent value="variables" className="space-y-3 pt-0">
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <Label htmlFor="rent-increase">Rent Increase (%)</Label>
                    <span className="text-primary-foreground">
                      {rentIncrease}%
                    </span>
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
                    <span className="text-primary-foreground">
                      {expenseChange}%
                    </span>
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
                    <span className="text-primary-foreground">
                      {interestRate}%
                    </span>
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
            <CardTitle className="text-primary-foreground">
              Cash Flow Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Monthly</span>
                <span className="text-primary-foreground font-medium">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin inline mr-2" />
                  ) : currentStats ? (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(currentStats.monthlyIncome)
                  ) : (
                    "$0"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Projected (1 Year)
                </span>
                <span className="text-primary-foreground font-medium">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin inline mr-2" />
                  ) : projectedData.length > 0 ? (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(projectedData[0].cashFlow / 12)
                  ) : (
                    "$0"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Growth Rate</span>
                <span className="text-green-500 font-medium">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin inline mr-2" />
                  ) : historicalRates ? (
                    `+${historicalRates.incomeGrowth}%`
                  ) : (
                    "+0%"
                  )}
                </span>
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
            <CardTitle className="text-primary-foreground">
              Portfolio Valuation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Value</span>
                <span className="text-primary-foreground font-medium">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin inline mr-2" />
                  ) : currentStats ? (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(currentStats.totalValue)
                  ) : (
                    "$0"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">
                  Projected (5 Years)
                </span>
                <span className="text-primary-foreground font-medium">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin inline mr-2" />
                  ) : projectedData.length > 0 && timeScale === "5Y" ? (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(projectedData[projectedData.length - 1].valuation)
                  ) : (
                    "$0"
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Appreciation</span>
                <span className="text-green-500 font-medium">
                  {loading ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin inline mr-2" />
                  ) : historicalRates ? (
                    `+${historicalRates.valueGrowth}%`
                  ) : (
                    "+0%"
                  )}
                </span>
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
  );
}
