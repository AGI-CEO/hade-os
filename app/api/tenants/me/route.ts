import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Check if the user is a tenant
    if (user.userType !== "tenant") {
      return NextResponse.json(
        { message: "User is not a tenant" },
        { status: 403 }
      );
    }

    // Get the tenant data
    const tenant = await prisma.tenant.findFirst({
      where: { userId: user.id },
      include: {
        property: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            zipCode: true,
            image: true,
            rentAmount: true,
            rentDue: true,
          },
        },
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { message: "Tenant data not found" },
        { status: 404 }
      );
    }

    // Get maintenance requests for the tenant's property
    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: { propertyId: tenant.propertyId },
      orderBy: { createdAt: "desc" },
    });

    // Get upcoming rent payments
    const upcomingPayments = await prisma.rentPayment.findMany({
      where: { 
        tenantId: tenant.id,
        status: { in: ["UPCOMING", "UNPAID", "LATE"] }
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    });

    // Combine the data
    const tenantData = {
      ...tenant,
      maintenanceRequests,
      upcomingPayments,
    };

    return NextResponse.json(tenantData);
  } catch (error) {
    console.error("Error getting tenant data:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.userType !== "tenant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const updatedTenant = await prismaClient.$transaction(async (tx) => {
      // First, update the User model
      await tx.user.update({
        where: { id: user.id },
        data: {
          name: body.name,
          email: body.email,
        },
      });

      // Then, update the Tenant model
      const tenant = await tx.tenant.update({
        where: { userId: user.id },
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
        },
      });

      return tenant;
    });

    return NextResponse.json(updatedTenant);
  } catch (error) {
    console.error("Error updating tenant profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
