"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

type DocumentUploaderProps = {
  properties?: Property[];
  tenants?: Tenant[];
  leases?: Lease[];
  onSuccess?: (document: any) => void;
  onCancel?: () => void;
};

export function DocumentUploader({
  properties = [],
  tenants = [],
  leases = [],
  onSuccess,
  onCancel,
}: DocumentUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [propertyId, setPropertyId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [leaseId, setLeaseId] = useState("");
  const [isShared, setIsShared] = useState(false);
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // UI state
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    // Set default name from file name if not already set
    if (!name) {
      setName(selectedFile.name.split('.')[0]);
    }
    
    // Create a preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);
      
      // Validate form
      if (!name.trim()) {
        setError("Document name is required");
        return;
      }
      
      if (!file) {
        setError("Please select a file to upload");
        return;
      }
      
      // Upload the file
      const formData = new FormData();
      formData.append("file", file);
      
      const uploadResponse = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.message || "Failed to upload file");
      }
      
      const uploadData = await uploadResponse.json();
      
      // Create the document record
      const documentResponse = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          fileUrl: uploadData.fileUrl,
          fileType: uploadData.fileType,
          fileSize: uploadData.fileSize,
          category,
          isShared,
          propertyId: propertyId || undefined,
          tenantId: tenantId || undefined,
          leaseId: leaseId || undefined,
        }),
      });
      
      if (!documentResponse.ok) {
        const data = await documentResponse.json();
        throw new Error(data.message || "Failed to create document record");
      }
      
      const document = await documentResponse.json();
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      
      // Reset form
      setName("");
      setDescription("");
      setCategory("other");
      setPropertyId("");
      setTenantId("");
      setLeaseId("");
      setIsShared(false);
      setFile(null);
      setFilePreview(null);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(document);
      }
    } catch (err: any) {
      console.error("Error uploading document:", err);
      setError(err.message || "Failed to upload document");
      toast({
        title: "Error",
        description: err.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-primary-foreground flex items-center">
          <Upload className="mr-2 h-5 w-5 text-primary" />
          Upload Document
        </CardTitle>
        <CardDescription>
          Upload and categorize documents for your properties and tenants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-500/10 p-3 rounded-md flex items-start gap-2 text-sm">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-red-500">{error}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="file">Document File</Label>
          {!file ? (
            <div
              className="border-2 border-dashed border-border rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, Word, Excel, Images, etc.
              </p>
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="border border-border rounded-md p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {filePreview && (
                <div className="mt-3 border border-border rounded-md overflow-hidden">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
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
          <Label htmlFor="description">Description (Optional)</Label>
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
        
        {properties.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="property">Property (Optional)</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger id="property">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.address}, {property.city}, {property.state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {tenants.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="tenant">Tenant (Optional)</Label>
            <Select value={tenantId} onValueChange={setTenantId}>
              <SelectTrigger id="tenant">
                <SelectValue placeholder="Select a tenant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name} ({tenant.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {leases.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="lease">Lease (Optional)</Label>
            <Select value={leaseId} onValueChange={setLeaseId}>
              <SelectTrigger id="lease">
                <SelectValue placeholder="Select a lease" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {leases.map((lease) => (
                  <SelectItem key={lease.id} value={lease.id}>
                    {lease.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
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
      </CardContent>
      <CardFooter className="flex justify-between">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
