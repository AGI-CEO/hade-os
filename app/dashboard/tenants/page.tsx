"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MessageSquare,
  FileText,
  UserPlus,
  Smile,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TenantsList } from "@/components/tenants-list";
import { TenantHappiness } from "@/components/tenant-happiness";
import { LeaseManagement } from "@/components/lease-management";
import { TenantResearch } from "@/components/tenant-research";
import { useToast } from "@/components/ui/use-toast";

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "pending" | "past"
  >("all");
  const [showAddTenant, setShowAddTenant] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Tenants
        </h1>
        <p className="text-muted-foreground">
          Manage your tenants, leases, and communications
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              className="pl-9 bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button onClick={() => setShowAddTenant(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all" onClick={() => setFilterStatus("all")}>
              All
            </TabsTrigger>
            <TabsTrigger
              value="active"
              onClick={() => setFilterStatus("active")}
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              onClick={() => setFilterStatus("pending")}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger value="past" onClick={() => setFilterStatus("past")}>
              Past
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={filterStatus}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TenantsList
                  filterStatus={filterStatus}
                  searchQuery={searchQuery}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <Smile className="mr-2 h-5 w-5 text-primary" />
              Tenant Happiness
            </CardTitle>
            <CardDescription>
              Monitor tenant satisfaction and take action to improve it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TenantHappiness />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-primary" />
              Recent Communications
            </CardTitle>
            <CardDescription>Latest messages and requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-medium text-sm">JS</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-primary-foreground">
                      John Smith
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      2h ago
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Requested maintenance for kitchen sink
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-medium text-sm">AR</span>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-primary-foreground">
                      Alice Rodriguez
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      1d ago
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rent payment confirmed for May
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <MessageSquare className="mr-2 h-4 w-4" />
              View All Messages
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Lease Management
            </CardTitle>
            <CardDescription>Track and manage tenant leases</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaseManagement />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-primary-foreground flex items-center">
              <UserPlus className="mr-2 h-5 w-5 text-primary" />
              Tenant Research
            </CardTitle>
            <CardDescription>
              Screen potential tenants with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TenantResearch />
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {showAddTenant && (
          <AddTenantModal onClose={() => setShowAddTenant(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddTenantModal({ onClose }: { onClose: () => void }) {
  const [properties, setProperties] = useState<
    Array<{ id: string; address: string; city: string; state: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    propertyId: "",
    leaseStart: new Date().toISOString().split("T")[0],
    leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
    rentAmount: "",
  });
  const { toast } = useToast();

  // Fetch properties for dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchProperties();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.propertyId
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          leaseStart: formData.leaseStart,
          leaseEnd: formData.leaseEnd,
          status: "active",
          rentAmount: parseFloat(formData.rentAmount) || 0,
          happinessScore: 80, // Default happiness score for new tenants
          propertyId: formData.propertyId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tenant");
      }

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
        description: "Tenant has been added successfully.",
      });

      // Refresh the page to update all components
      setTimeout(() => {
        window.location.reload();
      }, 500);

      onClose();
    } catch (error) {
      console.error("Error creating tenant:", error);
      toast({
        title: "Error",
        description: "Failed to add tenant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-primary-foreground mb-4">
            Add New Tenant
          </h2>
          <p className="text-muted-foreground mb-6">
            Enter tenant details or use AI to screen potential tenants
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-foreground">
                  First Name
                </label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-foreground">
                  Last Name
                </label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Email
              </label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="john.smith@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Phone
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Property
              </label>
              <select
                name="propertyId"
                value={formData.propertyId}
                onChange={handleInputChange}
                className="w-full h-10 px-3 rounded-md border border-border bg-card text-primary-foreground"
              >
                <option value="">Select a property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.address}, {property.city}, {property.state}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-foreground">
                  Lease Start Date
                </label>
                <Input
                  name="leaseStart"
                  value={formData.leaseStart}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-foreground">
                  Lease End Date
                </label>
                <Input
                  name="leaseEnd"
                  value={formData.leaseEnd}
                  onChange={handleInputChange}
                  type="date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary-foreground">
                Monthly Rent
              </label>
              <Input
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleInputChange}
                type="number"
                placeholder="2000"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard/tenants?screen=true")}
                disabled={loading}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Screen with AI
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
                    Adding...
                  </>
                ) : (
                  "Add Tenant"
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
