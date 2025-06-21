import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// POST /api/documents/share - Share a document with tenants
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only landlords can share documents
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Only landlords can share documents" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.documentId) {
      return NextResponse.json(
        { message: "Document ID is required" },
        { status: 400 }
      );
    }
    
    // Get the document
    const document = await prisma.document.findUnique({
      where: { id: body.documentId },
    });
    
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }
    
    // Update the document to be shared
    const updatedDocument = await prisma.document.update({
      where: { id: body.documentId },
      data: { isShared: true },
      include: {
        property: {
          include: {
            tenants: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // ---------------------------------------------
    // Notification logic for shared document
    // ---------------------------------------------
    try {
      if (updatedDocument.property) {
        const { tenants } = updatedDocument.property;
        const { createNotification } = await import("@/lib/notifications");

        // Notify tenants who have user accounts
        await Promise.all(
          tenants
            .filter((tenant: any) => tenant.userId)
            .map((tenant: any) =>
              createNotification({
                userId: tenant.userId!,
                message: `A new document "${updatedDocument.name}" has been shared with you`,
                type: "NEW_DOCUMENT_SHARED" as any,
                propertyId: updatedDocument.propertyId!,
                tenantId: tenant.id,
                relatedEntityType: "Document",
                relatedEntityId: updatedDocument.id,
              })
            )
        );
      }
    } catch (notificationError) {
      console.error("Failed to create document share notification:", notificationError);
    }
    
    return NextResponse.json({
      message: "Document shared successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Error sharing document:", error);
    return NextResponse.json(
      { message: "Failed to share document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/share - Unshare a document
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only landlords can unshare documents
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Only landlords can unshare documents" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.documentId) {
      return NextResponse.json(
        { message: "Document ID is required" },
        { status: 400 }
      );
    }
    
    // Get the document
    const document = await prisma.document.findUnique({
      where: { id: body.documentId },
    });
    
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }
    
    // Update the document to be unshared
    const updatedDocument = await prisma.document.update({
      where: { id: body.documentId },
      data: { isShared: false },
    });
    
    return NextResponse.json({
      message: "Document unshared successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Error unsharing document:", error);
    return NextResponse.json(
      { message: "Failed to unshare document" },
      { status: 500 }
    );
  }
}
