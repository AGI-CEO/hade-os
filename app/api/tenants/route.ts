import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
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
      },
    });

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Format dates properly
    const leaseStart = body.leaseStart ? new Date(body.leaseStart) : new Date();
    const leaseEnd = body.leaseEnd ? new Date(body.leaseEnd) : new Date();
    const lastPayment = body.lastPayment ? new Date(body.lastPayment) : null;

    // Start a transaction to ensure both tenant creation and property update succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create the tenant
      const tenant = await tx.tenant.create({
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          image: body.image,
          leaseStart,
          leaseEnd,
          status: body.status || "pending",
          rentAmount: body.rentAmount,
          lastPayment,
          happinessScore: body.happinessScore || 0,
          propertyId: body.propertyId,
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
        },
      });

      // Always update the property's occupancy status
      // If the tenant is active, set the property as occupied and update rentAmount
      // If the tenant is not active, we still update the property but don't change occupancy
      if (body.status === "active") {
        await tx.property.update({
          where: { id: body.propertyId },
          data: {
            occupancy: "occupied",
            rentAmount: body.rentAmount,
          },
        });
      } else {
        // For non-active tenants, we still update the rentAmount for future activation
        await tx.property.update({
          where: { id: body.propertyId },
          data: {
            rentAmount: body.rentAmount,
          },
        });
      }

      return tenant;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Failed to create tenant", details: error.message },
      { status: 500 }
    );
  }
}
