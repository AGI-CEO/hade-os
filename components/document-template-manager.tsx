"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Share,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type DocumentTemplate = {
  id: string;
  name: string;
  description?: string;
  category: string;
  content: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};

type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
};

export function DocumentTemplateManager() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generationLoading, setGenerationLoading] = useState(false);

  const { toast } = useToast();

  // Form states
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    category: "notice",
    content: "",
  });

  const [generateForm, setGenerateForm] = useState({
    propertyId: "",
    tenantId: "",
    title: "",
    shareWithTenant: false,
    customVariables: {} as Record<string, string>,
  });

  // Fetch data
  useEffect(() => {
    fetchTemplates();
    fetchProperties();
    fetchTenants();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/document-templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Error",
        description: "Failed to load document templates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/tenants");
      if (response.ok) {
        const data = await response.json();
        setTenants(data);
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(templates.map(t => t.category)));

  // Create template
  const handleCreateTemplate = async () => {
    try {
      const response = await fetch("/api/document-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) throw new Error("Failed to create template");

      toast({
        title: "Success",
        description: "Template created successfully.",
      });

      setShowCreateDialog(false);
      setCreateForm({
        name: "",
        description: "",
        category: "notice",
        content: "",
      });
      fetchTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Failed to create template.",
        variant: "destructive",
      });
    }
  };

  // Generate document
  const handleGenerateDocument = async () => {
    if (!selectedTemplate || !generateForm.propertyId) {
      toast({
        title: "Error",
        description: "Please select a template and property.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerationLoading(true);
      const response = await fetch(`/api/document-templates/${selectedTemplate.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateForm),
      });

      if (!response.ok) throw new Error("Failed to generate document");

      const result = await response.json();

      // Open generated document in new window
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(result.content);
        newWindow.document.close();
      }

      toast({
        title: "Success",
        description: result.savedDocument ? 
          "Document generated and saved successfully." : 
          "Document generated successfully.",
      });

      setShowGenerateDialog(false);
      setGenerateForm({
        propertyId: "",
        tenantId: "",
        title: "",
        shareWithTenant: false,
        customVariables: {},
      });
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        title: "Error",
        description: "Failed to generate document.",
        variant: "destructive",
      });
    } finally {
      setGenerationLoading(false);
    }
  };

  // Delete template
  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await fetch(`/api/document-templates/${templateId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete template");

      toast({
        title: "Success",
        description: "Template deleted successfully.",
      });

      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive",
      });
    }
  };

  // Get filtered tenants for selected property
  const filteredTenants = generateForm.propertyId ? 
    tenants.filter(t => t.propertyId === generateForm.propertyId) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary-foreground glow-text">
          Document Templates
        </h1>
        <p className="text-muted-foreground">
          Create and manage document templates for notices, letters, and forms
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="generate">Generate Document</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-9 bg-card border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Create a custom document template with variables for personalization.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={createForm.category}
                        onValueChange={(value) => setCreateForm({ ...createForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="notice">Notice</SelectItem>
                          <SelectItem value="letter">Letter</SelectItem>
                          <SelectItem value="form">Form</SelectItem>
                          <SelectItem value="agreement">Agreement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={createForm.description}
                      onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                      placeholder="Brief description of the template"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Template Content</Label>
                    <Textarea
                      id="content"
                      rows={10}
                      value={createForm.content}
                      onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                      placeholder="Enter template content with variables like {TENANT_NAME}, {PROPERTY_ADDRESS}, etc."
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Available variables: {"{TENANT_NAME}"}, {"{PROPERTY_ADDRESS}"}, {"{CURRENT_DATE}"}, {"{LANDLORD_NAME}"}, and more.
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTemplate}>
                      Create Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full bg-card border-border hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-primary-foreground">
                          {template.name}
                        </CardTitle>
                        {template.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTemplate(template);
                              setActiveTab("generate");
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Document
                          </DropdownMenuItem>
                          {!template.isSystem && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Template
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Template
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={template.isSystem ? "secondary" : "outline"}>
                          {template.category}
                        </Badge>
                        {template.isSystem && (
                          <Badge variant="default" className="text-xs">
                            System
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-primary-foreground mb-2">
                No templates found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters." 
                  : "Create your first document template to get started."
                }
              </p>
              {!searchQuery && selectedCategory === "all" && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary-foreground">Generate Document</CardTitle>
              <p className="text-muted-foreground">
                Select a template and provide property details to generate a personalized document.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Select Template</Label>
                  <Select
                    value={selectedTemplate?.id || ""}
                    onValueChange={(value) => {
                      const template = templates.find(t => t.id === value);
                      setSelectedTemplate(template || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center gap-2">
                            <span>{template.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Property</Label>
                  <Select
                    value={generateForm.propertyId}
                    onValueChange={(value) => setGenerateForm({ ...generateForm, propertyId: value, tenantId: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.address}, {property.city}, {property.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {generateForm.propertyId && (
                  <div>
                    <Label>Select Tenant (Optional)</Label>
                    <Select
                      value={generateForm.tenantId}
                      onValueChange={(value) => setGenerateForm({ ...generateForm, tenantId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No specific tenant</SelectItem>
                        {filteredTenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name} ({tenant.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label>Document Title (Optional)</Label>
                  <Input
                    value={generateForm.title}
                    onChange={(e) => setGenerateForm({ ...generateForm, title: e.target.value })}
                    placeholder="Custom document title"
                  />
                </div>
              </div>

              {selectedTemplate && (
                <div>
                  <Label>Template Preview</Label>
                  <div className="mt-2 p-4 bg-muted rounded-md text-sm">
                    <div className="font-medium mb-2">{selectedTemplate.name}</div>
                    <div className="text-muted-foreground line-clamp-3">
                      {selectedTemplate.content.substring(0, 200)}...
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTemplate(null);
                    setGenerateForm({
                      propertyId: "",
                      tenantId: "",
                      title: "",
                      shareWithTenant: false,
                      customVariables: {},
                    });
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={handleGenerateDocument}
                  disabled={!selectedTemplate || !generateForm.propertyId || generationLoading}
                >
                  {generationLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generate Document
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 