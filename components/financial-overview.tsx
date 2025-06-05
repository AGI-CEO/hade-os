"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  CreditCard,
  Loader2,
} from "lucide-react";

// Define types for the financial data
type FinancialData = {
  monthlyIncome: number;
  monthlyExpenses: number;
  netCashFlow: number;
  cashOnCashReturn: number;
  totalValue: number;
  yearToDateIncome: number;
  yearToDateExpenses: number;
  yearToDateProfit: number;
  valueChangePercent: number;
  incomeChangePercent: number;
};

export function FinancialOverview() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/portfolio/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch financial data");
        }

        const data = await response.json();
        setFinancialData({
          monthlyIncome: data.monthlyIncome || 0,
          monthlyExpenses: data.monthlyExpenses || 0,
          netCashFlow: data.netCashFlow || 0,
          cashOnCashReturn: data.cashOnCashReturn || 0,
          totalValue: data.totalValue || 0,
          yearToDateIncome: data.yearToDateIncome || 0,
          yearToDateExpenses: data.yearToDateExpenses || 0,
          yearToDateProfit: data.yearToDateProfit || 0,
          valueChangePercent: data.valueChangePercent || 0,
          incomeChangePercent: data.incomeChangePercent || 0,
        });
      } catch (err) {
        console.error("Error fetching financial data:", err);
        setError("Failed to load financial data");
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="p-6 rounded-lg border border-border bg-card/50 flex items-center justify-center"
          >
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !financialData) {
    return (
      <div className="p-6 rounded-lg border border-border bg-card/50">
        <p className="text-red-500">
          Error loading financial data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="p-6 rounded-lg border border-border bg-card/50"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Cash Flow</p>
            <h3 className="text-2xl font-bold text-primary glow-text">
              {formatCurrency(financialData.netCashFlow)}
            </h3>
            <div
              className={`flex items-center text-sm ${
                financialData.incomeChangePercent >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {financialData.incomeChangePercent >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>
                {financialData.incomeChangePercent >= 0 ? "+" : ""}
                {financialData.incomeChangePercent.toFixed(1)}% from last month
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="p-6 rounded-lg border border-border bg-card/50"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <PiggyBank className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cash on Cash Return</p>
            <h3 className="text-2xl font-bold text-primary glow-text">
              {formatPercentage(financialData.cashOnCashReturn)}
            </h3>
            <div
              className={`flex items-center text-sm ${
                financialData.valueChangePercent >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {financialData.valueChangePercent >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              <span>
                {financialData.valueChangePercent >= 0 ? "+" : ""}
                {financialData.valueChangePercent.toFixed(1)}% from last year
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="p-6 rounded-lg border border-border bg-card/50"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">YTD Income</p>
            <h3 className="text-2xl font-bold text-primary glow-text">
              {formatCurrency(financialData.yearToDateIncome)}
            </h3>
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>
                +{financialData.incomeChangePercent.toFixed(1)}% from last year
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="p-6 rounded-lg border border-border bg-card/50"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">YTD Expenses</p>
            <h3 className="text-2xl font-bold text-primary glow-text">
              {formatCurrency(financialData.yearToDateExpenses)}
            </h3>
            <div className="flex items-center text-red-500 text-sm">
              <TrendingDown className="h-3 w-3 mr-1" />
              <span>+3.2% from last year</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
