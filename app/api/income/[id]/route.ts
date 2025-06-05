import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/income/[id] - Get a specific income entry
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const income = await prisma.income.findUnique({
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

    if (!income) {
      return NextResponse.json(
        { error: "Income entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error fetching income entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch income entry" },
      { status: 500 }
    );
  }
}

// PUT /api/income/[id] - Update a specific income entry
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.amount || !body.date || !body.category || !body.propertyId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if income entry exists
    const existingIncome = await prisma.income.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingIncome) {
      return NextResponse.json(
        { error: "Income entry not found" },
        { status: 404 }
      );
    }
    
    // Update income entry
    const updatedIncome = await prisma.income.update({
      where: {
        id: params.id,
      },
      data: {
        amount: parseFloat(body.amount),
        date: new Date(body.date),
        category: body.category,
        description: body.description || null,
        recurring: body.recurring || false,
        propertyId: body.propertyId,
      },
    });
    
    return NextResponse.json(updatedIncome);
  } catch (error) {
    console.error("Error updating income entry:", error);
    return NextResponse.json(
      { error: "Failed to update income entry" },
      { status: 500 }
    );
  }
}

// DELETE /api/income/[id] - Delete a specific income entry
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Check if income entry exists
    const existingIncome = await prisma.income.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingIncome) {
      return NextResponse.json(
        { error: "Income entry not found" },
        { status: 404 }
      );
    }
    
    // Delete income entry
    await prisma.income.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json(
      { message: "Income entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting income entry:", error);
    return NextResponse.json(
      { error: "Failed to delete income entry" },
      { status: 500 }
    );
  }
}
