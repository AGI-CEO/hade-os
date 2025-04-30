import { Suspense } from "react";
import { FileText, Upload, Plus } from "lucide-react";
import DocumentsClient from "./documents-client";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Document Management
        </h1>
        <p className="text-muted-foreground">
          Upload, organize, and share documents with your tenants
        </p>
      </div>
      
      <Suspense fallback={<div>Loading document management...</div>}>
        <DocumentsClient />
      </Suspense>
    </div>
  );
}
