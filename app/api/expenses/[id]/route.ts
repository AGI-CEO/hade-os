import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

// GET /api/expenses/[id] - Get a specific expense entry
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const expense = await prisma.expense.findUnique({
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
        vendor: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    if (!expense) {
      return NextResponse.json(
        { error: "Expense entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense entry" },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id] - Update a specific expense entry
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
    
    // Check if expense entry exists
    const existingExpense = await prisma.expense.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingExpense) {
      return NextResponse.json(
        { error: "Expense entry not found" },
        { status: 404 }
      );
    }
    
    // Update expense entry
    const updatedExpense = await prisma.expense.update({
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
        vendorId: body.vendorId || null,
      },
    });
    
    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense entry:", error);
    return NextResponse.json(
      { error: "Failed to update expense entry" },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete a specific expense entry
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
    
    // Check if expense entry exists
    const existingExpense = await prisma.expense.findUnique({
      where: {
        id: params.id,
      },
    });
    
    if (!existingExpense) {
      return NextResponse.json(
        { error: "Expense entry not found" },
        { status: 404 }
      );
    }
    
    // Delete expense entry
    await prisma.expense.delete({
      where: {
        id: params.id,
      },
    });
    
    return NextResponse.json(
      { message: "Expense entry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting expense entry:", error);
    return NextResponse.json(
      { error: "Failed to delete expense entry" },
      { status: 500 }
    );
  }
}
