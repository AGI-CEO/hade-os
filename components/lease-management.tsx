"use client";

import { useState, useEffect } from "react";
import { FileText, AlertCircle, Clock, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

type Tenant = {
  id: string;
  name: string;
  leaseStart: string;
  leaseEnd: string;
  status: string;
  property: {
    address: string;
    city: string;
    state: string;
  };
};

export function LeaseManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch tenants data
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/tenants");

        if (!response.ok) {
          throw new Error("Failed to fetch tenants");
        }

        const data = await response.json();
        setTenants(data);
      } catch (err) {
        console.error("Error fetching tenants:", err);
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

    fetchTenants();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
  const leasesExpiringSoon = tenants.filter(
    (tenant) => 
      tenant.status === "active" && 
      calculateDaysRemaining(tenant.leaseEnd) <= 30 &&
      calculateDaysRemaining(tenant.leaseEnd) > 0
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
        <h3 className="font-medium text-primary-foreground mb-1">Error loading data</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button size="sm" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Show empty state
  if (tenants.length === 0) {
    return (
      <div className="text-center py-6">
        <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">No leases found</h3>
        <p className="text-sm text-muted-foreground mb-4">Add tenants to manage leases</p>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Lease
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tenants.map((tenant) => {
        const daysRemaining = calculateDaysRemaining(tenant.leaseEnd);
        const leaseLength = Math.round(
          (new Date(tenant.leaseEnd).getTime() - new Date(tenant.leaseStart).getTime()) / 
          (1000 * 60 * 60 * 24)
        );
        const progress = Math.round(((leaseLength - daysRemaining) / leaseLength) * 100);
        
        return (
          <div key={tenant.id} className="p-4 rounded-lg border border-border bg-card/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-primary-foreground">{tenant.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {tenant.property.address}, {tenant.property.city}, {tenant.property.state}
                  </p>
                </div>
                <Badge
                  className={
                    tenant.status === "active"
                      ? "bg-green-500"
                      : tenant.status === "pending"
                        ? "bg-amber-500"
                        : "bg-gray-500"
                  }
                >
                  {tenant.status === "active" ? "Active" : tenant.status === "pending" ? "Pending" : "Past"}
                </Badge>
              </div>

              {tenant.status === "active" && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}
                    </span>
                    <span className="text-primary-foreground">{daysRemaining} days left</span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-1.5 [&>div]:bg-primary"
                  />
                </div>
              )}

              {tenant.status === "pending" && (
                <div className="mt-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-xs text-muted-foreground">Awaiting signature</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {leasesExpiringSoon > 0 && (
            <>
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>{leasesExpiringSoon} lease{leasesExpiringSoon !== 1 ? 's' : ''} expiring soon</span>
            </>
          )}
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Lease
        </Button>
      </div>
    </div>
  );
}
