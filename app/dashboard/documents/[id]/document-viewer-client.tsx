"use client";

import { useRouter } from "next/navigation";
import { DocumentViewer } from "@/components/document-viewer";
import { useToast } from "@/components/ui/use-toast";

export default function DocumentViewerClient({
  documentId,
}: {
  documentId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  
  const handleBack = () => {
    router.push("/dashboard/documents");
  };
  
  const handleDelete = () => {
    router.push("/dashboard/documents");
    toast({
      title: "Success",
      description: "Document deleted successfully",
    });
  };
  
  return (
    <DocumentViewer
      documentId={documentId}
      userType="landlord"
      onBack={handleBack}
      onDelete={handleDelete}
    />
  );
}
