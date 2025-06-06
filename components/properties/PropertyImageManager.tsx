"use client";

import { useState } from "react";
import {
  Upload,
  Trash2,
  Star,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type PropertyImage = {
  id: string;
  imageUrl: string;
  altText: string | null;
  isPrimary: boolean;
};

type PropertyImageManagerProps = {
  propertyId: string;
  images: PropertyImage[];
  onImageUpdate: () => void;
};

export function PropertyImageManager({
  propertyId,
  images: initialImages,
  onImageUpdate,
}: PropertyImageManagerProps) {
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<PropertyImage | null>(
    null
  );

  const primaryImage = images.find((img) => img.isPrimary);
  const otherImages = images.filter((img) => !img.isPrimary);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("altText", altText);
    formData.append("isPrimary", String(isPrimary));

    try {
      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Image upload failed");
      }

      toast.success("Image uploaded successfully!");
      onImageUpdate(); // Re-fetch property data on parent
      // Reset form
      setSelectedFile(null);
      setAltText("");
      setIsPrimary(false);
      // It's better to refetch than to manually update state here
      // to ensure consistency, but for now we'll rely on the parent refetch
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch(
        `/api/properties/${propertyId}/images/${imageToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete image");
      }

      toast.success("Image deleted successfully.");
      onImageUpdate();
      setImageToDelete(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Card className="bg-card/50">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ImageIcon className="mr-2 h-5 w-5" />
          Property Images
        </h2>

        {/* Upload Section */}
        <div className="mb-6 p-4 border border-dashed rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <Label htmlFor="image-upload" className="mb-2 block">
                Upload New Image
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Alt text (for accessibility)"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                disabled={isUploading}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-primary"
                  checked={isPrimary}
                  onCheckedChange={(checked) => setIsPrimary(Boolean(checked))}
                  disabled={isUploading}
                />
                <Label htmlFor="is-primary">Set as primary image</Label>
              </div>
            </div>
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="w-full mt-4"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Image
          </Button>
        </div>

        {/* Image Gallery */}
        <div>
          {images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No images have been uploaded for this property yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Image */}
              {primaryImage && (
                <div>
                  <h3 className="font-semibold mb-2">Primary Image</h3>
                  <div className="relative group">
                    <img
                      src={primaryImage.imageUrl}
                      alt={primaryImage.altText || "Primary property image"}
                      className="rounded-lg w-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1" /> Primary
                    </div>
                  </div>
                </div>
              )}

              {/* Other Images */}
              {otherImages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {otherImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.imageUrl}
                          alt={image.altText || "Property image"}
                          className="rounded-lg aspect-square object-cover w-full"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => setImageToDelete(image)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!imageToDelete}
        onOpenChange={(isOpen) => !isOpen && setImageToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              image from the servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
