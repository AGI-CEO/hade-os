"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Edit,
  Download,
  Printer,
  AlertCircle,
  Loader2,
  FileSignature,
  Clock,
  CheckCircle,
  Calendar,
  Home,
  User,
  DollarSign,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { RentPaymentsTab } from "@/components/rent-payments-tab";

type LeaseViewerProps = {
  leaseId: string;
};

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

export function LeaseViewer({ leaseId }: LeaseViewerProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [lease, setLease] = useState<Lease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch lease data
  useEffect(() => {
    const fetchLease = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/leases/${leaseId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch lease");
        }

        const data = await response.json();
        setLease(data);
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

    fetchLease();
  }, [leaseId, toast]);

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
        <h3 className="font-medium text-primary-foreground mb-1">
          Error loading data
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error || "Lease not found"}
        </p>
        <Button size="sm" onClick={() => router.push("/dashboard/leases")}>
          Back to Leases
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-foreground">
            {lease.title}
          </h1>
          <p className="text-muted-foreground">
            Created on {formatDate(lease.createdAt)}
            {lease.createdAt !== lease.updatedAt &&
              ` • Updated on ${formatDate(lease.updatedAt)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/leases/${leaseId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="agreement">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agreement">
            <FileText className="mr-2 h-4 w-4" />
            Lease Agreement
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="mr-2 h-4 w-4" />
            Rent Payments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="agreement">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-primary-foreground flex items-center">
                      <FileSignature className="mr-2 h-5 w-5 text-primary" />
                      Lease Details
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
                        <span>
                          Active lease from {formatDate(lease.startDate)} to{" "}
                          {formatDate(lease.endDate)}
                        </span>
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
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: lease.content.replace(/\n/g, "<br />"),
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary-foreground flex items-center">
                    <Home className="mr-2 h-5 w-5 text-primary" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Address
                    </h4>
                    <p className="text-primary-foreground">
                      {lease.property.address}
                      <br />
                      {lease.property.city}, {lease.property.state}{" "}
                      {lease.property.zipCode}
                    </p>
                  </div>
                  <Link href={`/dashboard/properties/${lease.property.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      View Property
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary-foreground flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Tenant Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Name
                    </h4>
                    <p className="text-primary-foreground">
                      {lease.tenant.name}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Contact
                    </h4>
                    <p className="text-primary-foreground">
                      {lease.tenant.email}
                      <br />
                      {lease.tenant.phone}
                    </p>
                  </div>
                  <Link href={`/dashboard/tenants/${lease.tenant.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      View Tenant
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-primary-foreground flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-primary" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Monthly Rent
                    </h4>
                    <p className="text-xl font-semibold text-primary-foreground">
                      {formatCurrency(lease.monthlyRent)}
                    </p>
                  </div>
                  {lease.securityDeposit && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Security Deposit
                      </h4>
                      <p className="text-primary-foreground">
                        {formatCurrency(lease.securityDeposit)}
                      </p>
                    </div>
                  )}
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Lease Term
                    </h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-primary-foreground">
                        {formatDate(lease.startDate)} -{" "}
                        {formatDate(lease.endDate)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="payments">
          <RentPaymentsTab leaseId={leaseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
