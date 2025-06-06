import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: params.propertyId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        maintenanceRequests: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    const body = await request.json();

    const property = await prisma.property.update({
      where: {
        id: params.propertyId,
      },
      data: {
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        image: body.image,
        value: body.value,
        occupancy: body.occupancy,
        rentAmount: body.rentAmount,
        rentDue: body.rentDue ? new Date(body.rentDue) : null,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { propertyId: string } }
) {
  try {
    await prisma.property.delete({
      where: {
        id: params.propertyId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
