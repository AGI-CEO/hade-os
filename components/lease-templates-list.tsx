"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, Edit, Copy, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type LeaseTemplate = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export function LeaseTemplatesList() {
  const [templates, setTemplates] = useState<LeaseTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch templates data
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/lease-templates");

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        console.error("Error fetching templates:", err);
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

    fetchTemplates();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading templates...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-6">
        <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">Error loading data</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button size="sm" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  // Show empty state
  if (templates.length === 0) {
    return (
      <div className="text-center py-6">
        <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <h3 className="font-medium text-primary-foreground mb-1">No templates found</h3>
        <p className="text-sm text-muted-foreground mb-4">Create a template to get started</p>
        <Link href="/dashboard/leases/templates/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-primary-foreground">Lease Templates</h2>
        <Link href="/dashboard/leases/templates/new">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-primary-foreground">{template.name}</CardTitle>
              {template.description && (
                <CardDescription>{template.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Last updated: {formatDate(template.updatedAt)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Link href={`/dashboard/leases/templates/${template.id}`}>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Link href={`/dashboard/leases/new?templateId=${template.id}`}>
                <Button size="sm">
                  <Copy className="h-4 w-4 mr-1" />
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
