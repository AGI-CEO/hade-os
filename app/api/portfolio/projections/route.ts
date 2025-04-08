import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define types for the request and response
type ProjectionParams = {
  rentIncrease: number;
  expenseChange: number;
  interestRate: number;
  timeScale: string;
};

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const rentIncrease = parseFloat(searchParams.get("rentIncrease") || "5");
    const expenseChange = parseFloat(searchParams.get("expenseChange") || "3");
    const interestRate = parseFloat(searchParams.get("interestRate") || "6.5");
    const timeScale = searchParams.get("timeScale") || "5Y";

    // Get all properties
    const properties = await prisma.property.findMany();

    // Calculate current portfolio stats
    const currentTotalValue = properties.reduce(
      (sum, property) => sum + property.value,
      0
    );

    const currentMonthlyIncome = properties
      .filter(
        (property) => property.occupancy === "occupied" && property.rentAmount
      )
      .reduce((sum, property) => sum + (property.rentAmount || 0), 0);

    const currentAnnualCashFlow = currentMonthlyIncome * 12;

    // Estimate current expenses (typically 40-50% of income for rental properties)
    const currentAnnualExpenses = currentAnnualCashFlow * 0.4;
    const currentNetCashFlow = currentAnnualCashFlow - currentAnnualExpenses;

    // Estimate current equity (typically 20-30% of property value)
    const currentEquity = currentTotalValue * 0.25;

    // Get historical snapshots for trend analysis
    const snapshots = await prisma.portfolioSnapshot.findMany({
      orderBy: {
        snapshotDate: "asc",
      },
      take: 12, // Last 12 snapshots
    });

    // Calculate historical growth rates if snapshots exist
    let historicalValueGrowth = 5; // Default annual growth rate
    let historicalIncomeGrowth = 3; // Default annual income growth rate

    if (snapshots.length > 1) {
      const oldestSnapshot = snapshots[0];
      const newestSnapshot = snapshots[snapshots.length - 1];
      const monthsDiff = 
        (new Date(newestSnapshot.snapshotDate).getTime() - 
         new Date(oldestSnapshot.snapshotDate).getTime()) / 
        (1000 * 60 * 60 * 24 * 30);
      
      if (monthsDiff > 0) {
        // Calculate annualized growth rates
        historicalValueGrowth = 
          ((newestSnapshot.totalValue / oldestSnapshot.totalValue) ** 
           (12 / monthsDiff) - 1) * 100;
        
        historicalIncomeGrowth = 
          ((newestSnapshot.monthlyIncome / oldestSnapshot.monthlyIncome) ** 
           (12 / monthsDiff) - 1) * 100;
      }
    }

    // Generate projection years based on timeScale
    const currentYear = new Date().getFullYear();
    const years = timeScale === "1Y" ? 2 : 
                 timeScale === "3Y" ? 4 : 
                 timeScale === "5Y" ? 6 : 10;

    // Generate projection data
    const projectionData = [];
    
    for (let i = 0; i < years; i++) {
      const year = currentYear + i;
      const rentFactor = Math.pow(1 + rentIncrease / 100, i);
      const expenseFactor = Math.pow(1 + expenseChange / 100, i);
      const valuationFactor = Math.pow(
        1 + (historicalValueGrowth + (rentIncrease - expenseChange) / 10) / 100, 
        i
      );
      
      // Calculate mortgage principal reduction (equity buildup from loan paydown)
      // This is a simplified calculation
      const mortgagePrincipalReduction = i * (currentTotalValue * 0.75 * 0.03);
      
      const projectedCashFlow = Math.round(currentNetCashFlow * rentFactor - currentAnnualExpenses * expenseFactor);
      const projectedEquity = Math.round(
        currentEquity + 
        mortgagePrincipalReduction + 
        (currentTotalValue * valuationFactor - currentTotalValue) * 0.25
      );
      const projectedValuation = Math.round(currentTotalValue * valuationFactor);
      
      projectionData.push({
        year,
        cashFlow: projectedCashFlow,
        equity: projectedEquity,
        valuation: projectedValuation,
      });
    }

    return NextResponse.json({
      projectionData,
      currentStats: {
        totalValue: currentTotalValue,
        monthlyIncome: currentMonthlyIncome,
        equity: currentEquity,
        netCashFlow: currentNetCashFlow,
      },
      historicalRates: {
        valueGrowth: Math.round(historicalValueGrowth * 10) / 10,
        incomeGrowth: Math.round(historicalIncomeGrowth * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Error generating financial projections:", error);
    return NextResponse.json(
      { error: "Failed to generate financial projections" },
      { status: 500 }
    );
  }
}
