"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { 
  CreditCard, 
  Home, 
  Calendar, 
  Bell, 
  Settings, 
  FileText,
  Wrench,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import RentPaymentHistory from "@/components/tenants/RentPaymentHistory";
import AccountSettings from "@/components/tenants/AccountSettings";

type TenantDashboardData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  status: string;
  rentAmount: number;
  happinessScore: number;
  property: {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    image?: string;
  };
  maintenanceRequests: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
  upcomingPayments: Array<{
    id: string;
    amountDue: number;
    dueDate: string;
    status: string;
  }>;
};

const TenantDashboardPage = () => {
  const { data: session } = useSession();
  const [tenantData, setTenantData] = useState<TenantDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setError("Failed to load your tenant information");
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

  // Calculate days until next rent is due
  const nextPaymentDue = tenantData?.upcomingPayments?.find(p => p.status === "UPCOMING" || p.status === "UNPAID");
  const daysUntilRentDue = nextPaymentDue
    ? Math.ceil((new Date(nextPaymentDue.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Count active maintenance requests
  const activeMaintenanceCount = tenantData?.maintenanceRequests?.filter(
    r => r.status !== "completed"
  ).length || 0;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-primary/10 rounded mb-2"></div>
            <div className="h-4 w-96 bg-primary/10 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-32 bg-primary/10 rounded"></div>
                  <div className="h-4 w-48 bg-primary/10 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 w-full bg-primary/10 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Unable to Load Dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
            Welcome back, {session?.user?.name || tenantData?.name || "Tenant"}
          </h1>
          <p className="text-muted-foreground">
            Manage your rental, payments, and maintenance requests
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Rent Payment Status */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center text-sm font-medium">
                <CreditCard className="mr-2 h-4 w-4" />
                Next Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextPaymentDue ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    ${nextPaymentDue.amountDue.toFixed(0)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      daysUntilRentDue && daysUntilRentDue > 7 ? "outline" : 
                      daysUntilRentDue && daysUntilRentDue > 0 ? "secondary" : "destructive"
                    }>
                      {daysUntilRentDue && daysUntilRentDue > 0 
                        ? `${daysUntilRentDue} days left`
                        : daysUntilRentDue === 0 
                        ? "Due today"
                        : "Overdue"
                      }
                    </Badge>
                  </div>
                  {daysUntilRentDue && daysUntilRentDue > 0 && (
                    <Progress value={Math.max(0, Math.min(100, 100 - (daysUntilRentDue * 3.33)))} className="h-1" />
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No upcoming payments
                </div>
              )}
            </CardContent>
          </Card>

          {/* Maintenance Requests */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-700 dark:text-orange-300 flex items-center text-sm font-medium">
                <Wrench className="mr-2 h-4 w-4" />
                Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {activeMaintenanceCount}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  {activeMaintenanceCount === 0 ? "No active requests" : "Active requests"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Info */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center text-sm font-medium">
                <Home className="mr-2 h-4 w-4" />
                Your Home
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-sm font-medium text-green-900 dark:text-green-100">
                  {tenantData?.property.address}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300">
                  {tenantData?.property.city}, {tenantData?.property.state}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lease Status */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center text-sm font-medium">
                <Calendar className="mr-2 h-4 w-4" />
                Lease Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant={tenantData?.status === "active" ? "default" : "secondary"}>
                  {tenantData?.status === "active" ? "Active" : tenantData?.status}
                </Badge>
                <div className="text-xs text-purple-700 dark:text-purple-300">
                  Until {tenantData?.leaseEnd ? new Date(tenantData.leaseEnd).toLocaleDateString() : "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest interactions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tenantData?.maintenanceRequests?.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className={`w-2 h-2 rounded-full ${
                          request.status === "completed" ? "bg-green-500" : 
                          request.status === "in-progress" ? "bg-blue-500" : "bg-orange-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{request.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                    {(!tenantData?.maintenanceRequests || tenantData.maintenanceRequests.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        No recent activity
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    Property Details
                  </CardTitle>
                  <CardDescription>Information about your rental property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tenantData?.property.image && (
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <img 
                        src={tenantData.property.image} 
                        alt="Property" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Address:</span>
                      <span className="text-sm font-medium">{tenantData?.property.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">City:</span>
                      <span className="text-sm font-medium">
                        {tenantData?.property.city}, {tenantData?.property.state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Rent:</span>
                      <span className="text-sm font-medium">
                        ${tenantData?.rentAmount?.toFixed(0) || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lease End:</span>
                      <span className="text-sm font-medium">
                        {tenantData?.leaseEnd ? new Date(tenantData.leaseEnd).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <RentPaymentHistory />
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-5 w-5" />
                  Maintenance Requests
                </CardTitle>
                <CardDescription>
                  Submit and track maintenance requests for your property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full">
                    <Wrench className="mr-2 h-4 w-4" />
                    Submit New Request
                  </Button>
                  
                  <div className="space-y-3">
                    {tenantData?.maintenanceRequests?.map((request) => (
                      <div key={request.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{request.title}</h4>
                          <Badge variant={
                            request.status === "completed" ? "default" :
                            request.status === "in-progress" ? "secondary" : "destructive"
                          }>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Priority: {request.priority}</span>
                          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                    {(!tenantData?.maintenanceRequests || tenantData.maintenanceRequests.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        No maintenance requests submitted yet
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <AccountSettings />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default TenantDashboardPage;
