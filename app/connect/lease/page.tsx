import { Suspense } from "react";
import { FileText } from "lucide-react";
import TenantLeaseClient from "./tenant-lease-client";

export default function TenantLeasePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Your Lease
        </h1>
        <p className="text-muted-foreground">
          View and manage your current lease agreement
        </p>
      </div>

      <Suspense fallback={<div>Loading lease information...</div>}>
        <TenantLeaseClient />
      </Suspense>
    </div>
  );
}
