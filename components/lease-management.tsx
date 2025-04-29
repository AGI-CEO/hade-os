"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  AlertCircle,
  Clock,
  Plus,
  Loader2,
  Eye,
  Edit,
  FileSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

type Lease = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  monthlyRent: number;
  property: {
    id: string;
    address: string;
    city: string;
    state: string;
  };
  tenant: {
    id: string;
    name: string;
  };
};

export function LeaseManagement() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch leases data
  useEffect(() => {
    const fetchLeases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/leases");

        if (!response.ok) {
          throw new Error("Failed to fetch leases");
        }

        const data = await response.json();
        setLeases(data);
      } catch (err) {
        console.error("Error fetching leases:", err);
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

    fetchLeases();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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

  // Calculate days remaining in lease
  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Count leases expiring soon (within 30 days)
  const leasesExpiringSoon = leases.filter(
    (lease) =>
      lease.status === "active" &&
      calculateDaysRemaining(lease.endDate) <= 30 &&
      calculateDaysRemaining(lease.endDate) > 0
  ).length;

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
  if (error) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">
          Error loading data
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button size="sm" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  // Show empty state
  if (leases.length === 0) {
    return (
      <div className="text-center py-6">
        <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">
          No leases found
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Create a lease to get started
        </p>
        <Link href="/dashboard/leases/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Lease
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {leases.map((lease) => {
        const daysRemaining = calculateDaysRemaining(lease.endDate);
        const leaseLength = Math.round(
          (new Date(lease.endDate).getTime() -
            new Date(lease.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        const progress = Math.round(
          ((leaseLength - daysRemaining) / leaseLength) * 100
        );

        return (
          <div
            key={lease.id}
            className="p-4 rounded-lg border border-border bg-card/50 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-primary-foreground">
                    {lease.title}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {lease.property.address}, {lease.property.city},{" "}
                    {lease.property.state}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tenant: {lease.tenant.name} • Rent:{" "}
                    {formatCurrency(lease.monthlyRent)}/month
                  </p>
                </div>
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

              {lease.status === "active" && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {formatDate(lease.startDate)} -{" "}
                      {formatDate(lease.endDate)}
                    </span>
                    <span className="text-primary-foreground">
                      {daysRemaining} days left
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-1.5 [&>div]:bg-primary"
                  />
                </div>
              )}

              {lease.status === "draft" && (
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">
                    Awaiting finalization
                  </span>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <Link href={`/dashboard/leases/${lease.id}`}>
                  <Button size="sm" variant="outline" className="h-8">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/leases/${lease.id}/edit`}>
                  <Button size="sm" variant="outline" className="h-8">
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                </Link>
                {lease.status === "draft" && (
                  <Button size="sm" variant="outline" className="h-8">
                    <FileSignature className="h-3.5 w-3.5 mr-1" />
                    Finalize
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {leasesExpiringSoon > 0 && (
            <>
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>
                {leasesExpiringSoon} lease{leasesExpiringSoon !== 1 ? "s" : ""}{" "}
                expiring soon
              </span>
            </>
          )}
        </div>
        <Link href="/dashboard/leases/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Lease
          </Button>
        </Link>
      </div>
    </div>
  );
}
