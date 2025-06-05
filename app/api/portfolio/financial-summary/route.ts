import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/portfolio/financial-summary - Get financial summary for the entire portfolio
export async function GET(request: Request) {
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
    
    // Get all properties
    const properties = await prisma.property.findMany({
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
    
    // Calculate total portfolio value
    const totalPortfolioValue = properties.reduce((sum, property) => sum + property.value, 0);
    
    // Get all income entries in the date range
    const incomeEntries = await prisma.income.findMany({
      where: {
        date: dateFilter,
      },
      include: {
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    
    // Get all expense entries in the date range
    const expenseEntries = await prisma.expense.findMany({
      where: {
        date: dateFilter,
      },
      include: {
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
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
    
    // Group income by property
    const incomeByProperty = incomeEntries.reduce((acc, entry) => {
      const propertyId = entry.propertyId;
      const propertyAddress = entry.property ? 
        `${entry.property.address}, ${entry.property.city}` : 
        "Unknown Property";
      
      if (!acc[propertyId]) {
        acc[propertyId] = {
          id: propertyId,
          address: propertyAddress,
          amount: 0,
        };
      }
      
      acc[propertyId].amount += entry.amount;
      return acc;
    }, {} as Record<string, { id: string; address: string; amount: number }>);
    
    // Group expenses by property
    const expensesByProperty = expenseEntries.reduce((acc, entry) => {
      const propertyId = entry.propertyId;
      const propertyAddress = entry.property ? 
        `${entry.property.address}, ${entry.property.city}` : 
        "Unknown Property";
      
      if (!acc[propertyId]) {
        acc[propertyId] = {
          id: propertyId,
          address: propertyAddress,
          amount: 0,
        };
      }
      
      acc[propertyId].amount += entry.amount;
      return acc;
    }, {} as Record<string, { id: string; address: string; amount: number }>);
    
    // Calculate ROI (Return on Investment)
    // Assuming total portfolio value as the investment
    const annualizedNetCashFlow = calculateAnnualizedValue(netCashFlow, period);
    const portfolioRoi = totalPortfolioValue > 0 ? 
      (annualizedNetCashFlow / totalPortfolioValue) * 100 : 0;
    
    // Calculate property-level ROI
    const propertyRoi = properties.map(property => {
      const propertyIncome = incomeByProperty[property.id]?.amount || 0;
      const propertyExpenses = expensesByProperty[property.id]?.amount || 0;
      const propertyCashFlow = propertyIncome - propertyExpenses;
      const annualizedCashFlow = calculateAnnualizedValue(propertyCashFlow, period);
      const roi = property.value > 0 ? (annualizedCashFlow / property.value) * 100 : 0;
      
      return {
        id: property.id,
        address: `${property.address}, ${property.city}`,
        value: property.value,
        income: propertyIncome,
        expenses: propertyExpenses,
        cashFlow: propertyCashFlow,
        roi: parseFloat(roi.toFixed(2)),
      };
    });
    
    // Group data by time periods for charts
    const timeSeriesData = generateTimeSeriesData(incomeEntries, expenseEntries, period);
    
    // Get historical data for calculating percentage changes
    const previousPeriodData = await getHistoricalData(period);
    
    // Calculate percentage changes
    const incomeChangePercent = previousPeriodData.income > 0 ?
      ((totalIncome - previousPeriodData.income) / previousPeriodData.income) * 100 : 0;
    
    const expensesChangePercent = previousPeriodData.expenses > 0 ?
      ((totalExpenses - previousPeriodData.expenses) / previousPeriodData.expenses) * 100 : 0;
    
    const cashFlowChangePercent = previousPeriodData.cashFlow > 0 ?
      ((netCashFlow - previousPeriodData.cashFlow) / previousPeriodData.cashFlow) * 100 : 0;
    
    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netCashFlow,
        portfolioValue: totalPortfolioValue,
        portfolioRoi: parseFloat(portfolioRoi.toFixed(2)),
        incomeChangePercent: parseFloat(incomeChangePercent.toFixed(1)),
        expensesChangePercent: parseFloat(expensesChangePercent.toFixed(1)),
        cashFlowChangePercent: parseFloat(cashFlowChangePercent.toFixed(1)),
      },
      incomeByCategory,
      expensesByCategory,
      incomeByProperty: Object.values(incomeByProperty),
      expensesByProperty: Object.values(expensesByProperty),
      propertyRoi,
      timeSeriesData,
    });
  } catch (error) {
    console.error("Error fetching portfolio financial summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio financial summary" },
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

// Helper function to get historical data for comparison
async function getHistoricalData(period: string) {
  const currentDate = new Date();
  let previousPeriodStart: Date;
  let previousPeriodEnd: Date;
  
  // Calculate previous period dates based on the current period
  switch (period) {
    case "monthly":
      // Previous month
      previousPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      previousPeriodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      break;
    case "quarterly":
      // Previous quarter
      const currentQuarter = Math.floor(currentDate.getMonth() / 3);
      previousPeriodStart = new Date(currentDate.getFullYear(), (currentQuarter - 1) * 3, 1);
      previousPeriodEnd = new Date(currentDate.getFullYear(), currentQuarter * 3, 0);
      break;
    case "yearly":
      // Previous year
      previousPeriodStart = new Date(currentDate.getFullYear() - 1, 0, 1);
      previousPeriodEnd = new Date(currentDate.getFullYear() - 1, 11, 31);
      break;
    default:
      // Default to previous month
      previousPeriodStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      previousPeriodEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  }
  
  // Query for previous period income
  const previousIncome = await prisma.income.aggregate({
    where: {
      date: {
        gte: previousPeriodStart,
        lte: previousPeriodEnd,
      },
    },
    _sum: {
      amount: true,
    },
  });
  
  // Query for previous period expenses
  const previousExpenses = await prisma.expense.aggregate({
    where: {
      date: {
        gte: previousPeriodStart,
        lte: previousPeriodEnd,
      },
    },
    _sum: {
      amount: true,
    },
  });
  
  const income = previousIncome._sum.amount || 0;
  const expenses = previousExpenses._sum.amount || 0;
  const cashFlow = income - expenses;
  
  return { income, expenses, cashFlow };
}
