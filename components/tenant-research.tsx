"use client";

import { useState, useEffect } from "react";
import {
  UserPlus,
  Upload,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

export function TenantResearch() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    propertyId: "",
  });
  const { toast } = useToast();

  const [result, setResult] = useState<null | {
    score: number;
    recommendation: "approve" | "review" | "reject";
    credit: number;
    rentalHistory: "good" | "average" | "poor";
    background: "clear" | "flags";
  }>(null);

  // Fetch properties for the dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, propertyId: value }));
  };

  const runCheck = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.propertyId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResult(null);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          // Simulate result
          setResult({
            score: 78,
            recommendation: "review",
            credit: 680,
            rentalHistory: "good",
            background: "clear",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleSaveResults = async () => {
    if (!result || !formData.propertyId) return;

    try {
      // Create a new tenant with the research results
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: "Not provided", // Default value
          leaseStart: new Date().toISOString(),
          leaseEnd: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ).toISOString(), // 1 year lease
          status: result.recommendation === "approve" ? "active" : "pending",
          rentAmount: 0, // Will be set later
          happinessScore: 0, // New tenant
          propertyId: formData.propertyId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tenant");
      }

      const data = await response.json();

      // Sync the portfolio to ensure all rent amounts are updated
      try {
        await fetch("/api/portfolio/sync", {
          method: "POST",
        });
      } catch (syncError) {
        console.error("Error syncing portfolio:", syncError);
      }

      toast({
        title: "Success!",
        description: "Tenant has been added to the system.",
      });

      // Refresh the page to update all components
      setTimeout(() => {
        window.location.reload();
      }, 500);

      // Reset form
      setFormData({
        name: "",
        email: "",
        propertyId: "",
      });
      setResult(null);
    } catch (err) {
      console.error("Error creating tenant:", err);
      toast({
        title: "Error",
        description: "Failed to save tenant. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-border bg-card/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-primary-foreground">
            Tenant Screening
          </h3>
          {isRunning && (
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Processing</div>
              <Progress value={progress} className="w-20 h-2" />
            </div>
          )}
        </div>

        {isRunning && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mb-4 flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-primary/50" />
              </div>
              <div className="h-4 w-48 bg-primary/10 rounded mb-2"></div>
              <div className="h-3 w-36 bg-primary/10 rounded mb-4"></div>
            </div>
            <Progress value={progress} className="w-full h-2 mt-4" />
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  result.recommendation === "approve"
                    ? "bg-green-500/10"
                    : result.recommendation === "review"
                    ? "bg-amber-500/10"
                    : "bg-red-500/10"
                }`}
              >
                {result.recommendation === "approve" ? (
                  <CheckCircle
                    className="h-10 w-10 text-green-500"
                    strokeWidth={1.5}
                  />
                ) : result.recommendation === "review" ? (
                  <AlertTriangle
                    className="h-10 w-10 text-amber-500"
                    strokeWidth={1.5}
                  />
                ) : (
                  <XCircle
                    className="h-10 w-10 text-red-500"
                    strokeWidth={1.5}
                  />
                )}
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-primary-foreground">
                {result.score}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
              <Badge
                className={
                  result.recommendation === "approve"
                    ? "bg-green-500"
                    : result.recommendation === "review"
                    ? "bg-amber-500"
                    : "bg-red-500"
                }
              >
                {result.recommendation === "approve"
                  ? "Approve"
                  : result.recommendation === "review"
                  ? "Review"
                  : "Reject"}
              </Badge>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Credit Score
                </span>
                <span className="text-sm font-medium text-primary-foreground">
                  {result.credit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Rental History
                </span>
                <span
                  className={`text-sm font-medium ${
                    result.rentalHistory === "good"
                      ? "text-green-500"
                      : result.rentalHistory === "average"
                      ? "text-amber-500"
                      : "text-red-500"
                  }`}
                >
                  {result.rentalHistory.charAt(0).toUpperCase() +
                    result.rentalHistory.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Background Check
                </span>
                <span
                  className={`text-sm font-medium ${
                    result.background === "clear"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {result.background === "clear" ? "Clear" : "Flags Found"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">
                <Lock className="mr-2 h-4 w-4" />
                Full Report
              </Button>
              <Button className="flex-1" onClick={handleSaveResults}>
                Save Results
              </Button>
            </div>
          </div>
        )}

        {!isRunning && !result && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Applicant Name
              </label>
              <Input
                placeholder="Enter full name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter email address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Property
              </label>
              <Select
                value={formData.propertyId}
                onValueChange={handlePropertyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.address}, {property.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Upload Documents
              </Button>
              <Button onClick={runCheck} className="flex-1">
                <UserPlus className="mr-2 h-4 w-4" />
                Run Check
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Powered by AI Tenant Research.{" "}
          <a href="#" className="text-primary underline">
            Upgrade
          </a>{" "}
          for unlimited checks.
        </p>
      </div>
    </div>
  );
}
