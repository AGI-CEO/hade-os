import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/lease-templates/[id] - Get a specific lease template
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
    
    // Only landlords can access lease templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const template = await prisma.leaseTemplate.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!template) {
      return NextResponse.json(
        { message: "Lease template not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching lease template:", error);
    return NextResponse.json(
      { message: "Failed to fetch lease template" },
      { status: 500 }
    );
  }
}

// PUT /api/lease-templates/[id] - Update a lease template
export async function PUT(
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
    
    // Only landlords can update lease templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.content) {
      return NextResponse.json(
        { message: "Name and content are required" },
        { status: 400 }
      );
    }
    
    const template = await prisma.leaseTemplate.update({
      where: {
        id: params.id,
      },
      data: {
        name: body.name,
        description: body.description,
        content: body.content,
      },
    });
    
    return NextResponse.json(template);
  } catch (error) {
    console.error("Error updating lease template:", error);
    return NextResponse.json(
      { message: "Failed to update lease template" },
      { status: 500 }
    );
  }
}

// DELETE /api/lease-templates/[id] - Delete a lease template
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
    
    // Only landlords can delete lease templates
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Check if the template is used by any leases
    const leaseCount = await prisma.lease.count({
      where: {
        templateId: params.id,
      },
    });
    
    if (leaseCount > 0) {
      return NextResponse.json(
        { message: "Cannot delete template that is used by leases" },
        { status: 400 }
      );
    }
    
    await prisma.leaseTemplate.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json({ message: "Lease template deleted" });
  } catch (error) {
    console.error("Error deleting lease template:", error);
    return NextResponse.json(
      { message: "Failed to delete lease template" },
      { status: 500 }
    );
  }
}
