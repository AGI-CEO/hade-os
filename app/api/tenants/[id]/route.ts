import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tenant = await prisma.tenant.findUnique({
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
      },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(tenant);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { error: "Failed to fetch tenant" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Format dates properly
    const leaseStart = body.leaseStart ? new Date(body.leaseStart) : undefined;
    const leaseEnd = body.leaseEnd ? new Date(body.leaseEnd) : undefined;
    const lastPayment = body.lastPayment
      ? new Date(body.lastPayment)
      : undefined;

    // Use a transaction to ensure both tenant and property updates succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Update the tenant
      const tenant = await tx.tenant.update({
        where: {
          id: params.id,
        },
        data: {
          name: body.name,
          email: body.email,
          phone: body.phone,
          image: body.image,
          leaseStart,
          leaseEnd,
          status: body.status,
          rentAmount: body.rentAmount,
          lastPayment,
          happinessScore: body.happinessScore,
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

      // If the tenant is active, update the property's occupancy and rent amount
      if (body.status === "active") {
        await tx.property.update({
          where: { id: body.propertyId },
          data: {
            occupancy: "occupied",
            rentAmount: body.rentAmount,
          },
        });
      }

      return tenant;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating tenant:", error);
    return NextResponse.json(
      { error: "Failed to update tenant" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.tenant.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return NextResponse.json(
      { error: "Failed to delete tenant" },
      { status: 500 }
    );
  }
}
