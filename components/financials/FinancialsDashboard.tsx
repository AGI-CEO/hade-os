"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FinancialTransactionType } from "@prisma/client";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string | null;
  type: FinancialTransactionType;
  category: {
    id: string;
    name: string;
  };
}

interface FinancialCategory {
  id: string;
  name: string;
  type: FinancialTransactionType;
}

interface FinancialsDashboardProps {
  propertyId: string;
}

export function FinancialsDashboard({ propertyId }: FinancialsDashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/transactions?propertyId=${propertyId}`
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch financial transactions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch financial categories.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  const openForm = (transaction: Transaction | null = null) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedTransaction(null);
    setIsFormOpen(false);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const method = selectedTransaction ? "PATCH" : "POST";
    const url = selectedTransaction
      ? `/api/transactions/${selectedTransaction.id}`
      : "/api/transactions";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          propertyId,
          amount: parseFloat(data.amount as string),
        }),
      });

      if (!response.ok) {
        throw new Error(
          selectedTransaction
            ? "Failed to update transaction"
            : "Failed to create transaction"
        );
      }

      toast({
        title: "Success",
        description: `Transaction successfully ${
          selectedTransaction ? "updated" : "created"
        }.`,
      });

      fetchTransactions();
      closeForm();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");

      toast({
        title: "Success",
        description: "Transaction successfully deleted.",
      });
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete transaction.",
        variant: "destructive",
      });
    }
  };

  const summary = transactions.reduce(
    (
      acc: { totalIncome: number; totalExpenses: number; netProfit: number },
      t
    ) => {
      if (t.type === "INCOME") acc.totalIncome += t.amount;
      else acc.totalExpenses += t.amount;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, netProfit: 0 }
  );
  summary.netProfit = summary.totalIncome - summary.totalExpenses;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Track income and expenses for this property.
            </CardDescription>
          </div>
          <Button onClick={() => openForm()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                ${summary.totalIncome.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                ${summary.totalExpenses.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl font-bold ${
                  summary.netProfit >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                ${summary.netProfit.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : (
              transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell>{t.category.name}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell
                    className={`text-right ${
                      t.type === "INCOME" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${t.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openForm(t)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the transaction.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(t.id)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTransaction ? "Edit" : "Add"} Transaction
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select name="type" defaultValue={selectedTransaction?.type}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryId" className="text-right">
                    Category
                  </Label>
                  <Select
                    name="categoryId"
                    defaultValue={selectedTransaction?.category.id}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="col-span-3"
                    defaultValue={
                      selectedTransaction
                        ? new Date(selectedTransaction.date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    className="col-span-3"
                    defaultValue={selectedTransaction?.amount || ""}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    className="col-span-3"
                    defaultValue={selectedTransaction?.description || ""}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
