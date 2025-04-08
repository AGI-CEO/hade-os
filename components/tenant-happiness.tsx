"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Smile,
  Frown,
  Meh,
  Gift,
  Wrench,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type Tenant = {
  id: string;
  name: string;
  happinessScore: number;
  property: {
    address: string;
    city: string;
    state: string;
  };
};

export function TenantHappiness() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch active tenants data
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
        // Filter only active tenants
        const activeTenants = data.filter(
          (tenant: Tenant) => tenant.happinessScore > 0
        );
        setTenants(activeTenants);
      } catch (err) {
        console.error("Error fetching tenants:", err);
        setError("Failed to load tenant happiness data.");
        toast({
          title: "Error",
          description: "Failed to load tenant happiness data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [toast]);

  // Calculate average happiness score
  const averageScore =
    tenants.length > 0
      ? Math.round(
          tenants.reduce((sum, tenant) => sum + tenant.happinessScore, 0) /
            tenants.length
        )
      : 0;

  // Show loading state
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10"></div>
            <div>
              <div className="h-6 w-24 bg-primary/10 rounded mb-2"></div>
              <div className="h-4 w-32 bg-primary/10 rounded"></div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-primary/10 rounded"></div>
          <div className="h-20 bg-primary/10 rounded"></div>
        </div>
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
  if (tenants.length === 0) {
    return (
      <div className="text-center py-6">
        <Smile className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">
          No tenant happiness data
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add tenants to see happiness metrics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {averageScore > 80 ? (
              <Smile className="h-8 w-8 text-green-500" />
            ) : averageScore > 50 ? (
              <Meh className="h-8 w-8 text-amber-500" />
            ) : (
              <Frown className="h-8 w-8 text-red-500" />
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary-foreground glow-text">
              {averageScore}%
            </h3>
            <p className="text-muted-foreground">Average Happiness</p>
          </div>
        </div>
        <div className="space-y-1 text-right">
          <div className="text-sm text-muted-foreground">Active Tenants</div>
          <div className="text-xl font-bold text-primary-foreground">
            {tenants.length}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tenants.map((tenant) => (
          <motion.div
            key={tenant.id}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="p-4 rounded-lg border border-border bg-card/50"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {tenant.happinessScore > 80 ? (
                    <Smile className="h-5 w-5 text-green-500" />
                  ) : tenant.happinessScore > 50 ? (
                    <Meh className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Frown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-primary-foreground">
                    {tenant.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {tenant.property.address}, {tenant.property.city},{" "}
                    {tenant.property.state}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-primary-foreground">
                  {tenant.happinessScore}%
                </div>
                <div className="text-xs text-green-500">↑ Improving</div>
              </div>
            </div>
            <Progress
              value={tenant.happinessScore}
              className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-green-500"
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center"
        >
          <Wrench className="mr-2 h-4 w-4" />
          Approve Repair
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center"
        >
          <Gift className="mr-2 h-4 w-4" />
          Send Gift
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Check In
        </Button>
      </div>
    </div>
  );
}
