"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RentPaymentHistory from "@/components/tenants/RentPaymentHistory";
import AccountSettings from "@/components/tenants/AccountSettings";

const TenantDashboardPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tenant Dashboard</h1>
      <Tabs defaultValue="rent-payments">
        <TabsList>
          <TabsTrigger value="rent-payments">Rent Payments</TabsTrigger>
          <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="rent-payments">
          <RentPaymentHistory />
        </TabsContent>
        <TabsContent value="account-settings">
          <AccountSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboardPage;
