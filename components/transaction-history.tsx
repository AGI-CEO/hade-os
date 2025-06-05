"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Define types for transactions
type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  property?: {
    id: string;
    address: string;
    city: string;
    state: string;
  };
};

type TransactionHistoryProps = {
  limit?: number;
  propertyId?: string;
};

export function TransactionHistory({
  limit,
  propertyId,
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = limit || 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both income and expense data
        const incomePromise = fetch(
          `/api/income${propertyId ? `?propertyId=${propertyId}` : ""}`
        );
        const expensePromise = fetch(
          `/api/expenses${propertyId ? `?propertyId=${propertyId}` : ""}`
        );

        const [incomeResponse, expenseResponse] = await Promise.all([
          incomePromise,
          expensePromise,
        ]);

        if (!incomeResponse.ok || !expenseResponse.ok) {
          throw new Error("Failed to fetch transaction data");
        }

        const incomeData = await incomeResponse.json();
        const expenseData = await expenseResponse.json();

        // Transform income data to transaction format
        const incomeTransactions: Transaction[] = incomeData.map(
          (income: any) => ({
            id: income.id,
            date: income.date,
            description: `${
              income.category === "rent"
                ? "Rent Payment"
                : income.description || "Income"
            } - ${income.property?.address || "Unknown Property"}`,
            amount: income.amount,
            type: "income",
            category: income.category,
            property: income.property,
          })
        );

        // Transform expense data to transaction format
        const expenseTransactions: Transaction[] = expenseData.map(
          (expense: any) => ({
            id: expense.id,
            date: expense.date,
            description: `${
              expense.category.charAt(0).toUpperCase() +
              expense.category.slice(1)
            } - ${expense.property?.address || "Unknown Property"}`,
            amount: expense.amount,
            type: "expense",
            category: expense.category,
            property: expense.property,
          })
        );

        // Combine and sort by date (newest first)
        const allTransactions = [
          ...incomeTransactions,
          ...expenseTransactions,
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(allTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transaction data");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [propertyId]);

  const totalPages = Math.ceil(transactions.length / pageSize);

  // Get transactions for current page
  const paginatedTransactions = transactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg border border-border bg-card/50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center rounded-lg border border-border bg-card/50">
        <p className="text-muted-foreground mb-4">No transactions found</p>
        <Button>Add Transaction</Button>
      </div>
    );
  }

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
                  transaction.type === "income"
                    ? "bg-green-500/10"
                    : "bg-red-500/10"
                }`}
              >
                {transaction.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-primary-foreground">
                  {transaction.description}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-medium ${
                  transaction.type === "income"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
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
        <Link href="/dashboard/finances">
          <Button variant="outline" size="sm" className="w-full">
            View All Transactions
          </Button>
        </Link>
      )}
    </div>
  );
}
