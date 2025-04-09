"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart2,
  DollarSign,
  TrendingUp,
  Calendar,
  FileText,
  Download,
  Filter,
  Plus,
  CreditCard,
  Receipt,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FinancialOverview } from "@/components/financial-overview"
import { CashFlowAnalysis } from "@/components/cash-flow-analysis"
import { ExpenseTracker } from "@/components/expense-tracker"
import { TaxPlanner } from "@/components/tax-planner"
import { TransactionHistory } from "@/components/transaction-history"
import { InvestmentPerformance } from "@/components/investment-performance"

export default function FinancesPage() {
  const [timeFrame, setTimeFrame] = useState<"monthly" | "quarterly" | "yearly">("monthly")
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">Finances</h1>
        <p className="text-muted-foreground">Track your real estate income, expenses, and financial performance</p>
      </div>

      <FinancialOverview />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "monthly" ? "bg-primary/20" : ""}
            onClick={() => setTimeFrame("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "quarterly" ? "bg-primary/20" : ""}
            onClick={() => setTimeFrame("quarterly")}
          >
            Quarterly
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "yearly" ? "bg-primary/20" : ""}
            onClick={() => setTimeFrame("yearly")}
          >
            Yearly
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddTransaction(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cash-flow" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="cash-flow">
            <TrendingUp className="mr-2 h-4 w-4" />
            Cash Flow
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <CreditCard className="mr-2 h-4 w-4" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="taxes">
            <FileText className="mr-2 h-4 w-4" />
            Taxes
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${timeFrame}-cash-flow`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="cash-flow" className="mt-0">
                <CashFlowAnalysis timeFrame={timeFrame} />
              </TabsContent>
            </motion.div>

            <motion.div
              key={`${timeFrame}-expenses`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="expenses" className="mt-0">
                <ExpenseTracker timeFrame={timeFrame} />
              </TabsContent>
            </motion.div>

            <motion.div
              key={`${timeFrame}-taxes`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="taxes" className="mt-0">
                <TaxPlanner timeFrame={timeFrame} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-primary" />
              Investment Performance
            </CardTitle>
            <CardDescription>Track the performance of your real estate investments</CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentPerformance timeFrame={timeFrame} />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Receipt className="mr-2 h-5 w-5 text-primary" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionHistory limit={5} />
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showAddTransaction && <AddTransactionModal onClose={() => setShowAddTransaction(false)} />}
      </AnimatePresence>
    </div>
  )
}

function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4">Add New Transaction</h2>

          <div className="space-y-4">
            <div className="flex rounded-md overflow-hidden">
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  transactionType === "income"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-primary/10 text-muted-foreground"
                }`}
                onClick={() => setTransactionType("income")}
              >
                Income
              </button>
              <button
                className={`flex-1 py-2 px-4 text-sm font-medium ${
                  transactionType === "expense"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card hover:bg-primary/10 text-muted-foreground"
                }`}
                onClick={() => setTransactionType("expense")}
              >
                Expense
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-card text-primary-foreground"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-border bg-card text-primary-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Category</label>
              <select className="w-full h-10 px-3 rounded-md border border-border bg-card text-primary-foreground">
                {transactionType === "income" ? (
                  <>
                    <option>Rent</option>
                    <option>Security Deposit</option>
                    <option>Late Fees</option>
                    <option>Other Income</option>
                  </>
                ) : (
                  <>
                    <option>Mortgage</option>
                    <option>Property Tax</option>
                    <option>Insurance</option>
                    <option>Maintenance</option>
                    <option>Utilities</option>
                    <option>Other Expense</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Property</label>
              <select className="w-full h-10 px-3 rounded-md border border-border bg-card text-primary-foreground">
                <option>123 Main St, Austin, TX</option>
                <option>456 Oak Ave, San Antonio, TX</option>
                <option>789 Pine Blvd, Houston, TX</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">Description</label>
              <textarea
                className="w-full p-3 rounded-md border border-border bg-card text-primary-foreground min-h-[80px]"
                placeholder="Add notes about this transaction..."
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>Save Transaction</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
