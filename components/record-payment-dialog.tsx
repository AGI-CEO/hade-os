"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

type FinancialCategory = {
  id: string;
  name: string;
};

type RecordPaymentDialogProps = {
  rentPaymentId: string | null;
  amountDue: number;
  onClose: () => void;
  onPaymentRecorded: () => void;
};

export function RecordPaymentDialog({
  rentPaymentId,
  amountDue,
  onClose,
  onPaymentRecorded,
}: RecordPaymentDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [amount, setAmount] = useState(amountDue.toString());
  const [description, setDescription] = useState("Rent Payment");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<FinancialCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setAmount(amountDue.toString());
  }, [amountDue]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories?type=INCOME");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          // Set a default category if available
          if (data.length > 0) {
            const rentCategory = data.find(
              (c: FinancialCategory) => c.name.toLowerCase() === "rent income"
            );
            if (rentCategory) {
              setCategoryId(rentCategory.id);
            } else {
              setCategoryId(data[0].id);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch income categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!rentPaymentId || !date || !categoryId || !amount) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/rent-payments/${rentPaymentId}/record-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            date: date.toISOString(),
            description,
            categoryId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to record payment.");
      }

      toast({
        title: "Success!",
        description: "Rent payment recorded successfully.",
      });
      onPaymentRecorded();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!rentPaymentId}
      onOpenChange={(isOpen) => !isOpen && onClose()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Rent Payment</DialogTitle>
          <DialogDescription>
            Enter the details for the rent payment received.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategoryId} value={categoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
