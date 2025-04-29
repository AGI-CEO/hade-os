import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/leases/[id] - Get a specific lease
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
    
    const lease = await prisma.lease.findUnique({
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
            phone: true,
            userId: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            fileType: true,
            category: true,
            createdAt: true,
          },
        },
      },
    });
    
    if (!lease) {
      return NextResponse.json(
        { message: "Lease not found" },
        { status: 404 }
      );
    }
    
    // For tenants, only allow access to their own leases
    if (user.userType === "tenant") {
      const tenant = await prisma.tenant.findFirst({
        where: { userId: user.id },
        select: { id: true },
      });
      
      if (!tenant || tenant.id !== lease.tenantId) {
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(lease);
  } catch (error) {
    console.error("Error fetching lease:", error);
    return NextResponse.json(
      { message: "Failed to fetch lease" },
      { status: 500 }
    );
  }
}

// PUT /api/leases/[id] - Update a lease
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
    
    // Only landlords can update leases
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.startDate || !body.endDate || !body.monthlyRent) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Format dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    
    // Get the current lease to check if status is changing
    const currentLease = await prisma.lease.findUnique({
      where: { id: params.id },
      select: { status: true, tenantId: true },
    });
    
    if (!currentLease) {
      return NextResponse.json(
        { message: "Lease not found" },
        { status: 404 }
      );
    }
    
    // Update the lease
    const lease = await prisma.lease.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        content: body.content,
        startDate,
        endDate,
        status: body.status,
        monthlyRent: body.monthlyRent,
        securityDeposit: body.securityDeposit,
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
            phone: true,
          },
        },
      },
    });
    
    // If the lease is being activated or the dates/rent changed while active,
    // update the tenant's lease dates and rent amount
    if (body.status === "active") {
      await prisma.tenant.update({
        where: { id: currentLease.tenantId },
        data: {
          leaseStart: startDate,
          leaseEnd: endDate,
          rentAmount: body.monthlyRent,
        },
      });
    }
    
    return NextResponse.json(lease);
  } catch (error) {
    console.error("Error updating lease:", error);
    return NextResponse.json(
      { message: "Failed to update lease" },
      { status: 500 }
    );
  }
}

// DELETE /api/leases/[id] - Delete a lease
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
    
    // Only landlords can delete leases
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Check if the lease exists
    const lease = await prisma.lease.findUnique({
      where: { id: params.id },
      select: { id: true },
    });
    
    if (!lease) {
      return NextResponse.json(
        { message: "Lease not found" },
        { status: 404 }
      );
    }
    
    // Delete the lease
    await prisma.lease.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json({ message: "Lease deleted" });
  } catch (error) {
    console.error("Error deleting lease:", error);
    return NextResponse.json(
      { message: "Failed to delete lease" },
      { status: 500 }
    );
  }
}
