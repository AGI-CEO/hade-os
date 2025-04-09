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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Camera,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type MaintenanceRequest = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
};

export default function MaintenancePage() {
  const { data: session } = useSession();
  const [tenantData, setTenantData] = useState<any>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<
    MaintenanceRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
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
        setMaintenanceRequests(data.maintenanceRequests || []);
      } catch (error) {
        console.error("Error fetching tenant data:", error);
        toast({
          title: "Error",
          description: "Failed to load your maintenance requests",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, priority: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/maintenance-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          propertyId: tenantData.propertyId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create maintenance request");
      }

      const newRequest = await response.json();

      setMaintenanceRequests((prev) => [newRequest, ...prev]);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
      });
      setShowNewRequestForm(false);

      toast({
        title: "Success",
        description: "Maintenance request submitted successfully",
      });
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      toast({
        title: "Error",
        description: "Failed to submit maintenance request",
        variant: "destructive",
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "in-progress":
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Maintenance Requests
        </h1>
        <p className="text-muted-foreground">
          Submit and track maintenance requests for your rental property
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Requests</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowNewRequestForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </div>

          <TabsContent value="active" className="mt-4">
            {loading ? (
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-card border-border animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-6 w-48 bg-primary/10 rounded mb-2"></div>
                      <div className="h-4 w-24 bg-primary/10 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-primary/10 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : maintenanceRequests.filter((req) => req.status !== "completed")
                .length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium text-primary-foreground mb-2">
                    No Active Requests
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any active maintenance requests. Click "New
                    Request" to submit one.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {maintenanceRequests
                  .filter((req) => req.status !== "completed")
                  .map((request) => (
                    <Card key={request.id} className="bg-card border-border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-primary-foreground">
                              {request.title}
                            </CardTitle>
                            <CardDescription>
                              Submitted on{" "}
                              {new Date(request.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(request.priority)}
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {request.description}
                        </p>
                      </CardContent>
                      <CardFooter className="border-t border-border pt-4 flex justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getStatusIcon(request.status)}
                          <span>
                            {request.status === "pending"
                              ? "Awaiting review"
                              : request.status === "in-progress"
                              ? "Work in progress"
                              : "Completed"}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            {loading ? (
              <div className="grid gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="bg-card border-border animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-6 w-48 bg-primary/10 rounded mb-2"></div>
                      <div className="h-4 w-24 bg-primary/10 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-primary/10 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : maintenanceRequests.filter((req) => req.status === "completed")
                .length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium text-primary-foreground mb-2">
                    No Completed Requests
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You don't have any completed maintenance requests yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {maintenanceRequests
                  .filter((req) => req.status === "completed")
                  .map((request) => (
                    <Card key={request.id} className="bg-card border-border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-primary-foreground">
                              {request.title}
                            </CardTitle>
                            <CardDescription>
                              Completed on{" "}
                              {new Date(request.updatedAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(request.priority)}
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {request.description}
                        </p>
                      </CardContent>
                      <CardFooter className="border-t border-border pt-4 flex justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Completed</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showNewRequestForm && (
        <Card className="bg-card border-border mt-6">
          <CardHeader>
            <CardTitle className="text-primary-foreground">
              New Maintenance Request
            </CardTitle>
            <CardDescription>
              Please provide details about the issue that needs attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide detailed information about the issue"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={handlePriorityChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Add Photos (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop photos here, or click to browse
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    Upload Photos
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewRequestForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
