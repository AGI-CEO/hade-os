"use client";

import { useState } from "react";
import { FileText, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentUploader } from "@/components/document-uploader";
import { DocumentList } from "@/components/document-list";
import { DocumentViewer } from "@/components/document-viewer";
import { useToast } from "@/components/ui/use-toast";

type Document = {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  isShared: boolean;
  createdAt: string;
  property?: {
    id: string;
    address: string;
    city: string;
    state: string;
  };
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
  lease?: {
    id: string;
    title: string;
  };
};

export default function TenantDocumentsClient() {
  const { toast } = useToast();
  
  // UI state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  // Handle document upload success
  const handleUploadSuccess = (document: Document) => {
    setShowUploadDialog(false);
    toast({
      title: "Success",
      description: "Document uploaded successfully",
    });
  };
  
  // Handle document view
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
  };
  
  // Handle document delete
  const handleDocumentDeleted = () => {
    setSelectedDocument(null);
    toast({
      title: "Success",
      description: "Document deleted successfully",
    });
  };
  
  return (
    <div>
      {selectedDocument ? (
        <DocumentViewer
          documentId={selectedDocument.id}
          userType="tenant"
          onBack={() => setSelectedDocument(null)}
          onDelete={handleDocumentDeleted}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
          
          <DocumentList
            userType="tenant"
            onViewDocument={handleViewDocument}
          />
        </>
      )}
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document to share with your landlord
            </DialogDescription>
          </DialogHeader>
          
          <DocumentUploader
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
