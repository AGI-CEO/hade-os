"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  AlertCircle,
  DollarSign,
  CheckCircle,
  XCircle,
  Calendar,
  Wallet,
} from "lucide-react";
import { RecordPaymentDialog } from "./record-payment-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RentPayment = {
  id: string;
  amountDue: number;
  dueDate: string;
  status: "UPCOMING" | "UNPAID" | "PAID" | "LATE";
  transaction: {
    id: string;
    date: string;
    description: string;
  } | null;
};

type RentPaymentsTabProps = {
  leaseId: string;
};

export function RentPaymentsTab({ leaseId }: RentPaymentsTabProps) {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | null>(
    null
  );
  const { toast } = useToast();

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/leases/${leaseId}/rent-payments`);
      if (!response.ok) {
        throw new Error("Failed to fetch rent payments");
      }
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      console.error("Error fetching rent payments:", err);
      setError("Failed to load rent payment data.");
      toast({
        title: "Error",
        description: "Could not load rent payments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (leaseId) {
      fetchPayments();
    }
  }, [leaseId, toast]);

  const getStatusBadge = (status: RentPayment["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            Paid
          </Badge>
        );
      case "UNPAID":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3.5 w-3.5" />
            Unpaid
          </Badge>
        );
      case "LATE":
        return (
          <Badge variant="destructive" className="bg-red-700 hover:bg-red-800">
            <AlertCircle className="mr-1 h-3.5 w-3.5" />
            Late
          </Badge>
        );
      case "UPCOMING":
      default:
        return (
          <Badge variant="outline">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            Upcoming
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleRecordPaymentClick = (payment: RentPayment) => {
    setSelectedPayment(payment);
  };

  const handleCloseDialog = () => {
    setSelectedPayment(null);
  };

  const handlePaymentRecorded = () => {
    fetchPayments(); // Re-fetch payments to update the list
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              Rent Payment Schedule
            </CardTitle>
            <CardDescription>
              A record of all expected and completed rent payments for this
              lease.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{formatDate(payment.dueDate)}</TableCell>
                      <TableCell>{formatCurrency(payment.amountDue)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.transaction
                          ? formatDate(payment.transaction.date)
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {(payment.status === "UNPAID" ||
                          payment.status === "LATE") && (
                          <Button
                            size="sm"
                            onClick={() => handleRecordPaymentClick(payment)}
                          >
                            <DollarSign className="mr-1 h-4 w-4" />
                            Record Payment
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No rent payments scheduled for this lease yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {selectedPayment && (
        <RecordPaymentDialog
          rentPaymentId={selectedPayment.id}
          amountDue={selectedPayment.amountDue}
          onClose={handleCloseDialog}
          onPaymentRecorded={() => {
            handleCloseDialog();
            handlePaymentRecorded();
          }}
        />
      )}
    </>
  );
}
