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
import { Textarea } from "@/components/ui/textarea";
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

type LeaseEditorProps = {
  leaseId: string;
};

export function LeaseEditor({ leaseId }: LeaseEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [status, setStatus] = useState("");
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setTitle(data.title);
        setContent(data.content);
        setStartDate(new Date(data.startDate));
        setEndDate(new Date(data.endDate));
        setMonthlyRent(data.monthlyRent.toString());
        setSecurityDeposit(data.securityDeposit?.toString() || "");
        setStatus(data.status);
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
  
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validate form
      if (!title || !content || !startDate || !endDate || !monthlyRent || !status) {
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
      let depositAmount = undefined;
      if (securityDeposit) {
        depositAmount = parseFloat(securityDeposit);
        if (isNaN(depositAmount) || depositAmount < 0) {
          setError("Security deposit must be a non-negative number.");
          return;
        }
      }
      
      // Update lease
      const response = await fetch(`/api/leases/${leaseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          startDate,
          endDate,
          monthlyRent: rentAmount,
          securityDeposit: depositAmount,
          status,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update lease");
      }
      
      toast({
        title: "Success",
        description: "Lease updated successfully.",
      });
      
      // Redirect to the lease view
      router.push(`/dashboard/leases/${leaseId}`);
      
    } catch (err: any) {
      console.error("Error updating lease:", err);
      setError(err.message || "Failed to update lease.");
      toast({
        title: "Error",
        description: err.message || "Failed to update lease.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
  
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-primary-foreground flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          Edit Lease
        </CardTitle>
        <CardDescription>
          Update the lease details and content.
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
          <Label htmlFor="title">Lease Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Residential Lease Agreement"
          />
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
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="renewed">Renewed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Changing to "Active" will update tenant records with these lease details.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Lease Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
