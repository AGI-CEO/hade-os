"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save, AlertCircle, Loader2, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type LeaseTemplate = {
  id: string;
  name: string;
  description: string;
};

type LeaseGeneratorProps = {
  initialTemplateId?: string;
};

export function LeaseGenerator({
  initialTemplateId = "",
}: LeaseGeneratorProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const [propertyId, setPropertyId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [status, setStatus] = useState("draft");

  // Data state
  const [templates, setTemplates] = useState<LeaseTemplate[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch templates
        const templatesResponse = await fetch("/api/lease-templates");
        if (!templatesResponse.ok) {
          throw new Error("Failed to fetch templates");
        }
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData);

        // Fetch properties
        const propertiesResponse = await fetch("/api/properties");
        if (!propertiesResponse.ok) {
          throw new Error("Failed to fetch properties");
        }
        const propertiesData = await propertiesResponse.json();
        setProperties(propertiesData);

        // Fetch tenants
        const tenantsResponse = await fetch("/api/tenants");
        if (!tenantsResponse.ok) {
          throw new Error("Failed to fetch tenants");
        }
        const tenantsData = await tenantsResponse.json();
        setTenants(tenantsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load required data.");
        toast({
          title: "Error",
          description: "Failed to load required data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      setError(null);

      // Validate form
      if (
        !templateId ||
        !propertyId ||
        !tenantId ||
        !startDate ||
        !endDate ||
        !monthlyRent
      ) {
        setError("All fields except security deposit are required.");
        return;
      }

      // Validate dates
      if (startDate >= endDate) {
        setError("End date must be after start date.");
        return;
      }

      // Validate rent amount
      const rentAmount = parseFloat(monthlyRent);
      if (isNaN(rentAmount) || rentAmount <= 0) {
        setError("Monthly rent must be a positive number.");
        return;
      }

      // Validate security deposit if provided
      let depositAmount = 0;
      if (securityDeposit) {
        depositAmount = parseFloat(securityDeposit);
        if (isNaN(depositAmount) || depositAmount < 0) {
          setError("Security deposit must be a non-negative number.");
          return;
        }
      }

      // Generate lease
      const response = await fetch("/api/leases/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          propertyId,
          tenantId,
          startDate,
          endDate,
          monthlyRent: rentAmount,
          securityDeposit: depositAmount || undefined,
          status,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to generate lease");
      }

      const lease = await response.json();

      toast({
        title: "Success",
        description: "Lease generated successfully.",
      });

      // Redirect to the new lease
      router.push(`/dashboard/leases/${lease.id}`);
    } catch (err: any) {
      console.error("Error generating lease:", err);
      setError(err.message || "Failed to generate lease.");
      toast({
        title: "Error",
        description: err.message || "Failed to generate lease.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-primary-foreground flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Generate New Lease
        </CardTitle>
        <CardDescription>
          Create a new lease by selecting a template, property, and tenant.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-500/10 p-3 rounded-md flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-red-500">{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="template">Lease Template</Label>
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.length === 0 ? (
                <SelectItem value="none" disabled>
                  No templates available
                </SelectItem>
              ) : (
                templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {templates.length === 0 && (
            <p className="text-xs text-amber-500 mt-1">
              No templates available. Please create a template first.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="property">Property</Label>
          <Select value={propertyId} onValueChange={setPropertyId}>
            <SelectTrigger id="property">
              <SelectValue placeholder="Select a property" />
            </SelectTrigger>
            <SelectContent>
              {properties.length === 0 ? (
                <SelectItem value="none" disabled>
                  No properties available
                </SelectItem>
              ) : (
                properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.address}, {property.city}, {property.state}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenant">Tenant</Label>
          <Select value={tenantId} onValueChange={setTenantId}>
            <SelectTrigger id="tenant">
              <SelectValue placeholder="Select a tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenants.length === 0 ? (
                <SelectItem value="none" disabled>
                  No tenants available
                </SelectItem>
              ) : (
                tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name} ({tenant.email})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Lease Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="startDate"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Lease End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="endDate"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => date < (startDate || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
            <Input
              id="monthlyRent"
              type="number"
              min="0"
              step="0.01"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              placeholder="1500.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityDeposit">Security Deposit ($)</Label>
            <Input
              id="securityDeposit"
              type="number"
              min="0"
              step="0.01"
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              placeholder="1500.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Lease Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Draft leases can be edited before finalizing. Active leases will
            update tenant records.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Generate Lease
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
