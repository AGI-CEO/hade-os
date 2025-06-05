import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import {
  uploadFile,
  PROPERTY_IMAGES_BUCKET,
  initializeStorage,
} from "@/lib/supabase-storage";
import { NextApiRequest } from "next";

// Ensure Supabase storage buckets are initialized on startup
// This might be better placed in a global startup script, but for now,
// calling it here ensures it runs before first use in this route.
initializeStorage().catch(console.error);

export async function POST(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized: Not a landlord or not authenticated." },
        { status: 401 }
      );
    }

    const propertyId = params.propertyId;
    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID is required." },
        { status: 400 }
      );
    }

    // Verify property exists and belongs to the user
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = formData.get("altText") as string | null;
    const isPrimaryStr = formData.get("isPrimary") as string | null;
    let isPrimary = isPrimaryStr === "true";

    if (!file) {
      return NextResponse.json(
        { message: "File is required." },
        { status: 400 }
      );
    }

    // Sanitize filename and create a unique path
    const fileName = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    )}`;
    const storagePath = `property-images/${propertyId}/${fileName}`;

    const {
      url: imageUrl,
      fullPath,
      error: uploadError,
    } = await uploadFile(PROPERTY_IMAGES_BUCKET, file, storagePath);

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { message: "Failed to upload image.", error: uploadError.message },
        { status: 500 }
      );
    }

    // If this image is set to primary, ensure other images for the same property are not primary.
    if (isPrimary) {
      await prisma.propertyImage.updateMany({
        where: {
          propertyId: propertyId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    } else {
      // If no other image is primary, make this one primary by default
      const primaryImageCount = await prisma.propertyImage.count({
        where: { propertyId: propertyId, isPrimary: true },
      });
      if (primaryImageCount === 0) {
        isPrimary = true;
      }
    }

    const propertyImage = await prisma.propertyImage.create({
      data: {
        propertyId: propertyId,
        imageUrl: imageUrl,
        storagePath: fullPath, // Use fullPath returned by uploadFile
        altText: altText,
        isPrimary: isPrimary,
      },
    });

    return NextResponse.json(propertyImage, { status: 201 });
  } catch (error: any) {
    console.error("Error uploading property image:", error);
    // Check for Prisma-specific errors if necessary, e.g., unique constraint violation
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    // For now, allowing any authenticated user to fetch images for a property.
    // This could be tightened based on roles (e.g., landlord of property, tenant of property).
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Not authenticated." },
        { status: 401 }
      );
    }

    const propertyId = params.propertyId;
    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID is required." },
        { status: 400 }
      );
    }

    // Optional: Verify property exists before fetching images
    // const propertyExists = await prisma.property.findUnique({ where: { id: propertyId } });
    // if (!propertyExists) {
    //   return NextResponse.json({ message: "Property not found." }, { status: 404 });
    // }

    const images = await prisma.propertyImage.findMany({
      where: {
        propertyId: propertyId,
      },
      orderBy: [
        { isPrimary: "desc" }, // Primary image first
        { uploadedAt: "asc" }, // Then by upload date
      ],
    });

    return NextResponse.json(images);
  } catch (error: any) {
    console.error("Error fetching property images:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
