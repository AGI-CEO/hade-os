"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Share,
  X,
  Edit,
  Save,
  Trash,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  updatedAt: string;
  property?: {
    id: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
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

type DocumentViewerProps = {
  documentId: string;
  userType?: "landlord" | "tenant";
  onBack?: () => void;
  onDelete?: () => void;
};

export function DocumentViewer({
  documentId,
  userType = "landlord",
  onBack,
  onDelete,
}: DocumentViewerProps) {
  const { toast } = useToast();
  
  // Document state
  const [document, setDocument] = useState<Document | null>(null);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isShared, setIsShared] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Document categories
  const categories = [
    { value: "lease", label: "Lease Agreement" },
    { value: "financial", label: "Financial Document" },
    { value: "maintenance", label: "Maintenance Record" },
    { value: "legal", label: "Legal Document" },
    { value: "insurance", label: "Insurance" },
    { value: "tax", label: "Tax Document" },
    { value: "receipt", label: "Receipt" },
    { value: "other", label: "Other" },
  ];
  
  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/documents/${documentId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch document");
        }
        
        const data = await response.json();
        setDocument(data);
        
        // Initialize edit form
        setName(data.name);
        setDescription(data.description || "");
        setCategory(data.category);
        setIsShared(data.isShared);
      } catch (err: any) {
        console.error("Error fetching document:", err);
        setError(err.message || "Failed to load document");
        toast({
          title: "Error",
          description: err.message || "Failed to load document",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
  }, [documentId, toast]);
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Handle document download
  const handleDownload = () => {
    if (document) {
      window.open(document.fileUrl, "_blank");
    }
  };
  
  // Handle document sharing
  const handleShareToggle = async () => {
    if (!document) return;
    
    try {
      const response = await fetch(`/api/documents/share`, {
        method: document.isShared ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: document.id,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${document.isShared ? "unshare" : "share"} document`);
      }
      
      // Update document in state
      setDocument((prev) => prev ? { ...prev, isShared: !prev.isShared } : null);
      setIsShared(!document.isShared);
      
      toast({
        title: "Success",
        description: `Document ${document.isShared ? "unshared" : "shared"} successfully`,
      });
    } catch (err: any) {
      console.error(`Error ${document.isShared ? "unsharing" : "sharing"} document:`, err);
      toast({
        title: "Error",
        description: err.message || `Failed to ${document.isShared ? "unshare" : "share"} document`,
        variant: "destructive",
      });
    }
  };
  
  // Handle save changes
  const handleSaveChanges = async () => {
    if (!document) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Validate form
      if (!name.trim()) {
        setError("Document name is required");
        return;
      }
      
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          category,
          isShared,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update document");
      }
      
      const updatedDocument = await response.json();
      setDocument(updatedDocument);
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating document:", err);
      setError(err.message || "Failed to update document");
      toast({
        title: "Error",
        description: err.message || "Failed to update document",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle delete document
  const handleDeleteDocument = async () => {
    if (!document) return;
    
    try {
      setDeleting(true);
      
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete document");
      }
      
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      
      // Call delete callback
      if (onDelete) {
        onDelete();
      }
    } catch (err: any) {
      console.error("Error deleting document:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    if (!document) return;
    
    setName(document.name);
    setDescription(document.description || "");
    setCategory(document.category);
    setIsShared(document.isShared);
    setIsEditing(false);
    setError(null);
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading document...</p>
      </div>
    );
  }
  
  // Show error state
  if (error || !document) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">Error loading document</h3>
        <p className="text-sm text-muted-foreground mb-4">{error || "Document not found"}</p>
        {onBack && (
          <Button size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Button>
        )}
      </div>
    );
  }
  
  // Determine if the document is an image
  const isImage = document.fileType.startsWith("image/");
  
  // Determine if the document is a PDF
  const isPdf = document.fileType.includes("pdf");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        
        {userType === "landlord" && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveChanges} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      <Card className="bg-card border-border">
        <CardHeader>
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter document name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief description of the document"
                  className="resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="share"
                  checked={isShared}
                  onCheckedChange={setIsShared}
                />
                <Label htmlFor="share" className="cursor-pointer">
                  Share with tenant
                </Label>
              </div>
            </div>
          ) : (
            <>
              <CardTitle className="text-primary-foreground flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                {document.name}
              </CardTitle>
              <CardDescription>
                {formatFileSize(document.fileSize)} • Uploaded on {formatDate(document.createdAt)}
              </CardDescription>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline">
                  {categories.find((c) => c.value === document.category)?.label || "Other"}
                </Badge>
                
                {document.isShared && (
                  <Badge className="bg-green-500">
                    <Share className="h-3 w-3 mr-1" />
                    Shared
                  </Badge>
                )}
              </div>
              
              {document.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {document.description}
                </p>
              )}
            </>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="border border-border rounded-md overflow-hidden bg-muted/30">
            {isImage ? (
              <img
                src={document.fileUrl}
                alt={document.name}
                className="max-w-full mx-auto"
                style={{ maxHeight: "500px" }}
              />
            ) : isPdf ? (
              <iframe
                src={`${document.fileUrl}#view=FitH`}
                className="w-full"
                style={{ height: "500px" }}
                title={document.name}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Preview not available for this file type
                </p>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download to View
                </Button>
              </div>
            )}
          </div>
          
          {!isEditing && (
            <div className="mt-6 space-y-4">
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {document.property && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Associated Property
                    </h4>
                    <p className="text-primary-foreground">
                      {document.property.address}, {document.property.city}, {document.property.state}
                    </p>
                  </div>
                )}
                
                {document.tenant && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Associated Tenant
                    </h4>
                    <p className="text-primary-foreground">
                      {document.tenant.name} ({document.tenant.email})
                    </p>
                  </div>
                )}
                
                {document.lease && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Associated Lease
                    </h4>
                    <p className="text-primary-foreground">{document.lease.title}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {userType === "landlord" && !isEditing && (
            <Button variant="outline" onClick={handleShareToggle}>
              {document.isShared ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Unshare
                </>
              ) : (
                <>
                  <Share className="mr-2 h-4 w-4" />
                  Share with Tenant
                </>
              )}
            </Button>
          )}
          
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteDocument}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
