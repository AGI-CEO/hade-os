import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    // For demo purposes, we'll hardcode a user ID
    // In a real app, this would come from authentication
    const userId = "00000000-0000-0000-0000-000000000000";

    // First, ensure we have a user with this ID
    let user;
    try {
      user = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: "demo@example.com",
          name: "Demo User",
          password: "password123", // In a real app, this would be hashed
          role: "user",
        },
      });
      console.log("User found or created:", user);
    } catch (userError) {
      console.error("Error ensuring user exists:", userError);
      throw userError;
    }

    const property = await prisma.property.create({
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
        userId: userId,
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);

    return NextResponse.json(
      { error: "Failed to create property", details: error.message },
      { status: 500 }
    );
  }
}
