"use client"

import { motion } from "framer-motion"
import { TrendingUp, Home, DollarSign } from "lucide-react"

// Sample portfolio data
const portfolioStats = {
  totalValue: 2210000,
  totalProperties: 3,
  monthlyIncome: 4700,
  annualReturn: 8.2,
  occupancyRate: 67,
  equityGrowth: 12.5,
}

export function PortfolioStats() {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
            <h3 className="text-2xl font-bold text-primary glow-text">{formatCurrency(portfolioStats.totalValue)}</h3>
            <p className="text-sm text-green-500">+{formatPercentage(portfolioStats.equityGrowth)} this year</p>
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
            <Home className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Properties</p>
            <h3 className="text-2xl font-bold text-primary glow-text">{portfolioStats.totalProperties}</h3>
            <p className="text-sm text-muted-foreground">{formatPercentage(portfolioStats.occupancyRate)} occupied</p>
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
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Income</p>
            <h3 className="text-2xl font-bold text-primary glow-text">
              {formatCurrency(portfolioStats.monthlyIncome)}
            </h3>
            <p className="text-sm text-green-500">{formatPercentage(portfolioStats.annualReturn)} annual return</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
