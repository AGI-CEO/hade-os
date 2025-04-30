"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Plus, X } from "lucide-react";
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

type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
};

type Tenant = {
  id: string;
  name: string;
  email: string;
};

type Lease = {
  id: string;
  title: string;
};

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

export default function DocumentsClient() {
  const { toast } = useToast();
  
  // Data state
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  
  // UI state
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch properties, tenants, and leases
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch properties
        const propertiesResponse = await fetch("/api/properties");
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          setProperties(propertiesData);
        }
        
        // Fetch tenants
        const tenantsResponse = await fetch("/api/tenants");
        if (tenantsResponse.ok) {
          const tenantsData = await tenantsResponse.json();
          setTenants(tenantsData);
        }
        
        // Fetch leases
        const leasesResponse = await fetch("/api/leases");
        if (leasesResponse.ok) {
          const leasesData = await leasesResponse.json();
          setLeases(leasesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
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
          userType="landlord"
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
            userType="landlord"
            onViewDocument={handleViewDocument}
          />
        </>
      )}
      
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload and categorize a new document
            </DialogDescription>
          </DialogHeader>
          
          <DocumentUploader
            properties={properties}
            tenants={tenants}
            leases={leases}
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUploadDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
