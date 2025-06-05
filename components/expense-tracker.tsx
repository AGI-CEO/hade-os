"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFCC00",
];

// Define types for expense data
type ExpenseDataPoint = {
  name: string;
  value: number;
  percent: number;
};

type PropertyExpenseDataPoint = {
  name: string;
  [key: string]: string | number;
};

type ExpenseTrackerProps = {
  timeFrame: "monthly" | "quarterly" | "yearly";
};

export function ExpenseTracker({ timeFrame }: ExpenseTrackerProps) {
  const [expenseData, setExpenseData] = useState<ExpenseDataPoint[]>([]);
  const [propertyExpenseData, setPropertyExpenseData] = useState<
    PropertyExpenseDataPoint[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    const fetchExpenseData = async () => {
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
          throw new Error("Failed to fetch expense data");
        }

        const summaryData = await response.json();

        // Extract expense by category data
        const expensesByCategory = summaryData.expensesByCategory || {};

        // Calculate total expenses
        const total = Object.values(expensesByCategory).reduce(
          (sum: number, value: any) => sum + value,
          0
        ) as number;
        setTotalExpenses(total);

        // Transform data for pie chart
        const transformedExpenseData = Object.entries(expensesByCategory).map(
          ([category, amount]) => {
            const value = amount as number;
            const percent =
              total > 0 ? Math.round((value / total) * 100 * 10) / 10 : 0;

            return {
              name:
                category.charAt(0).toUpperCase() +
                category.slice(1).replace("_", " "),
              value,
              percent,
            };
          }
        );

        setExpenseData(transformedExpenseData);

        // Extract expense by property data
        const expensesByProperty = summaryData.expensesByProperty || [];

        // Transform data for bar chart
        const transformedPropertyData = expensesByProperty.map(
          (property: any) => {
            // Fetch expenses by category for this property
            const propertyId = property.id;

            // Fetch property-specific expense breakdown
            return fetch(
              `/api/properties/${propertyId}/finances?period=${period}`
            )
              .then((res) => res.json())
              .then((data) => {
                const expenseCategories = data.expensesByCategory || {};

                return {
                  name: property.address.split(",")[0],
                  ...Object.entries(expenseCategories).reduce(
                    (acc, [category, value]) => {
                      // Convert category names to match the expected format for the chart
                      const formattedCategory =
                        category === "property_tax"
                          ? "tax"
                          : category === "property_management"
                          ? "management"
                          : category;
                      acc[formattedCategory] = value;
                      return acc;
                    },
                    {} as Record<string, number>
                  ),
                };
              });
          }
        );

        // Wait for all property data to be fetched
        const propertyData = await Promise.all(transformedPropertyData);
        setPropertyExpenseData(propertyData);
      } catch (err) {
        console.error("Error fetching expense data:", err);
        setError("Failed to load expense data");

        // Set fallback data
        setExpenseData([]);
        setPropertyExpenseData([]);
        setTotalExpenses(0);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenseData();
  }, [timeFrame]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading expense data...</p>
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

  if (expenseData.length === 0) {
    return (
      <div className="p-6 rounded-lg border border-border bg-card/50 text-center">
        <p className="text-muted-foreground mb-2">
          No expense data available for this time period
        </p>
        <p className="text-sm text-muted-foreground">
          Try adding some expense transactions
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-4">
              Expense Breakdown
            </h3>
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
                    label={({ name, percent }) =>
                      `${name}: ${percent.toFixed(0)}%`
                    }
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </RechartsePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-4">
              Expense Details
            </h3>
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
                    <span className="text-primary-foreground">
                      {formatCurrency(item.value)}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary border-primary/20"
                    >
                      {item.percent}%
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-border flex justify-between items-center">
                <span className="font-medium text-primary-foreground">
                  Total
                </span>
                <span className="font-medium text-primary-foreground">
                  {formatCurrency(totalExpenses)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {propertyExpenseData.length > 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium text-primary-foreground mb-4">
              Expenses by Property
            </h3>
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
                  <BarChart
                    data={propertyExpenseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar
                      dataKey="mortgage"
                      stackId="a"
                      fill={COLORS[0]}
                      name="Mortgage"
                    />
                    <Bar
                      dataKey="tax"
                      stackId="a"
                      fill={COLORS[1]}
                      name="Property Tax"
                    />
                    <Bar
                      dataKey="insurance"
                      stackId="a"
                      fill={COLORS[2]}
                      name="Insurance"
                    />
                    <Bar
                      dataKey="maintenance"
                      stackId="a"
                      fill={COLORS[3]}
                      name="Maintenance"
                    />
                    <Bar
                      dataKey="utilities"
                      stackId="a"
                      fill={COLORS[4]}
                      name="Utilities"
                    />
                    <Bar
                      dataKey="management"
                      stackId="a"
                      fill={COLORS[5]}
                      name="Management"
                    />
                    <Bar
                      dataKey="other"
                      stackId="a"
                      fill={COLORS[6]}
                      name="Other"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
