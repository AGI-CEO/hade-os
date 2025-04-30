"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Trash,
  Share,
  AlertCircle,
  Loader2,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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

type DocumentListProps = {
  userType?: "landlord" | "tenant";
  propertyId?: string;
  tenantId?: string;
  leaseId?: string;
  category?: string;
  onViewDocument?: (document: Document) => void;
};

export function DocumentList({
  userType = "landlord",
  propertyId,
  tenantId,
  leaseId,
  category,
  onViewDocument,
}: DocumentListProps) {
  const { toast } = useToast();
  
  // Data state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(category || "all");
  const [sharedFilter, setSharedFilter] = useState<"all" | "shared" | "private">("all");
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  // Document categories
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "lease", label: "Lease Agreement" },
    { value: "financial", label: "Financial Document" },
    { value: "maintenance", label: "Maintenance Record" },
    { value: "legal", label: "Legal Document" },
    { value: "insurance", label: "Insurance" },
    { value: "tax", label: "Tax Document" },
    { value: "receipt", label: "Receipt" },
    { value: "other", label: "Other" },
  ];
  
  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (propertyId) params.append("propertyId", propertyId);
        if (tenantId) params.append("tenantId", tenantId);
        if (leaseId) params.append("leaseId", leaseId);
        if (category && category !== "all") params.append("category", category);
        
        const response = await fetch(`/api/documents?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        
        const data = await response.json();
        setDocuments(data);
      } catch (err: any) {
        console.error("Error fetching documents:", err);
        setError(err.message || "Failed to load documents");
        toast({
          title: "Error",
          description: err.message || "Failed to load documents",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [propertyId, tenantId, leaseId, category, toast]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...documents];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) ||
          (doc.description && doc.description.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((doc) => doc.category === categoryFilter);
    }
    
    // Apply shared filter
    if (sharedFilter !== "all") {
      filtered = filtered.filter(
        (doc) => doc.isShared === (sharedFilter === "shared")
      );
    }
    
    setFilteredDocuments(filtered);
  }, [documents, searchQuery, categoryFilter, sharedFilter]);
  
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
  
  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.includes("pdf")) return "📄";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return "📊";
    return "📁";
  };
  
  // Handle document selection
  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(id)
        ? prev.filter((docId) => docId !== id)
        : [...prev, id]
    );
  };
  
  // Handle select all
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id));
    }
  };
  
  // Handle document deletion
  const handleDeleteDocuments = async () => {
    try {
      setDeleting(true);
      
      const response = await fetch("/api/documents", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedDocuments,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete documents");
      }
      
      // Remove deleted documents from state
      setDocuments((prev) =>
        prev.filter((doc) => !selectedDocuments.includes(doc.id))
      );
      
      setSelectedDocuments([]);
      setShowDeleteDialog(false);
      
      toast({
        title: "Success",
        description: `${selectedDocuments.length} document(s) deleted successfully`,
      });
    } catch (err: any) {
      console.error("Error deleting documents:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete documents",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };
  
  // Handle document sharing
  const handleShareDocument = async (id: string, isCurrentlyShared: boolean) => {
    try {
      const response = await fetch(`/api/documents/share`, {
        method: isCurrentlyShared ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: id,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Failed to ${isCurrentlyShared ? "unshare" : "share"} document`);
      }
      
      // Update document in state
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, isShared: !isCurrentlyShared } : doc
        )
      );
      
      toast({
        title: "Success",
        description: `Document ${isCurrentlyShared ? "unshared" : "shared"} successfully`,
      });
    } catch (err: any) {
      console.error(`Error ${isCurrentlyShared ? "unsharing" : "sharing"} document:`, err);
      toast({
        title: "Error",
        description: err.message || `Failed to ${isCurrentlyShared ? "unshare" : "share"} document`,
        variant: "destructive",
      });
    }
  };
  
  // Handle document download
  const handleDownload = (document: Document) => {
    window.open(document.fileUrl, "_blank");
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading documents...</p>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">Error loading documents</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button size="sm" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  // Show empty state
  if (documents.length === 0) {
    return (
      <div className="text-center py-6">
        <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">No documents found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {userType === "landlord"
            ? "Upload documents to get started"
            : "No documents have been shared with you yet"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {userType === "landlord" && (
            <Select value={sharedFilter} onValueChange={setSharedFilter as any}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="shared">Shared Only</SelectItem>
                <SelectItem value="private">Private Only</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {selectedDocuments.length > 0 && (
        <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedDocuments.length === filteredDocuments.length}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm">
              {selectedDocuments.length} document{selectedDocuments.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="bg-card border-border overflow-hidden">
            <div className="absolute top-2 right-2">
              <Checkbox
                checked={selectedDocuments.includes(document.id)}
                onCheckedChange={() => toggleDocumentSelection(document.id)}
                className="h-4 w-4"
              />
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-md flex-shrink-0">
                  <span className="text-xl">{getFileIcon(document.fileType)}</span>
                </div>
                <div>
                  <CardTitle className="text-base text-primary-foreground truncate">
                    {document.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {formatFileSize(document.fileSize)} • {formatDate(document.createdAt)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              {document.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {document.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {categories.find((c) => c.value === document.category)?.label || "Other"}
                </Badge>
                
                {document.isShared && (
                  <Badge className="bg-green-500 text-xs">
                    <Share className="h-3 w-3 mr-1" />
                    Shared
                  </Badge>
                )}
                
                {document.property && (
                  <Badge variant="outline" className="text-xs truncate max-w-[150px]">
                    {document.property.address}
                  </Badge>
                )}
                
                {document.tenant && (
                  <Badge variant="outline" className="text-xs truncate max-w-[150px]">
                    {document.tenant.name}
                  </Badge>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2">
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDocument?.(document)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                
                <div className="flex gap-2">
                  {userType === "landlord" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareDocument(document.id, document.isShared)}
                    >
                      {document.isShared ? (
                        <>
                          <X className="h-4 w-4 mr-1" />
                          Unshare
                        </>
                      ) : (
                        <>
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(document)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Documents</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedDocuments.length} document
              {selectedDocuments.length !== 1 ? "s" : ""}? This action cannot be undone.
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
              onClick={handleDeleteDocuments}
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
