"use client";

import { useRouter } from "next/navigation";
import { DocumentViewer } from "@/components/document-viewer";
import { useToast } from "@/components/ui/use-toast";

export default function TenantDocumentViewerClient({
  documentId,
}: {
  documentId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  
  const handleBack = () => {
    router.push("/connect/documents");
  };
  
  const handleDelete = () => {
    router.push("/connect/documents");
    toast({
      title: "Success",
      description: "Document deleted successfully",
    });
  };
  
  return (
    <DocumentViewer
      documentId={documentId}
      userType="tenant"
      onBack={handleBack}
      onDelete={handleDelete}
    />
  );
}
