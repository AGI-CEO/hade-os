"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Wrench,
  FileText,
  Bell,
  Home,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import prisma from "@/lib/prisma";

export default function TenantDashboard() {
  const { data: session } = useSession();
  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tenants/me");

        if (!response.ok) {
          throw new Error("Failed to fetch tenant data");
        }

        const data = await response.json();
        setTenantData(data);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        toast({
          title: "Error",
          description: "Failed to load your tenant information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [toast]);

  // Calculate days until rent is due
  const daysUntilRentDue = tenantData?.rentDue
    ? Math.ceil(
        (new Date(tenantData.rentDue).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Welcome, {session?.user?.name || "Tenant"}
        </h1>
        <p className="text-muted-foreground">
          Manage your rental, payments, and maintenance requests
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 w-24 bg-primary/10 rounded mb-2"></div>
                <div className="h-4 w-32 bg-primary/10 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-12 w-full bg-primary/10 rounded mb-4"></div>
                <div className="h-8 w-24 bg-primary/10 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-primary-foreground flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Rent Payment
              </CardTitle>
              <CardDescription>Next payment due soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Amount Due
                  </span>
                  <span className="text-2xl font-bold text-primary-foreground">
                    ${tenantData?.rentAmount || "0.00"}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Due in {daysUntilRentDue} days
                    </span>
                    <span className="text-primary-foreground">
                      {tenantData?.rentDue
                        ? new Date(tenantData.rentDue).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <Progress
                    value={Math.max(
                      0,
                      Math.min(100, 100 - daysUntilRentDue * 3.33)
                    )}
                  />
                </div>
                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-primary-foreground flex items-center">
                <Wrench className="mr-2 h-5 w-5 text-primary" />
                Maintenance
              </CardTitle>
              <CardDescription>Request repairs or service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-primary-foreground">
                      Active Requests
                    </span>
                    <span className="text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
                      {tenantData?.maintenanceRequests?.filter(
                        (r: any) => r.status !== "completed"
                      ).length || 0}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tenantData?.maintenanceRequests?.filter(
                      (r: any) => r.status !== "completed"
                    ).length
                      ? "You have active maintenance requests"
                      : "No active maintenance requests"}
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  <Wrench className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-primary-foreground flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Documents
              </CardTitle>
              <CardDescription>Access important files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <FileText className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <span className="text-xs">Lease</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <Bell className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <span className="text-xs">Notices</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <Home className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <span className="text-xs">Rules</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-1 text-primary" />
                    <span className="text-xs">Calendar</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary-foreground">
            Property Information
          </CardTitle>
          <CardDescription>Details about your rental property</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-48 bg-primary/10 rounded"></div>
              <div className="h-4 w-64 bg-primary/10 rounded"></div>
              <div className="h-4 w-32 bg-primary/10 rounded"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-2">
                  Address
                </h3>
                <p className="text-muted-foreground">
                  {tenantData?.property?.address || "N/A"}
                  <br />
                  {tenantData?.property?.city || "N/A"},{" "}
                  {tenantData?.property?.state || "N/A"}{" "}
                  {tenantData?.property?.zipCode || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-primary-foreground mb-2">
                  Lease Information
                </h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="text-primary-foreground">
                      {tenantData?.leaseStart
                        ? new Date(tenantData.leaseStart).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="text-primary-foreground">
                      {tenantData?.leaseEnd
                        ? new Date(tenantData.leaseEnd).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span className="text-primary-foreground">
                      ${tenantData?.rentAmount || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
