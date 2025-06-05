import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/properties/[id]/finances - Get financial summary for a specific property
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const period = searchParams.get("period") || "monthly"; // monthly, quarterly, yearly
    
    // Default to current month if no dates provided
    const currentDate = new Date();
    const defaultStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const defaultEndDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const dateFilter = {
      gte: startDate ? new Date(startDate) : defaultStartDate,
      lte: endDate ? new Date(endDate) : defaultEndDate,
    };
    
    // Get property details
    const property = await prisma.property.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        value: true,
        rentAmount: true,
      },
    });
    
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }
    
    // Get income for the property in the date range
    const incomeEntries = await prisma.income.findMany({
      where: {
        propertyId: params.id,
        date: dateFilter,
      },
      orderBy: {
        date: "asc",
      },
    });
    
    // Get expenses for the property in the date range
    const expenseEntries = await prisma.expense.findMany({
      where: {
        propertyId: params.id,
        date: dateFilter,
      },
      orderBy: {
        date: "asc",
      },
    });
    
    // Calculate total income and expenses
    const totalIncome = incomeEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const netCashFlow = totalIncome - totalExpenses;
    
    // Group income by category
    const incomeByCategory = incomeEntries.reduce((acc, entry) => {
      const category = entry.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += entry.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Group expenses by category
    const expensesByCategory = expenseEntries.reduce((acc, entry) => {
      const category = entry.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += entry.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate ROI (Return on Investment)
    // Assuming property value as the investment
    const annualizedNetCashFlow = calculateAnnualizedValue(netCashFlow, period);
    const roi = property.value > 0 ? (annualizedNetCashFlow / property.value) * 100 : 0;
    
    // Group data by time periods for charts
    const timeSeriesData = generateTimeSeriesData(incomeEntries, expenseEntries, period);
    
    return NextResponse.json({
      property,
      summary: {
        totalIncome,
        totalExpenses,
        netCashFlow,
        roi: parseFloat(roi.toFixed(2)),
      },
      incomeByCategory,
      expensesByCategory,
      timeSeriesData,
    });
  } catch (error) {
    console.error("Error fetching property finances:", error);
    return NextResponse.json(
      { error: "Failed to fetch property finances" },
      { status: 500 }
    );
  }
}

// Helper function to calculate annualized value based on the period
function calculateAnnualizedValue(value: number, period: string): number {
  switch (period) {
    case "monthly":
      return value * 12;
    case "quarterly":
      return value * 4;
    case "yearly":
      return value;
    default:
      return value * 12;
  }
}

// Helper function to generate time series data for charts
function generateTimeSeriesData(
  incomeEntries: any[],
  expenseEntries: any[],
  period: string
): any[] {
  // Combine income and expense entries
  const allEntries = [
    ...incomeEntries.map(entry => ({ ...entry, type: "income" })),
    ...expenseEntries.map(entry => ({ ...entry, type: "expense" })),
  ];
  
  // Sort by date
  allEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by time period
  const groupedData: Record<string, { income: number; expenses: number; cashFlow: number }> = {};
  
  allEntries.forEach(entry => {
    const date = new Date(entry.date);
    let periodKey: string;
    
    // Generate period key based on the period type
    switch (period) {
      case "monthly":
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
        break;
      case "quarterly":
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        periodKey = `${date.getFullYear()}-Q${quarter}`;
        break;
      case "yearly":
        periodKey = date.getFullYear().toString();
        break;
      default:
        periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    }
    
    // Initialize period data if not exists
    if (!groupedData[periodKey]) {
      groupedData[periodKey] = { income: 0, expenses: 0, cashFlow: 0 };
    }
    
    // Add amount to the appropriate type
    if (entry.type === "income") {
      groupedData[periodKey].income += entry.amount;
    } else {
      groupedData[periodKey].expenses += entry.amount;
    }
    
    // Update cash flow
    groupedData[periodKey].cashFlow = groupedData[periodKey].income - groupedData[periodKey].expenses;
  });
  
  // Convert to array format for charts
  return Object.entries(groupedData).map(([name, data]) => ({
    name,
    income: data.income,
    expenses: data.expenses,
    cashFlow: data.cashFlow,
  }));
}
