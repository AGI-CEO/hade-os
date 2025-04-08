"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard } from "lucide-react"

// Sample financial data
const financialData = {
  monthlyIncome: 4700,
  monthlyExpenses: 2800,
  netCashFlow: 1900,
  cashOnCashReturn: 8.2,
  totalInvestment: 280000,
  yearToDateIncome: 23500,
  yearToDateExpenses: 14000,
  yearToDateProfit: 9500,
}

export function FinancialOverview() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value}%`
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
            <h3 className="text-2xl font-bold text-primary glow-text">{formatCurrency(financialData.netCashFlow)}</h3>
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+5.3% from last month</span>
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
            <div className="flex items-center text-green-500 text-sm">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+0.7% from last year</span>
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
              <span>+12.4% from last year</span>
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
  )
}
