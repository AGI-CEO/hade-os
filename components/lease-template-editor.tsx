"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save, Trash, AlertCircle, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

type LeaseTemplateEditorProps = {
  templateId?: string;
};

export function LeaseTemplateEditor({ templateId }: LeaseTemplateEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isEditing = !!templateId;

  // Fetch template data if editing
  useEffect(() => {
    if (templateId) {
      const fetchTemplate = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch(`/api/lease-templates/${templateId}`);

          if (!response.ok) {
            throw new Error("Failed to fetch template");
          }

          const data = await response.json();
          setName(data.name);
          setDescription(data.description || "");
          setContent(data.content);
        } catch (err) {
          console.error("Error fetching template:", err);
          setError("Failed to load template data.");
          toast({
            title: "Error",
            description: "Failed to load template data.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchTemplate();
    }
  }, [templateId, toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validate form
      if (!name.trim() || !content.trim()) {
        setError("Name and content are required.");
        return;
      }

      const url = isEditing
        ? `/api/lease-templates/${templateId}`
        : "/api/lease-templates";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      toast({
        title: "Success",
        description: isEditing
          ? "Template updated successfully."
          : "Template created successfully.",
      });

      // Redirect to templates list
      router.push("/dashboard/leases/templates");
    } catch (err) {
      console.error("Error saving template:", err);
      setError("Failed to save template.");
      toast({
        title: "Error",
        description: "Failed to save template.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/lease-templates/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete template");
      }

      toast({
        title: "Success",
        description: "Template deleted successfully.",
      });

      // Redirect to templates list
      router.push("/dashboard/leases/templates");
    } catch (err: any) {
      console.error("Error deleting template:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete template.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteDialog(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading template data...</p>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-primary-foreground flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          {isEditing ? "Edit Lease Template" : "Create Lease Template"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your lease template with property and tenant variables."
            : "Create a new lease template with property and tenant variables."}
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
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Residential Lease Agreement"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Standard lease agreement for residential properties"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Template Content</Label>
          <div className="bg-muted/50 p-3 rounded-md text-xs mb-2">
            <p className="font-medium mb-1">Available Variables:</p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{PROPERTY_ADDRESS}"}
              </code>{" "}
              - Property street address
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{PROPERTY_CITY}"}
              </code>{" "}
              - Property city
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{PROPERTY_STATE}"}
              </code>{" "}
              - Property state
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{PROPERTY_ZIP}"}
              </code>{" "}
              - Property ZIP code
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{TENANT_NAME}"}
              </code>{" "}
              - Tenant's full name
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{LEASE_START_DATE}"}
              </code>{" "}
              - Lease start date
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{LEASE_END_DATE}"}
              </code>{" "}
              - Lease end date
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{MONTHLY_RENT}"}
              </code>{" "}
              - Monthly rent amount
            </p>
            <p>
              <code className="bg-muted px-1 py-0.5 rounded">
                {"{SECURITY_DEPOSIT}"}
              </code>{" "}
              - Security deposit amount
            </p>
          </div>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your lease template content here..."
            className="min-h-[400px] font-mono text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          {isEditing && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={saving || deleteLoading}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Template
            </Button>
          )}
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Template" : "Save Template"}
            </>
          )}
        </Button>
      </CardFooter>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Template"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
