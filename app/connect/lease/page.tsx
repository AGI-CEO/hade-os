"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  FileText,
  Calendar,
  DollarSign,
  Download,
  Printer,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

type Lease = {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  status: string;
  monthlyRent: number;
  securityDeposit: number | null;
  createdAt: string;
  updatedAt: string;
  property: {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  tenant: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  documents: {
    id: string;
    name: string;
    fileType: string;
    category: string;
    createdAt: string;
  }[];
};

export default function TenantLeasePage() {
  const { data: session } = useSession();
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch tenant's lease
  useEffect(() => {
    const fetchLease = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First get the tenant data to find their leases
        const response = await fetch("/api/leases");

        if (!response.ok) {
          throw new Error("Failed to fetch lease");
        }

        const leases = await response.json();
        
        // Get the active lease (or most recent one)
        const activeLease = leases.find((l: any) => l.status === "active") || leases[0];
        
        if (!activeLease) {
          setError("No lease found for this tenant.");
          setLoading(false);
          return;
        }
        
        setLease(activeLease);
      } catch (err) {
        console.error("Error fetching lease:", err);
        setError("Failed to load lease data.");
        toast({
          title: "Error",
          description: "Failed to load lease data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchLease();
    }
  }, [session, toast]);

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
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading lease data...</p>
      </div>
    );
  }

  // Show error state
  if (error || !lease) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">No lease found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error || "No active lease was found for your account."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Your Lease
        </h1>
        <p className="text-muted-foreground">
          View and manage your current lease agreement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary-foreground flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  {lease.title}
                </CardTitle>
                <Badge
                  className={
                    lease.status === "active"
                      ? "bg-green-500"
                      : lease.status === "draft"
                      ? "bg-amber-500"
                      : lease.status === "expired"
                      ? "bg-gray-500"
                      : "bg-blue-500"
                  }
                >
                  {lease.status === "active"
                    ? "Active"
                    : lease.status === "draft"
                    ? "Draft"
                    : lease.status === "expired"
                    ? "Expired"
                    : "Renewed"}
                </Badge>
              </div>
              <CardDescription>
                {lease.status === "active" && (
                  <div className="flex items-center gap-1 text-green-500">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Active lease from {formatDate(lease.startDate)} to {formatDate(lease.endDate)}</span>
                  </div>
                )}
                {lease.status === "draft" && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Draft lease awaiting finalization</span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lease.content.replace(/\n/g, '<br>') }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>

          {lease.documents.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-primary-foreground flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Related Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lease.documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span>{doc.name}</span>
                        <Badge variant="outline" className="ml-2">
                          {doc.fileType.toUpperCase()}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary-foreground flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-primary" />
                Lease Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Monthly Rent</h4>
                <p className="text-xl font-semibold text-primary-foreground">
                  {formatCurrency(lease.monthlyRent)}
                </p>
              </div>
              {lease.securityDeposit && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Security Deposit</h4>
                  <p className="text-primary-foreground">{formatCurrency(lease.securityDeposit)}</p>
                </div>
              )}
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Lease Term</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-primary-foreground">
                    {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Property Address</h4>
                <p className="text-primary-foreground">
                  {lease.property.address}
                  <br />
                  {lease.property.city}, {lease.property.state} {lease.property.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
