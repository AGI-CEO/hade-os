import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentViewerClient from "./document-viewer-client";

export default function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/documents">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">
          Document Details
        </h1>
      </div>
      
      <Suspense fallback={<div>Loading document...</div>}>
        <DocumentViewerClient documentId={params.id} />
      </Suspense>
    </div>
  );
}
