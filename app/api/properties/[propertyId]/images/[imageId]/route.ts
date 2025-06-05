import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { deleteFile, PROPERTY_IMAGES_BUCKET } from "@/lib/supabase-storage";

export async function DELETE(
  request: Request,
  { params }: { params: { propertyId: string; imageId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized: Not a landlord or not authenticated." },
        { status: 401 }
      );
    }

    const { propertyId, imageId } = params;

    if (!propertyId || !imageId) {
      return NextResponse.json(
        { message: "Property ID and Image ID are required." },
        { status: 400 }
      );
    }

    // Verify property exists and belongs to the user
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { userId: true }, // Only select what's needed
    });

    if (!property) {
      return NextResponse.json(
        { message: "Property not found." },
        { status: 404 }
      );
    }

    if (property.userId !== user.id) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this property." },
        { status: 403 }
      );
    }

    // Find the image to be deleted
    const imageToDelete = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!imageToDelete) {
      return NextResponse.json(
        { message: "Image not found." },
        { status: 404 }
      );
    }

    // Ensure the image belongs to the specified property (belt and suspenders)
    if (imageToDelete.propertyId !== propertyId) {
      return NextResponse.json(
        { message: "Image does not belong to this property." },
        { status: 400 } // Or 404 if we consider it "not found" in this context
      );
    }

    // Delete from Supabase Storage
    if (imageToDelete.storagePath) {
      const { success, error: deleteStorageError } = await deleteFile(
        PROPERTY_IMAGES_BUCKET,
        imageToDelete.storagePath
      );
      if (!success) {
        console.error("Supabase delete error:", deleteStorageError);
        // Don't block DB deletion if storage deletion fails, but log it.
        // Depending on requirements, this could be a hard stop.
      }
    } else {
      console.warn(
        `Image ${imageId} has no storagePath, cannot delete from Supabase.`
      );
    }

    // Delete from database
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    // If the deleted image was primary, try to set another one as primary
    if (imageToDelete.isPrimary) {
      const remainingImages = await prisma.propertyImage.findMany({
        where: { propertyId: propertyId },
        orderBy: { uploadedAt: "desc" }, // Pick the most recent as new primary
      });
      if (remainingImages.length > 0) {
        await prisma.propertyImage.update({
          where: { id: remainingImages[0].id },
          data: { isPrimary: true },
        });
      }
    }

    return NextResponse.json({ message: "Image deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting property image:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
