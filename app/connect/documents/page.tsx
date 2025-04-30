import { Suspense } from "react";
import { FileText } from "lucide-react";
import TenantDocumentsClient from "./tenant-documents-client";

export default function TenantDocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Your Documents
        </h1>
        <p className="text-muted-foreground">
          View and manage documents shared with you by your landlord
        </p>
      </div>
      
      <Suspense fallback={<div>Loading documents...</div>}>
        <TenantDocumentsClient />
      </Suspense>
    </div>
  );
}
