import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { deleteFile } from "@/lib/supabase-storage";

// GET /api/documents - Get all documents
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const propertyId = searchParams.get("propertyId");
    const tenantId = searchParams.get("tenantId");
    const leaseId = searchParams.get("leaseId");
    const shared = searchParams.get("shared");
    
    // Build the query based on user type and filters
    const query: any = {};
    
    // Apply filters if provided
    if (category) query.category = category;
    if (propertyId) query.propertyId = propertyId;
    if (tenantId) query.tenantId = tenantId;
    if (leaseId) query.leaseId = leaseId;
    if (shared) query.isShared = shared === "true";
    
    // For tenants, only show their own documents or shared documents
    if (user.userType === "tenant") {
      // Get the tenant record for this user
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
      
      // Show documents that are either:
      // 1. Directly associated with this tenant
      // 2. Shared with this tenant (isShared = true and associated with their property)
      query.OR = [
        { tenantId: tenant.id },
        { 
          AND: [
            { isShared: true },
            { propertyId: tenant.propertyId }
          ]
        }
      ];
    }
    
    const documents = await prisma.document.findMany({
      where: query,
      include: {
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lease: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { message: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create a new document
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.fileUrl || !body.fileType) {
      return NextResponse.json(
        { message: "Name, fileUrl, and fileType are required" },
        { status: 400 }
      );
    }
    
    // Create the document
    const document = await prisma.document.create({
      data: {
        name: body.name,
        description: body.description || "",
        fileUrl: body.fileUrl,
        fileType: body.fileType,
        fileSize: body.fileSize || 0,
        category: body.category || "other",
        isShared: body.isShared || false,
        propertyId: body.propertyId,
        tenantId: body.tenantId,
        leaseId: body.leaseId,
      },
    });
    
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json(
      { message: "Failed to create document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents - Delete multiple documents
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        { message: "Document IDs are required" },
        { status: 400 }
      );
    }
    
    // Get the documents to delete
    const documents = await prisma.document.findMany({
      where: {
        id: { in: body.ids },
      },
    });
    
    // For tenants, verify they can only delete their own documents
    if (user.userType === "tenant") {
      const tenant = await prisma.tenant.findFirst({
        where: { userId: user.id },
        select: { id: true },
      });
      
      if (!tenant) {
        return NextResponse.json(
          { message: "Tenant record not found" },
          { status: 404 }
        );
      }
      
      const canDelete = documents.every(doc => doc.tenantId === tenant.id);
      
      if (!canDelete) {
        return NextResponse.json(
          { message: "You can only delete your own documents" },
          { status: 403 }
        );
      }
    }
    
    // Delete the files from storage
    for (const document of documents) {
      // Extract the file path from the URL
      const fileUrl = document.fileUrl;
      const filePath = fileUrl.split('/').pop();
      
      if (filePath) {
        await deleteFile(filePath);
      }
    }
    
    // Delete the documents from the database
    await prisma.document.deleteMany({
      where: {
        id: { in: body.ids },
      },
    });
    
    return NextResponse.json({ message: "Documents deleted successfully" });
  } catch (error) {
    console.error("Error deleting documents:", error);
    return NextResponse.json(
      { message: "Failed to delete documents" },
      { status: 500 }
    );
  }
}
