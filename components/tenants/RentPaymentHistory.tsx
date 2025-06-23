"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  TrendingUp,
  Loader2
} from "lucide-react";
import { format, isAfter, isBefore, startOfMonth, endOfMonth } from "date-fns";

type RentPayment = {
  id: string;
  amountDue: number;
  dueDate: string;
  status: "UPCOMING" | "UNPAID" | "PAID" | "LATE";
  createdAt: string;
  updatedAt: string;
  transaction: {
    id: string;
    date: string;
    description: string;
    amount: number;
  } | null;
  lease: {
    id: string;
    title: string;
    property: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
};

const RentPaymentHistory = () => {
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/tenants/me/rent-payments");
        if (!res.ok) {
          throw new Error("Failed to fetch rent payments");
        }
        const data = await res.json();
        setPayments(data);
        setFilteredPayments(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load rent payment history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [toast]);

  // Filter payments based on search term, status, and month
  useEffect(() => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.lease.property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.lease.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transaction?.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Month filter
    if (monthFilter !== "all") {
      const targetMonth = new Date(monthFilter);
      const monthStart = startOfMonth(targetMonth);
      const monthEnd = endOfMonth(targetMonth);
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.dueDate);
        return isAfter(paymentDate, monthStart) && isBefore(paymentDate, monthEnd);
      });
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, monthFilter]);

  const getStatusBadge = (status: RentPayment["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
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
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <Clock className="mr-1 h-3.5 w-3.5" />
            Upcoming
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  // Calculate payment statistics
  const stats = {
    totalPaid: payments.filter(p => p.status === "PAID").reduce((sum, p) => sum + (p.transaction?.amount || 0), 0),
    totalDue: payments.filter(p => p.status === "UNPAID" || p.status === "LATE").reduce((sum, p) => sum + p.amountDue, 0),
    onTimePayments: payments.filter(p => p.status === "PAID").length,
    latePayments: payments.filter(p => p.status === "LATE").length,
  };

  const exportPayments = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Due Date,Amount Due,Status,Payment Date,Amount Paid,Property\n" +
      filteredPayments.map(payment => 
        `${formatDate(payment.dueDate)},${payment.amountDue},${payment.status},${
          payment.transaction ? formatDate(payment.transaction.date) : 'N/A'
        },${payment.transaction?.amount || 0},"${payment.lease.property.address}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rent_payment_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Rent Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Rent Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(stats.totalPaid)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Amount Due</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(stats.totalDue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">On-Time</p>
                <p className="text-lg font-semibold">{stats.onTimePayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Late</p>
                <p className="text-lg font-semibold text-red-600">{stats.latePayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Rent Payment History
            </CardTitle>
            <Button onClick={exportPayments} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="LATE">Late</SelectItem>
                <SelectItem value="UPCOMING">Upcoming</SelectItem>
              </SelectContent>
            </Select>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="2024-01">January 2024</SelectItem>
                <SelectItem value="2024-02">February 2024</SelectItem>
                <SelectItem value="2024-03">March 2024</SelectItem>
                <SelectItem value="2024-04">April 2024</SelectItem>
                <SelectItem value="2024-05">May 2024</SelectItem>
                <SelectItem value="2024-06">June 2024</SelectItem>
                <SelectItem value="2024-07">July 2024</SelectItem>
                <SelectItem value="2024-08">August 2024</SelectItem>
                <SelectItem value="2024-09">September 2024</SelectItem>
                <SelectItem value="2024-10">October 2024</SelectItem>
                <SelectItem value="2024-11">November 2024</SelectItem>
                <SelectItem value="2024-12">December 2024</SelectItem>
                <SelectItem value="2025-01">January 2025</SelectItem>
                <SelectItem value="2025-02">February 2025</SelectItem>
                <SelectItem value="2025-03">March 2025</SelectItem>
                <SelectItem value="2025-04">April 2025</SelectItem>
                <SelectItem value="2025-05">May 2025</SelectItem>
                <SelectItem value="2025-06">June 2025</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment History Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Property</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-muted/50"
                      >
                        <TableCell>{formatDate(payment.dueDate)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(payment.amountDue)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {payment.transaction 
                            ? formatDate(payment.transaction.date)
                            : "—"
                          }
                        </TableCell>
                        <TableCell>
                          {payment.transaction 
                            ? formatCurrency(payment.transaction.amount)
                            : "—"
                          }
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.lease.property.address}
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <CreditCard className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {payments.length === 0 
                              ? "No rent payments found"
                              : "No payments match your search criteria"
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentPaymentHistory;
