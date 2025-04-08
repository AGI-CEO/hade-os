"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal, ChevronRight, ChevronLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample transaction data
const transactions = [
  {
    id: 1,
    date: "2023-05-01",
    description: "Rent Payment - 123 Main St",
    amount: 2200,
    type: "income",
    category: "rent",
    property: "123 Main St, Austin, TX",
  },
  {
    id: 2,
    date: "2023-05-01",
    description: "Mortgage Payment - 123 Main St",
    amount: 1200,
    type: "expense",
    category: "mortgage",
    property: "123 Main St, Austin, TX",
  },
  {
    id: 3,
    date: "2023-05-02",
    description: "Rent Payment - 789 Pine Blvd",
    amount: 2500,
    type: "income",
    category: "rent",
    property: "789 Pine Blvd, Houston, TX",
  },
  {
    id: 4,
    date: "2023-05-05",
    description: "Plumbing Repair - 123 Main St",
    amount: 350,
    type: "expense",
    category: "maintenance",
    property: "123 Main St, Austin, TX",
  },
  {
    id: 5,
    date: "2023-05-10",
    description: "Insurance Premium - All Properties",
    amount: 450,
    type: "expense",
    category: "insurance",
    property: "Multiple Properties",
  },
  {
    id: 6,
    date: "2023-05-15",
    description: "Property Tax - 789 Pine Blvd",
    amount: 1200,
    type: "expense",
    category: "tax",
    property: "789 Pine Blvd, Houston, TX",
  },
  {
    id: 7,
    date: "2023-05-20",
    description: "Late Fee - 123 Main St",
    amount: 50,
    type: "income",
    category: "fees",
    property: "123 Main St, Austin, TX",
  },
]

type TransactionHistoryProps = {
  limit?: number
}

export function TransactionHistory({ limit }: TransactionHistoryProps) {
  const [page, setPage] = useState(1)
  const pageSize = limit || 10
  const totalPages = Math.ceil(transactions.length / pageSize)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get transactions for current page
  const paginatedTransactions = transactions.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {paginatedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.type === "income" ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-primary-foreground">{transaction.description}</h4>
                <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Details</DropdownMenuItem>
                  <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                  <DropdownMenuItem>Delete Transaction</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      {!limit && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {limit && (
        <Button variant="outline" size="sm" className="w-full">
          View All Transactions
        </Button>
      )}
    </div>
  )
}
