"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Home,
  MoreHorizontal,
  Plus,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Define the Property type
type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image?: string;
  value: number;
  occupancy: string;
  rentAmount?: number;
  rentDue?: string;
  dateAdded: string;
  userId: string;
};

type PropertyDashboardProps = {
  filterStatus?: "all" | "occupied" | "vacant";
  sortBy?: "value" | "date" | "name";
};

// Form data type
type PropertyFormData = {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image?: string;
  value: number;
  occupancy: string;
  rentAmount?: number;
  rentDue?: string;
};

export function PropertyDashboard({
  filterStatus = "all",
  sortBy = "value",
}: PropertyDashboardProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>();

  // Fetch properties from API
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
        setError("Failed to load properties. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle form submission
  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to add property");
      }

      const newProperty = await response.json();

      // Update the local state with the new property
      setProperties((prev) => [...prev, newProperty]);

      // Close the modal and reset the form
      setIsAddPropertyOpen(false);
      reset();

      // Show success message
      toast.success("Property added successfully!");
    } catch (err) {
      console.error("Error adding property:", err);
      toast.error("Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter properties based on occupancy status
  const filteredProperties = properties.filter((property) => {
    if (filterStatus === "all") return true;
    return property.occupancy === filterStatus;
  });

  // Sort properties based on selected criteria
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "value") return b.value - a.value;
    if (sortBy === "date")
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    return a.address.localeCompare(b.address); // sort by name
  });

  const property = selectedProperty
    ? properties.find((p) => p.id === selectedProperty)
    : null;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-primary-foreground">
            Loading properties...
          </span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {sortedProperties.length > 0 ? (
            sortedProperties.map((property) => (
              <motion.div
                key={property.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-lg overflow-hidden border border-border bg-card/50 cursor-pointer"
                onClick={() => setSelectedProperty(property.id)}
              >
                <div className="relative h-40">
                  <img
                    src={property.image || "/house-placeholder.svg"}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      property.occupancy === "occupied"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }`}
                  >
                    {property.occupancy === "occupied" ? "Occupied" : "Vacant"}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-primary-foreground truncate">
                    {property.address}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-primary glow-text">
                      {formatCurrency(property.value)}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Property</DropdownMenuItem>
                        <DropdownMenuItem>Remove Property</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                No properties found. Add your first property!
              </p>
            </div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative rounded-lg overflow-hidden border border-dashed border-border bg-card/30 cursor-pointer h-full min-h-[220px] flex flex-col items-center justify-center p-6"
            onClick={() => setIsAddPropertyOpen(true)}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium text-primary-foreground text-center">
              Add New Property
            </h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Expand your portfolio with a new investment
            </p>
          </motion.div>
        </div>
      )}

      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto"
            >
              {property && (
                <>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-primary-foreground">
                        Property Details
                      </h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedProperty(null)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="relative h-48 rounded-lg overflow-hidden mb-6">
                      <img
                        src={property.image || "/house-placeholder.svg"}
                        alt={property.address}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <Badge
                        className={`absolute top-2 right-2 ${
                          property.occupancy === "occupied"
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {property.occupancy === "occupied"
                          ? "Occupied"
                          : "Vacant"}
                      </Badge>
                    </div>

                    <div className="flex space-x-2 mb-6">
                      <Button
                        variant={
                          activeTab === "overview" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("overview")}
                        className="flex-1"
                      >
                        Overview
                      </Button>
                      <Button
                        variant={
                          activeTab === "tenants" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("tenants")}
                        className="flex-1"
                      >
                        Tenants
                      </Button>
                      <Button
                        variant={
                          activeTab === "financials" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("financials")}
                        className="flex-1"
                      >
                        Financials
                      </Button>
                      <Button
                        variant={
                          activeTab === "maintenance" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("maintenance")}
                        className="flex-1"
                      >
                        Maintenance
                      </Button>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {activeTab === "overview" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">
                                    Address
                                  </div>
                                  <div className="font-medium text-primary-foreground">
                                    {property.address}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">
                                    Property Value
                                  </div>
                                  <div className="font-medium text-primary-foreground">
                                    {formatCurrency(property.value)}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">
                                    Property Type
                                  </div>
                                  <div className="font-medium text-primary-foreground">
                                    Single Family
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="text-sm text-muted-foreground">
                                    Purchase Date
                                  </div>
                                  <div className="font-medium text-primary-foreground">
                                    {property.dateAdded}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                            <Button className="w-full">
                              <Building className="mr-2 h-4 w-4" />
                              Virtual Tour
                            </Button>
                          </div>
                        )}

                        {activeTab === "tenants" && (
                          <div className="space-y-4">
                            {property.occupancy === "occupied" ? (
                              <Card className="bg-card/50 border-border">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h3 className="font-medium text-primary-foreground">
                                        John Smith
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        Lease: Jan 2023 - Jan 2024
                                      </p>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <span className="text-primary font-medium">
                                        JS
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">
                                        Rent Payment
                                      </span>
                                      <span className="text-primary-foreground">
                                        Due May 1, 2023
                                      </span>
                                    </div>
                                    <Progress value={0} className="h-2" />
                                  </div>
                                  <Button className="w-full mt-4">
                                    Message Tenant
                                  </Button>
                                </CardContent>
                              </Card>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8">
                                <Home className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-primary-foreground mb-2">
                                  No Active Tenants
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  This property is currently vacant
                                </p>
                                <Button>Add Tenant</Button>
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === "financials" && (
                          <div className="space-y-4">
                            <Card className="bg-card/50 border-border">
                              <CardContent className="p-4">
                                <h3 className="font-medium text-primary-foreground mb-4">
                                  Monthly Cash Flow
                                </h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Rental Income
                                    </span>
                                    <span className="text-primary-foreground">
                                      {formatCurrency(property.rentAmount || 0)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Mortgage
                                    </span>
                                    <span className="text-primary-foreground">
                                      -$1,200
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Property Tax
                                    </span>
                                    <span className="text-primary-foreground">
                                      -$350
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Insurance
                                    </span>
                                    <span className="text-primary-foreground">
                                      -$100
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Maintenance
                                    </span>
                                    <span className="text-primary-foreground">
                                      -$150
                                    </span>
                                  </div>
                                  <div className="border-t border-border my-2" />
                                  <div className="flex justify-between font-medium">
                                    <span className="text-primary-foreground">
                                      Net Cash Flow
                                    </span>
                                    <span className="text-primary glow-text">
                                      {formatCurrency(
                                        (property.rentAmount || 0) - 1800
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Button className="w-full">
                              View Financial Projections
                            </Button>
                          </div>
                        )}

                        {activeTab === "maintenance" && (
                          <div className="space-y-4">
                            <Card className="bg-card/50 border-border">
                              <CardContent className="p-4">
                                <h3 className="font-medium text-primary-foreground mb-4">
                                  Maintenance Tickets
                                </h3>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-primary-foreground">
                                        Leaking Faucet
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Reported: Apr 28, 2023
                                      </p>
                                    </div>
                                    <Badge>In Progress</Badge>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium text-primary-foreground">
                                        HVAC Service
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Scheduled: May 15, 2023
                                      </p>
                                    </div>
                                    <Badge variant="outline">Scheduled</Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Button className="w-full">
                              Create Maintenance Ticket
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Property Modal */}
      <AnimatePresence>
        {isAddPropertyOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-primary-foreground">
                    Add New Property
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddPropertyOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="address"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        Street Address *
                      </label>
                      <Input
                        id="address"
                        placeholder="123 Main St"
                        {...register("address", {
                          required: "Address is required",
                        })}
                        className={errors.address ? "border-destructive" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        City *
                      </label>
                      <Input
                        id="city"
                        placeholder="Austin"
                        {...register("city", { required: "City is required" })}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="state"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        State *
                      </label>
                      <Input
                        id="state"
                        placeholder="TX"
                        {...register("state", {
                          required: "State is required",
                        })}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">
                          {errors.state.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="zipCode"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        Zip Code *
                      </label>
                      <Input
                        id="zipCode"
                        placeholder="78701"
                        {...register("zipCode", {
                          required: "Zip code is required",
                        })}
                        className={errors.zipCode ? "border-destructive" : ""}
                      />
                      {errors.zipCode && (
                        <p className="text-sm text-destructive">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="value"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        Property Value *
                      </label>
                      <Input
                        id="value"
                        type="number"
                        placeholder="450000"
                        {...register("value", {
                          required: "Property value is required",
                          valueAsNumber: true,
                          min: {
                            value: 1,
                            message: "Value must be greater than 0",
                          },
                        })}
                        className={errors.value ? "border-destructive" : ""}
                      />
                      {errors.value && (
                        <p className="text-sm text-destructive">
                          {errors.value.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="occupancy"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        Occupancy Status *
                      </label>
                      <select
                        id="occupancy"
                        className={`w-full px-3 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors.occupancy ? "border-destructive" : ""
                        }`}
                        {...register("occupancy", {
                          required: "Occupancy status is required",
                        })}
                      >
                        <option value="">Select status</option>
                        <option value="occupied">Occupied</option>
                        <option value="vacant">Vacant</option>
                      </select>
                      {errors.occupancy && (
                        <p className="text-sm text-destructive">
                          {errors.occupancy.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="rentAmount"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        Monthly Rent
                      </label>
                      <Input
                        id="rentAmount"
                        type="number"
                        placeholder="2000"
                        {...register("rentAmount", {
                          valueAsNumber: true,
                          min: { value: 0, message: "Rent cannot be negative" },
                        })}
                        className={
                          errors.rentAmount ? "border-destructive" : ""
                        }
                      />
                      {errors.rentAmount && (
                        <p className="text-sm text-destructive">
                          {errors.rentAmount.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="rentDue"
                        className="text-sm font-medium text-primary-foreground"
                      >
                        Next Rent Due Date
                      </label>
                      <Input
                        id="rentDue"
                        type="date"
                        {...register("rentDue")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="image"
                      className="text-sm font-medium text-primary-foreground"
                    >
                      Property Image URL
                    </label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      {...register("image")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter a URL for the property image
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddPropertyOpen(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Property"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
