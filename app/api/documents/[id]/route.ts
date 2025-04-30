import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { deleteFile } from "@/lib/supabase-storage";

// GET /api/documents/[id] - Get a specific document
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const document = await prisma.document.findUnique({
      where: {
        id: params.id,
      },
      include: {
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
            userId: true,
          },
        },
        lease: {
          select: {
            id: true,
            title: true,
            tenantId: true,
            propertyId: true,
          },
        },
      },
    });
    
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }
    
    // For tenants, only allow access to their own documents or shared documents
    if (user.userType === "tenant") {
      const tenant = await prisma.tenant.findFirst({
        where: { userId: user.id },
        select: { id: true, propertyId: true },
      });
      
      if (!tenant) {
        return NextResponse.json(
          { message: "Tenant record not found" },
          { status: 404 }
        );
      }
      
      const isOwnDocument = document.tenantId === tenant.id;
      const isSharedDocument = document.isShared && document.propertyId === tenant.propertyId;
      
      if (!isOwnDocument && !isSharedDocument) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { message: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

// PATCH /api/documents/[id] - Update a document
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Get the document to update
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        tenant: {
          select: { userId: true },
        },
      },
    });
    
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }
    
    // For tenants, verify they can only update their own documents
    if (user.userType === "tenant") {
      const tenant = await prisma.tenant.findFirst({
        where: { userId: user.id },
        select: { id: true },
      });
      
      if (!tenant || document.tenantId !== tenant.id) {
        return NextResponse.json(
          { message: "You can only update your own documents" },
          { status: 403 }
        );
      }
      
      // Tenants can only update certain fields
      const allowedFields = ["name", "description"];
      const updateData: any = {};
      
      for (const field of allowedFields) {
        if (body[field] !== undefined) {
          updateData[field] = body[field];
        }
      }
      
      const updatedDocument = await prisma.document.update({
        where: { id: params.id },
        data: updateData,
      });
      
      return NextResponse.json(updatedDocument);
    }
    
    // For landlords, allow updating all fields
    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        category: body.category,
        isShared: body.isShared,
        propertyId: body.propertyId,
        tenantId: body.tenantId,
        leaseId: body.leaseId,
      },
    });
    
    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { message: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Get the document to delete
    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });
    
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }
    
    // For tenants, verify they can only delete their own documents
    if (user.userType === "tenant") {
      const tenant = await prisma.tenant.findFirst({
        where: { userId: user.id },
        select: { id: true },
      });
      
      if (!tenant || document.tenantId !== tenant.id) {
        return NextResponse.json(
          { message: "You can only delete your own documents" },
          { status: 403 }
        );
      }
    }
    
    // Delete the file from storage
    const fileUrl = document.fileUrl;
    const filePath = fileUrl.split('/').pop();
    
    if (filePath) {
      await deleteFile(filePath);
    }
    
    // Delete the document from the database
    await prisma.document.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { message: "Failed to delete document" },
      { status: 500 }
    );
  }
}
