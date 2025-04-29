import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// POST /api/leases/generate - Generate a lease from a template
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Only landlords can generate leases
    if (user.userType !== "landlord") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.templateId || !body.propertyId || !body.tenantId || !body.startDate || !body.endDate || !body.monthlyRent) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Get the template
    const template = await prisma.leaseTemplate.findUnique({
      where: { id: body.templateId },
    });
    
    if (!template) {
      return NextResponse.json(
        { message: "Template not found" },
        { status: 404 }
      );
    }
    
    // Get property and tenant details for template variables
    const property = await prisma.property.findUnique({
      where: { id: body.propertyId },
    });
    
    const tenant = await prisma.tenant.findUnique({
      where: { id: body.tenantId },
    });
    
    if (!property || !tenant) {
      return NextResponse.json(
        { message: "Property or tenant not found" },
        { status: 404 }
      );
    }
    
    // Format dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const formattedStartDate = startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedEndDate = endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    // Replace template variables with actual values
    let content = template.content;
    
    // Property variables
    content = content.replace(/\{PROPERTY_ADDRESS\}/g, property.address);
    content = content.replace(/\{PROPERTY_CITY\}/g, property.city);
    content = content.replace(/\{PROPERTY_STATE\}/g, property.state);
    content = content.replace(/\{PROPERTY_ZIP\}/g, property.zipCode);
    content = content.replace(/\{PROPERTY_FULL_ADDRESS\}/g, `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`);
    
    // Tenant variables
    content = content.replace(/\{TENANT_NAME\}/g, tenant.name);
    content = content.replace(/\{TENANT_EMAIL\}/g, tenant.email);
    content = content.replace(/\{TENANT_PHONE\}/g, tenant.phone);
    
    // Lease variables
    content = content.replace(/\{LEASE_START_DATE\}/g, formattedStartDate);
    content = content.replace(/\{LEASE_END_DATE\}/g, formattedEndDate);
    content = content.replace(/\{MONTHLY_RENT\}/g, body.monthlyRent.toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    content = content.replace(/\{SECURITY_DEPOSIT\}/g, (body.securityDeposit || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }));
    
    // Current date
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    content = content.replace(/\{CURRENT_DATE\}/g, currentDate);
    
    // Create a title for the lease
    const title = `Lease Agreement - ${tenant.name} - ${property.address}`;
    
    // Create the lease
    const lease = await prisma.lease.create({
      data: {
        title,
        content,
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
    
    return NextResponse.json(lease, { status: 201 });
  } catch (error) {
    console.error("Error generating lease:", error);
    return NextResponse.json(
      { message: "Failed to generate lease" },
      { status: 500 }
    );
  }
}
