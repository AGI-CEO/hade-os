import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/leases - Get all leases
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
    const propertyId = searchParams.get("propertyId");
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    
    // Build the query based on user type and filters
    const query: any = {};
    
    // Apply filters if provided
    if (propertyId) query.propertyId = propertyId;
    if (tenantId) query.tenantId = tenantId;
    if (status) query.status = status;
    
    // For tenants, only show their own leases
    if (user.userType === "tenant") {
      // Get the tenant record for this user
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
      
      query.tenantId = tenant.id;
    }
    
    const leases = await prisma.lease.findMany({
      where: query,
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
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(leases);
  } catch (error) {
    console.error("Error fetching leases:", error);
    return NextResponse.json(
      { message: "Failed to fetch leases" },
      { status: 500 }
    );
  }
}

// POST /api/leases - Create a new lease
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only landlords can create leases
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.content || !body.propertyId || !body.tenantId || !body.startDate || !body.endDate || !body.monthlyRent) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Format dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    
    // Create the lease
    const lease = await prisma.lease.create({
      data: {
        title: body.title,
        content: body.content,
        startDate,
        endDate,
        status: body.status || "draft",
        monthlyRent: body.monthlyRent,
        securityDeposit: body.securityDeposit,
        propertyId: body.propertyId,
        tenantId: body.tenantId,
        templateId: body.templateId,
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
    
    // If the lease is active, update the tenant's lease dates and rent amount
    if (body.status === "active") {
      await prisma.tenant.update({
        where: { id: body.tenantId },
        data: {
          leaseStart: startDate,
          leaseEnd: endDate,
          rentAmount: body.monthlyRent,
        },
      });
    }
    
    return NextResponse.json(lease, { status: 201 });
  } catch (error) {
    console.error("Error creating lease:", error);
    return NextResponse.json(
      { message: "Failed to create lease" },
      { status: 500 }
    );
  }
}
