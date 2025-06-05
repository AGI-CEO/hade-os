"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

// Define types for cash flow data
type CashFlowDataPoint = {
  name: string;
  income: number;
  expenses: number;
  cashFlow: number;
};

type CashFlowAnalysisProps = {
  timeFrame: "monthly" | "quarterly" | "yearly";
};

export function CashFlowAnalysis({ timeFrame }: CashFlowAnalysisProps) {
  const [data, setData] = useState<CashFlowDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalCashFlow, setTotalCashFlow] = useState(0);
  const [incomeChange, setIncomeChange] = useState(0);
  const [expensesChange, setExpensesChange] = useState(0);
  const [cashFlowChange, setCashFlowChange] = useState(0);

  useEffect(() => {
    const fetchCashFlowData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine period parameter based on timeFrame
        const period = timeFrame;

        // Fetch financial summary data
        const response = await fetch(
          `/api/portfolio/financial-summary?period=${period}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch cash flow data");
        }

        const summaryData = await response.json();

        // Extract time series data
        const timeSeriesData = summaryData.timeSeriesData || [];

        // Transform data for chart
        const transformedData = timeSeriesData.map((item: any) => ({
          name: item.name,
          income: item.income,
          expenses: item.expenses,
          cashFlow: item.cashFlow,
        }));

        setData(transformedData);

        // Calculate totals
        const totalInc = transformedData.reduce(
          (sum: number, item: CashFlowDataPoint) => sum + item.income,
          0
        );
        const totalExp = transformedData.reduce(
          (sum: number, item: CashFlowDataPoint) => sum + item.expenses,
          0
        );
        const totalCF = transformedData.reduce(
          (sum: number, item: CashFlowDataPoint) => sum + item.cashFlow,
          0
        );

        setTotalIncome(totalInc);
        setTotalExpenses(totalExp);
        setTotalCashFlow(totalCF);

        // Calculate percentage changes if we have data
        if (transformedData.length > 1) {
          const firstItem = transformedData[0];
          const lastItem = transformedData[transformedData.length - 1];

          const incChange =
            firstItem.income > 0
              ? Math.round(
                  ((lastItem.income - firstItem.income) / firstItem.income) *
                    100
                )
              : 0;

          const expChange =
            firstItem.expenses > 0
              ? Math.round(
                  ((lastItem.expenses - firstItem.expenses) /
                    firstItem.expenses) *
                    100
                )
              : 0;

          const cfChange =
            firstItem.cashFlow > 0
              ? Math.round(
                  ((lastItem.cashFlow - firstItem.cashFlow) /
                    firstItem.cashFlow) *
                    100
                )
              : 0;

          setIncomeChange(incChange);
          setExpensesChange(expChange);
          setCashFlowChange(cfChange);
        } else {
          // Use summary data if available
          setIncomeChange(summaryData.summary?.incomeChangePercent || 0);
          setExpensesChange(summaryData.summary?.expensesChangePercent || 0);
          setCashFlowChange(summaryData.summary?.cashFlowChangePercent || 0);
        }
      } catch (err) {
        console.error("Error fetching cash flow data:", err);
        setError("Failed to load cash flow data");

        // Set fallback data
        setData([]);
        setTotalIncome(0);
        setTotalExpenses(0);
        setTotalCashFlow(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCashFlowData();
  }, [timeFrame]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate averages
  const avgIncome = data.length > 0 ? totalIncome / data.length : 0;
  const avgExpenses = data.length > 0 ? totalExpenses / data.length : 0;
  const avgCashFlow = data.length > 0 ? totalCashFlow / data.length : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg border border-border bg-card/50 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-border bg-card/50 text-center">
        <p className="text-muted-foreground mb-2">
          No financial data available for this time period
        </p>
        <p className="text-sm text-muted-foreground">
          Try adding some income and expense transactions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-xl font-bold text-primary-foreground">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <Badge
                className={incomeChange >= 0 ? "bg-green-500" : "bg-red-500"}
              >
                {incomeChange >= 0 ? "+" : ""}
                {incomeChange}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-xl font-bold text-primary-foreground">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <Badge
                className={expensesChange >= 0 ? "bg-red-500" : "bg-green-500"}
              >
                {expensesChange >= 0 ? "+" : ""}
                {expensesChange}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Net Cash Flow</p>
                <p className="text-xl font-bold text-primary-foreground">
                  {formatCurrency(totalCashFlow)}
                </p>
              </div>
              <Badge
                className={cashFlowChange >= 0 ? "bg-primary" : "bg-red-500"}
              >
                {cashFlowChange >= 0 ? "+" : ""}
                {cashFlowChange}%
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
                <ComposedChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="income"
                    fill="var(--color-income)"
                    name="Income"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    fill="var(--color-expenses)"
                    name="Expenses"
                    radius={[4, 4, 0, 0]}
                  />
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
              <p className="text-xl font-bold text-primary-foreground">
                {formatCurrency(avgIncome)}
              </p>
              <p className="text-xs text-muted-foreground">
                Per{" "}
                {timeFrame === "monthly"
                  ? "month"
                  : timeFrame === "quarterly"
                  ? "quarter"
                  : "year"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Expenses</p>
              <p className="text-xl font-bold text-primary-foreground">
                {formatCurrency(avgExpenses)}
              </p>
              <p className="text-xs text-muted-foreground">
                Per{" "}
                {timeFrame === "monthly"
                  ? "month"
                  : timeFrame === "quarterly"
                  ? "quarter"
                  : "year"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Cash Flow</p>
              <p className="text-xl font-bold text-primary-foreground">
                {formatCurrency(avgCashFlow)}
              </p>
              <p className="text-xs text-muted-foreground">
                Per{" "}
                {timeFrame === "monthly"
                  ? "month"
                  : timeFrame === "quarterly"
                  ? "quarter"
                  : "year"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
